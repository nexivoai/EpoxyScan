export const FINISH_SYSTEMS = ['flake', 'metallic', 'polyaspartic'] as const
export const PROJECT_TYPES = ['garage', 'basement', 'commercial', 'other'] as const
export const PREP_COMPLEXITIES = ['standard', 'moderate', 'heavy'] as const
export const CRACK_SEVERITIES = ['none', 'minor', 'moderate', 'major'] as const
export const IMAGE_QUALITIES = ['good', 'fair', 'poor'] as const
export const SUBMISSION_STATUSES = [
  'pending_ai',
  'processing',
  'ai_complete',
  'ai_failed',
  'inspection_required',
  'approved',
] as const
export const PRICE_BLOCK_REASONS = [
  'commercial',
  'polyaspartic',
  'major_crack',
  'insufficient_data',
] as const
export const SQFT_SOURCES = ['customer', 'ai_midpoint'] as const
export const VERIFICATION_REASONS = ['low_confidence', 'poor_image_quality'] as const

export type FinishSystem = (typeof FINISH_SYSTEMS)[number]
export type ProjectType = (typeof PROJECT_TYPES)[number]
export type PrepComplexity = (typeof PREP_COMPLEXITIES)[number]
export type CrackSeverity = (typeof CRACK_SEVERITIES)[number]
export type ImageQuality = (typeof IMAGE_QUALITIES)[number]
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]
export type PriceBlockReason = (typeof PRICE_BLOCK_REASONS)[number]
export type SqftSource = (typeof SQFT_SOURCES)[number]
export type VerificationReason = (typeof VERIFICATION_REASONS)[number]
