import { SURFACE_FLAGS } from '@/constants/ai'
import type {
  CrackSeverity,
  ImageQuality,
  PrepComplexity,
  PriceBlockReason,
  ProjectType,
  VerificationReason,
} from '@/types/domain'

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  garage: 'Garage',
  basement: 'Basement',
  commercial: 'Commercial',
  other: 'Other',
}

export const CRACK_SEVERITY_LABELS: Record<CrackSeverity, string> = {
  none: 'None',
  minor: 'Minor',
  moderate: 'Moderate',
  major: 'Major',
}

export const PREP_COMPLEXITY_LABELS: Record<PrepComplexity, string> = {
  standard: 'Standard',
  moderate: 'Moderate',
  heavy: 'Heavy',
}

export const IMAGE_QUALITY_LABELS: Record<ImageQuality, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export const PRICE_BLOCK_REASON_LABELS: Record<PriceBlockReason, string> = {
  commercial: 'Commercial project - manual quote required',
  polyaspartic: 'Polyaspartic system - manual quote required',
  major_crack: 'Major cracking - on-site inspection required',
  insufficient_data: 'Not enough information to auto-price',
}

export const VERIFICATION_REASON_LABELS: Record<VerificationReason, string> = {
  low_confidence: 'Low AI confidence',
  poor_image_quality: 'Poor image quality',
  irrelevant_subject: 'Photos are not of a floor',
}

export const SURFACE_FLAG_LABELS: Record<(typeof SURFACE_FLAGS)[number], string> = {
  oil_stains: 'Oil stains',
  cracking: 'Cracking',
  spalling: 'Spalling',
  pitting: 'Pitting',
  existing_coating: 'Existing coating',
  uneven_surface: 'Uneven surface',
  debris: 'Debris',
}
