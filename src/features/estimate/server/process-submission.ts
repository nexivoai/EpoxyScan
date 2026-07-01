import 'server-only'
import { and, eq, gte, isNull, lt, sql } from 'drizzle-orm'
import { AI_DEFAULTS, MAX_PROCESSING_ATTEMPTS, PROCESSING_STALE_MS } from '@/constants/ai'
import type { AnalysisResult } from '@/lib/ai/schema'
import { analyzeSubmissionImages } from '@/lib/ai/vision'
import { getDb, schema } from '@/lib/db/client'
import { AiTransientError, AiValidationError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'
import { notifyContractor, notifyContractorFailure } from '@/lib/notifications/submission'
import { calculateEstimate } from '@/lib/pricing/calculate-estimate'
import { retry } from '@/lib/retry'
import type { SubmissionStatus, VerificationReason } from '@/types/domain'
import type { EstimateResult } from '@/types/estimate'

const log = createLogger('process-submission')

async function claim(id: string) {
  const db = getDb()
  const [claimed] = await db
    .update(schema.submissions)
    .set({
      status: 'processing',
      processingStartedAt: new Date(),
      attemptCount: sql`${schema.submissions.attemptCount} + 1`,
    })
    .where(and(eq(schema.submissions.id, id), eq(schema.submissions.status, 'pending_ai')))
    .returning()
  return claimed ?? null
}

async function loadPhotoUrls(id: string): Promise<string[]> {
  const db = getDb()
  const rows = await db
    .select({ url: schema.photos.url })
    .from(schema.photos)
    .where(eq(schema.photos.submissionId, id))
  return rows.map((row) => row.url)
}

function reviewFlags(analysis: AnalysisResult): {
  needsVerification: boolean
  verificationReason: VerificationReason | null
} {
  if (analysis.imageQuality === 'poor') {
    return { needsVerification: true, verificationReason: 'poor_image_quality' }
  }
  if (analysis.confidence < AI_DEFAULTS.confidenceThreshold) {
    return { needsVerification: true, verificationReason: 'low_confidence' }
  }
  return { needsVerification: false, verificationReason: null }
}

async function saveResults(
  id: string,
  analysis: AnalysisResult,
  estimate: EstimateResult,
  status: SubmissionStatus,
): Promise<void> {
  const db = getDb()
  const flags = reviewFlags(analysis)
  await db
    .update(schema.submissions)
    .set({
      aiProjectType: analysis.projectType,
      aiSqftLow: analysis.sqftLow,
      aiSqftHigh: analysis.sqftHigh,
      aiCrackSeverity: analysis.crackSeverity,
      aiRecommendedSystem: analysis.recommendedSystem,
      aiComplexity: analysis.complexity,
      aiImageQuality: analysis.imageQuality,
      aiConfidence: analysis.confidence,
      aiSurfaceFlags: analysis.surfaceFlags,
      aiRaw: analysis,
      aiError: null,
      priceLow: estimate.priceLow,
      priceHigh: estimate.priceHigh,
      sqftUsed: estimate.sqftUsed,
      sqftSource: estimate.sqftSource,
      prepMultiplier: estimate.prepMultiplier,
      priceBlockReason: estimate.blockReason,
      needsVerification: flags.needsVerification,
      verificationReason: flags.verificationReason,
      status,
    })
    .where(eq(schema.submissions.id, id))
}

async function markFailed(id: string, error: unknown): Promise<void> {
  const db = getDb()
  await db
    .update(schema.submissions)
    .set({ status: 'ai_failed', aiError: error instanceof Error ? error.message : String(error) })
    .where(eq(schema.submissions.id, id))
}

export async function processSubmission(id: string): Promise<void> {
  const claimed = await claim(id)
  if (!claimed) {
    log.info('skipped (not claimable)', { id })
    return
  }
  log.info('claimed', { id })

  try {
    const imageUrls = await loadPhotoUrls(id)
    if (imageUrls.length === 0) throw new Error('Submission has no photos')

    const analysis = await retry(() => analyzeSubmissionImages(imageUrls), {
      attempts: AI_DEFAULTS.maxRetries + 1,
      shouldRetry: (error) =>
        error instanceof AiValidationError || error instanceof AiTransientError,
      delayMs: (attempt) => AI_DEFAULTS.retryBackoffMs * attempt,
    })
    log.info('analyzed', {
      id,
      confidence: analysis.confidence,
      imageQuality: analysis.imageQuality,
    })

    const estimate = calculateEstimate({
      system: analysis.recommendedSystem,
      projectType: analysis.projectType,
      prepComplexity: analysis.complexity,
      crackSeverity: analysis.crackSeverity,
      customerSqft: claimed.customerSqft,
      aiSqftLow: analysis.sqftLow,
      aiSqftHigh: analysis.sqftHigh,
    })

    const status: SubmissionStatus = estimate.requiresInspection
      ? 'inspection_required'
      : 'ai_complete'
    await saveResults(id, analysis, estimate, status)
    log.info('completed', {
      id,
      status,
      priced: estimate.priced,
      blockReason: estimate.blockReason,
    })
    await notifyContractor(id)
  } catch (error) {
    log.error('failed', { id, error: error instanceof Error ? error.message : String(error) })
    await markFailed(id, error)
  }
}

async function requeueStaleProcessing(): Promise<void> {
  await getDb()
    .update(schema.submissions)
    .set({ status: 'pending_ai' })
    .where(
      and(
        eq(schema.submissions.status, 'processing'),
        lt(schema.submissions.processingStartedAt, new Date(Date.now() - PROCESSING_STALE_MS)),
      ),
    )
}

async function requeueRecoverableFailures(): Promise<void> {
  await getDb()
    .update(schema.submissions)
    .set({ status: 'pending_ai' })
    .where(
      and(
        eq(schema.submissions.status, 'ai_failed'),
        lt(schema.submissions.attemptCount, MAX_PROCESSING_ATTEMPTS),
      ),
    )
}

async function alertExhaustedFailures(): Promise<void> {
  const exhausted = await getDb()
    .select({ id: schema.submissions.id })
    .from(schema.submissions)
    .where(
      and(
        eq(schema.submissions.status, 'ai_failed'),
        gte(schema.submissions.attemptCount, MAX_PROCESSING_ATTEMPTS),
        isNull(schema.submissions.contractorNotifiedAt),
      ),
    )

  for (const row of exhausted) {
    await notifyContractorFailure(row.id)
  }
}

export async function sweepPendingSubmissions(): Promise<number> {
  await requeueStaleProcessing()
  await requeueRecoverableFailures()

  const pending = await getDb()
    .select({ id: schema.submissions.id })
    .from(schema.submissions)
    .where(eq(schema.submissions.status, 'pending_ai'))

  for (const row of pending) {
    await processSubmission(row.id)
  }

  await alertExhaustedFailures()

  return pending.length
}
