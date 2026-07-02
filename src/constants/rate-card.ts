import type { FinishSystem, PrepComplexity, ProjectType } from '@/types/domain'

interface SystemRate {
  label: string
  ratePerSqftLow: number | null
  ratePerSqftHigh: number | null
}

interface RateCard {
  systems: Record<FinishSystem, SystemRate>
  projectMinimums: Record<ProjectType, number | null>
  prepMultipliers: Record<PrepComplexity, number>
}

export const RATE_CARD: RateCard = {
  systems: {
    flake: { label: 'Flake', ratePerSqftLow: 6, ratePerSqftHigh: 8 },
    metallic: { label: 'Metallic', ratePerSqftLow: 10, ratePerSqftHigh: 14 },
    polyaspartic: { label: 'Polyaspartic', ratePerSqftLow: null, ratePerSqftHigh: null },
  },
  projectMinimums: {
    garage: 2400,
    basement: 6000,
    other: 2400,
    commercial: null,
  },
  prepMultipliers: {
    standard: 1.0,
    moderate: 1.15,
    heavy: 1.3,
  },
}
