export const SURFACE_FLAGS = [
  'oil_stains',
  'cracking',
  'spalling',
  'pitting',
  'existing_coating',
  'uneven_surface',
  'debris',
] as const

export const AI_DEFAULTS = {
  confidenceThreshold: 0.6,
  maxRetries: 1,
  retryBackoffMs: 1000,
  imageDetail: 'low' as const,
}

export const AI_RETRYABLE_STATUSES = [408, 409, 429, 500, 502, 503, 504]

export const PROCESSING_STALE_MS = 10 * 60 * 1000

export const MAX_PROCESSING_ATTEMPTS = 3
