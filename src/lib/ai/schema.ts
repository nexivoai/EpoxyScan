import { z } from 'zod'
import { SURFACE_FLAGS } from '@/constants/ai'
import {
  CRACK_SEVERITIES,
  FINISH_SYSTEMS,
  IMAGE_QUALITIES,
  PREP_COMPLEXITIES,
  PROJECT_TYPES,
} from '@/types/domain'

export const analysisSchema = z.object({
  isFloor: z.boolean(),
  projectType: z.enum(PROJECT_TYPES),
  sqftLow: z.number().int().nonnegative(),
  sqftHigh: z.number().int().nonnegative(),
  crackSeverity: z.enum(CRACK_SEVERITIES),
  surfaceFlags: z.array(z.enum(SURFACE_FLAGS)),
  recommendedSystem: z.enum(FINISH_SYSTEMS),
  complexity: z.enum(PREP_COMPLEXITIES),
  imageQuality: z.enum(IMAGE_QUALITIES),
  confidence: z.number().min(0).max(1),
})

export type AnalysisResult = z.infer<typeof analysisSchema>
