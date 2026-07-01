import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import {
  CRACK_SEVERITIES,
  FINISH_SYSTEMS,
  IMAGE_QUALITIES,
  PREP_COMPLEXITIES,
  PRICE_BLOCK_REASONS,
  PROJECT_TYPES,
  SQFT_SOURCES,
  SUBMISSION_STATUSES,
  VERIFICATION_REASONS,
} from '@/types/domain'

export const submissionStatus = pgEnum('submission_status', SUBMISSION_STATUSES)
export const finishSystem = pgEnum('finish_system', FINISH_SYSTEMS)
export const projectType = pgEnum('project_type', PROJECT_TYPES)
export const crackSeverity = pgEnum('crack_severity', CRACK_SEVERITIES)
export const prepComplexity = pgEnum('prep_complexity', PREP_COMPLEXITIES)
export const imageQuality = pgEnum('image_quality', IMAGE_QUALITIES)
export const priceBlockReason = pgEnum('price_block_reason', PRICE_BLOCK_REASONS)
export const sqftSource = pgEnum('sqft_source', SQFT_SOURCES)
export const verificationReason = pgEnum('verification_reason', VERIFICATION_REASONS)

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email').notNull(),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),

  customerSqft: integer('customer_sqft'),
  requestedFinish: finishSystem('requested_finish'),

  status: submissionStatus('status').notNull().default('pending_ai'),
  attemptCount: integer('attempt_count').notNull().default(0),
  processingStartedAt: timestamp('processing_started_at', { withTimezone: true }),

  aiProjectType: projectType('ai_project_type'),
  aiSqftLow: integer('ai_sqft_low'),
  aiSqftHigh: integer('ai_sqft_high'),
  aiCrackSeverity: crackSeverity('ai_crack_severity'),
  aiRecommendedSystem: finishSystem('ai_recommended_system'),
  aiComplexity: prepComplexity('ai_complexity'),
  aiImageQuality: imageQuality('ai_image_quality'),
  aiConfidence: numeric('ai_confidence', { precision: 4, scale: 3, mode: 'number' }),
  aiSurfaceFlags: jsonb('ai_surface_flags').$type<string[]>(),
  aiRaw: jsonb('ai_raw'),
  aiError: text('ai_error'),

  priceLow: integer('price_low'),
  priceHigh: integer('price_high'),
  sqftUsed: integer('sqft_used'),
  sqftSource: sqftSource('sqft_source'),
  prepMultiplier: numeric('prep_multiplier', { precision: 4, scale: 2, mode: 'number' }),
  priceBlockReason: priceBlockReason('price_block_reason'),

  needsVerification: boolean('needs_verification').notNull().default(false),
  verificationReason: verificationReason('verification_reason'),

  reviewToken: text('review_token').notNull().unique(),
  resultToken: text('result_token').notNull().unique(),
  linksExpireAt: timestamp('links_expire_at', { withTimezone: true }).notNull(),

  contractorPriceLow: integer('contractor_price_low'),
  contractorPriceHigh: integer('contractor_price_high'),
  contractorSystem: finishSystem('contractor_system'),
  contractorNotes: text('contractor_notes'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),

  contractorNotifiedAt: timestamp('contractor_notified_at', { withTimezone: true }),
  customerNotifiedAt: timestamp('customer_notified_at', { withTimezone: true }),
  contractorMessageSid: text('contractor_message_sid'),
  customerMessageSid: text('customer_message_sid'),
})

export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  pathname: text('pathname').notNull(),
  contentType: text('content_type').notNull(),
  bytes: integer('bytes').notNull(),
  width: integer('width'),
  height: integer('height'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
