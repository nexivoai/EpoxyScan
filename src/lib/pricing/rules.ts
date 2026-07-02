import { RATE_CARD } from '@/constants/rate-card'
import type { CrackSeverity, FinishSystem, PriceBlockReason, ProjectType } from '@/types/domain'

export function requiresInspection(crackSeverity: CrackSeverity): boolean {
  return crackSeverity === 'major'
}

export function resolveBlockReason(input: {
  projectType: ProjectType
  system: FinishSystem
  crackSeverity: CrackSeverity
}): PriceBlockReason | null {
  if (input.crackSeverity === 'major') return 'major_crack'
  if (input.projectType === 'commercial') return 'commercial'
  if (RATE_CARD.systems[input.system].ratePerSqftLow === null) return 'polyaspartic'
  return null
}
