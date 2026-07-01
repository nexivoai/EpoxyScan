import {
  CRACK_SEVERITY_LABELS,
  PRICE_BLOCK_REASON_LABELS,
  PROJECT_TYPE_LABELS,
} from '@/constants/labels'
import { LIABILITY_COPY } from '@/constants/liability'
import { RATE_CARD } from '@/constants/rate-card'
import { CONTRACTOR_SMS, CUSTOMER_SMS } from '@/constants/sms'
import { formatPriceRange } from '@/lib/format'
import type { CrackSeverity, FinishSystem, PriceBlockReason, ProjectType } from '@/types/domain'

interface ContractorMessageInput {
  customerName: string
  projectType: ProjectType | null
  sqftLow: number | null
  sqftHigh: number | null
  system: FinishSystem | null
  crackSeverity: CrackSeverity | null
  priceLow: number | null
  priceHigh: number | null
  blockReason: PriceBlockReason | null
  reviewUrl: string
}

export function buildContractorMessage(input: ContractorMessageInput): string {
  const lines = [CONTRACTOR_SMS.heading, input.customerName]

  const summary: string[] = []
  if (input.projectType) summary.push(PROJECT_TYPE_LABELS[input.projectType])
  if (input.sqftLow !== null && input.sqftHigh !== null) {
    summary.push(`${input.sqftLow}-${input.sqftHigh} ${CONTRACTOR_SMS.sqftSuffix}`)
  }
  if (input.system) summary.push(RATE_CARD.systems[input.system].label)
  if (input.crackSeverity)
    summary.push(`${CONTRACTOR_SMS.crackPrefix} ${CRACK_SEVERITY_LABELS[input.crackSeverity]}`)
  if (summary.length > 0) lines.push(summary.join(' | '))

  if (input.priceLow !== null && input.priceHigh !== null) {
    lines.push(`${CONTRACTOR_SMS.pricePrefix} ${formatPriceRange(input.priceLow, input.priceHigh)}`)
  } else if (input.blockReason) {
    lines.push(
      `${CONTRACTOR_SMS.needsReviewPrefix} ${PRICE_BLOCK_REASON_LABELS[input.blockReason]}`,
    )
  }

  lines.push(`${CONTRACTOR_SMS.reviewCta} ${input.reviewUrl}`)
  lines.push(LIABILITY_COPY)
  return lines.join('\n')
}

interface ContractorFailureMessageInput {
  customerName: string
  customerPhone: string
  reviewUrl: string
}

export function buildContractorFailureMessage(input: ContractorFailureMessageInput): string {
  return [
    CONTRACTOR_SMS.failureHeading,
    `${input.customerName} ${input.customerPhone}`,
    `${CONTRACTOR_SMS.reviewCta} ${input.reviewUrl}`,
  ].join('\n')
}

interface CustomerMessageInput {
  customerName: string
  priceLow: number | null
  priceHigh: number | null
  resultUrl: string
}

export function buildCustomerMessage(input: CustomerMessageInput): string {
  const lines = [`${CUSTOMER_SMS.headingPrefix} ${input.customerName}${CUSTOMER_SMS.headingSuffix}`]

  if (input.priceLow !== null && input.priceHigh !== null) {
    lines.push(
      `${CUSTOMER_SMS.estimatePrefix} ${formatPriceRange(input.priceLow, input.priceHigh)}`,
    )
  } else {
    lines.push(CUSTOMER_SMS.inspectionBody)
  }

  lines.push(`${CUSTOMER_SMS.resultCta} ${input.resultUrl}`)
  lines.push(LIABILITY_COPY)
  return lines.join('\n')
}
