import 'server-only'
import { eq } from 'drizzle-orm'
import { config } from '@/lib/config'
import { getDb, schema } from '@/lib/db/client'
import { createLogger } from '@/lib/logger'
import {
  buildContractorFailureMessage,
  buildContractorMessage,
  buildCustomerMessage,
} from '@/lib/sms/messages'
import { toE164 } from '@/lib/sms/phone'
import { sendSms, type SmsResult } from '@/lib/sms/send'

const log = createLogger('notify')

const NOT_SENT: SmsResult = { sent: false, sid: null }

function reviewUrl(reviewToken: string): string {
  return `${config.app.baseUrl}/review/${reviewToken}`
}

function resultUrl(resultToken: string): string {
  return `${config.app.baseUrl}/result/${resultToken}`
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function loadSubmission(id: string) {
  const db = getDb()
  const [row] = await db.select().from(schema.submissions).where(eq(schema.submissions.id, id))
  return row ?? null
}

async function sendToContractor(id: string, body: string): Promise<SmsResult> {
  const to = toE164(config.app.contractorPhone)
  if (!to) {
    log.error('contractor phone invalid', { id })
    return NOT_SENT
  }

  try {
    const result = await sendSms({ to, body })
    await getDb()
      .update(schema.submissions)
      .set({ contractorNotifiedAt: new Date(), contractorMessageSid: result.sid })
      .where(eq(schema.submissions.id, id))
    return result
  } catch (error) {
    log.error('contractor notify failed', { id, error: errorMessage(error) })
    return NOT_SENT
  }
}

export async function notifyContractor(id: string): Promise<SmsResult> {
  const submission = await loadSubmission(id)
  if (!submission || submission.contractorNotifiedAt) return NOT_SENT

  const body = buildContractorMessage({
    customerName: submission.customerName,
    projectType: submission.aiProjectType,
    sqftLow: submission.aiSqftLow,
    sqftHigh: submission.aiSqftHigh,
    system: submission.aiRecommendedSystem,
    crackSeverity: submission.aiCrackSeverity,
    priceLow: submission.priceLow,
    priceHigh: submission.priceHigh,
    blockReason: submission.priceBlockReason,
    reviewUrl: reviewUrl(submission.reviewToken),
  })

  const result = await sendToContractor(id, body)
  log.info('contractor notified', { id, sent: result.sent })
  return result
}

export async function notifyContractorFailure(id: string): Promise<SmsResult> {
  const submission = await loadSubmission(id)
  if (!submission || submission.contractorNotifiedAt) return NOT_SENT

  const body = buildContractorFailureMessage({
    customerName: submission.customerName,
    customerPhone: submission.customerPhone,
    reviewUrl: reviewUrl(submission.reviewToken),
  })

  const result = await sendToContractor(id, body)
  log.info('contractor failure notified', { id, sent: result.sent })
  return result
}

export async function notifyCustomer(
  id: string,
  options?: { force?: boolean },
): Promise<SmsResult> {
  const submission = await loadSubmission(id)
  if (!submission) return NOT_SENT
  if (!options?.force && submission.customerNotifiedAt) return NOT_SENT

  const to = toE164(submission.customerPhone)
  if (!to) {
    log.error('customer phone invalid', { id })
    return NOT_SENT
  }

  const body = buildCustomerMessage({
    customerName: submission.customerName,
    priceLow: submission.contractorPriceLow,
    priceHigh: submission.contractorPriceHigh,
    resultUrl: resultUrl(submission.resultToken),
  })

  try {
    const result = await sendSms({ to, body })
    await getDb()
      .update(schema.submissions)
      .set({ customerNotifiedAt: new Date(), customerMessageSid: result.sid })
      .where(eq(schema.submissions.id, id))
    log.info('customer notified', { id, sent: result.sent })
    return result
  } catch (error) {
    log.error('customer notify failed', { id, error: errorMessage(error) })
    return NOT_SENT
  }
}
