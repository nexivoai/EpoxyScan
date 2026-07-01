import { PRICE_ROUND_TO } from '@/constants/pricing'
import { RATE_CARD } from '@/constants/rate-card'
import type { SqftSource } from '@/types/domain'
import type { EstimateInput, EstimateResult } from '@/types/estimate'
import { requiresInspection, resolveBlockReason } from './rules'

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step
}

function resolveSqft(input: EstimateInput): { sqft: number | null; source: SqftSource | null } {
  if (typeof input.customerSqft === 'number' && input.customerSqft > 0) {
    return { sqft: input.customerSqft, source: 'customer' }
  }

  const { aiSqftLow, aiSqftHigh } = input
  if (
    typeof aiSqftLow === 'number' &&
    typeof aiSqftHigh === 'number' &&
    aiSqftLow > 0 &&
    aiSqftHigh > 0
  ) {
    return { sqft: Math.round((aiSqftLow + aiSqftHigh) / 2), source: 'ai_midpoint' }
  }

  return { sqft: null, source: null }
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const system = RATE_CARD.systems[input.system]
  const typeMinimum = RATE_CARD.projectMinimums[input.projectType]
  const prepMultiplier = RATE_CARD.prepMultipliers[input.prepComplexity]
  const { sqft, source } = resolveSqft(input)

  const result: EstimateResult = {
    priced: false,
    priceLow: null,
    priceHigh: null,
    blockReason: resolveBlockReason({
      projectType: input.projectType,
      system: input.system,
      crackSeverity: input.crackSeverity,
    }),
    requiresInspection: requiresInspection(input.crackSeverity),
    sqftUsed: sqft,
    sqftSource: source,
    prepMultiplier,
  }

  if (result.blockReason) return result

  if (
    sqft === null ||
    system.ratePerSqftLow === null ||
    system.ratePerSqftHigh === null ||
    typeMinimum === null
  ) {
    return { ...result, blockReason: 'insufficient_data' }
  }

  return {
    ...result,
    priced: true,
    priceLow: roundToStep(
      Math.max(sqft * system.ratePerSqftLow, typeMinimum) * prepMultiplier,
      PRICE_ROUND_TO,
    ),
    priceHigh: roundToStep(
      Math.max(sqft * system.ratePerSqftHigh, typeMinimum) * prepMultiplier,
      PRICE_ROUND_TO,
    ),
  }
}
