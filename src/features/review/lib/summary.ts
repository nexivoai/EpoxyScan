import {
  CRACK_SEVERITY_LABELS,
  IMAGE_QUALITY_LABELS,
  PREP_COMPLEXITY_LABELS,
  PRICE_BLOCK_REASON_LABELS,
  PROJECT_TYPE_LABELS,
  SURFACE_FLAG_LABELS,
  VERIFICATION_REASON_LABELS,
} from '@/constants/labels'
import { RATE_CARD } from '@/constants/rate-card'
import { formatPriceRange } from '@/lib/format'
import type { Submission } from '@/types/db'
import { isIrrelevantSubject } from '@/types/domain'
import { REVIEW_CONTENT } from '../constants'

export interface ReviewSummaryView {
  requestedFinish: string
  providedSqft: string
  projectType: string
  sqftRange: string
  recommendedSystem: string
  crackSeverity: string
  complexity: string
  imageQuality: string
  confidence: string
  surfaceFlags: string
  priceText: string
  needsVerification: boolean
  verificationReasonLabel: string | null
  isNotFloor: boolean
}

export function toReviewSummaryView(submission: Submission): ReviewSummaryView {
  const { assessment, customer, estimate } = REVIEW_CONTENT

  return {
    requestedFinish: submission.requestedFinish
      ? RATE_CARD.systems[submission.requestedFinish].label
      : customer.notProvided,
    providedSqft:
      submission.customerSqft !== null ? String(submission.customerSqft) : customer.notProvided,
    projectType: submission.aiProjectType
      ? PROJECT_TYPE_LABELS[submission.aiProjectType]
      : assessment.unavailable,
    sqftRange:
      submission.aiSqftLow !== null && submission.aiSqftHigh !== null
        ? `${submission.aiSqftLow} - ${submission.aiSqftHigh}`
        : assessment.unavailable,
    recommendedSystem: submission.aiRecommendedSystem
      ? RATE_CARD.systems[submission.aiRecommendedSystem].label
      : assessment.unavailable,
    crackSeverity: submission.aiCrackSeverity
      ? CRACK_SEVERITY_LABELS[submission.aiCrackSeverity]
      : assessment.unavailable,
    complexity: submission.aiComplexity
      ? PREP_COMPLEXITY_LABELS[submission.aiComplexity]
      : assessment.unavailable,
    imageQuality: submission.aiImageQuality
      ? IMAGE_QUALITY_LABELS[submission.aiImageQuality]
      : assessment.unavailable,
    confidence:
      submission.aiConfidence !== null
        ? `${Math.round(submission.aiConfidence * 100)}%`
        : assessment.unavailable,
    surfaceFlags:
      submission.aiSurfaceFlags && submission.aiSurfaceFlags.length > 0
        ? submission.aiSurfaceFlags
            .map((flag) => SURFACE_FLAG_LABELS[flag as keyof typeof SURFACE_FLAG_LABELS] ?? flag)
            .join(', ')
        : assessment.none,
    priceText:
      submission.priceLow !== null && submission.priceHigh !== null
        ? formatPriceRange(submission.priceLow, submission.priceHigh)
        : submission.priceBlockReason
          ? PRICE_BLOCK_REASON_LABELS[submission.priceBlockReason]
          : estimate.blockedLabel,
    needsVerification: submission.needsVerification,
    verificationReasonLabel: submission.verificationReason
      ? VERIFICATION_REASON_LABELS[submission.verificationReason]
      : null,
    isNotFloor: isIrrelevantSubject(submission.verificationReason),
  }
}
