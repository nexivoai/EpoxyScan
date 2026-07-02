import type {
  CrackSeverity,
  FinishSystem,
  PrepComplexity,
  PriceBlockReason,
  ProjectType,
  SqftSource,
} from './domain'

export interface EstimateInput {
  system: FinishSystem
  projectType: ProjectType
  prepComplexity: PrepComplexity
  crackSeverity: CrackSeverity
  isFloor: boolean
  customerSqft?: number | null
  aiSqftLow?: number | null
  aiSqftHigh?: number | null
}

export interface EstimateResult {
  priced: boolean
  priceLow: number | null
  priceHigh: number | null
  blockReason: PriceBlockReason | null
  requiresInspection: boolean
  sqftUsed: number | null
  sqftSource: SqftSource | null
  prepMultiplier: number
}
