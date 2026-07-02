'use server'

import { randomUUID } from 'node:crypto'
import { after } from 'next/server'
import { z } from 'zod'
import { LINK_TTL_DAYS } from '@/constants/app-defaults'
import { getDb, schema } from '@/lib/db/client'
import { newResultToken, newReviewToken } from '@/lib/tokens'
import type { ActionResult } from '@/types/action'
import { FINISH_SYSTEMS } from '@/types/domain'
import { PHOTO_LIMITS, SQFT_LIMITS } from '../constants'
import { customerEmailSchema, customerNameSchema, customerPhoneSchema } from '../schema'
import { processSubmission } from './process-submission'

const photoSchema = z.object({
  url: z.string().min(1),
  pathname: z.string().min(1),
  contentType: z.string().min(1),
  bytes: z.number().int().positive(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
})

const createSubmissionSchema = z.object({
  customerName: customerNameSchema,
  customerPhone: customerPhoneSchema,
  customerEmail: customerEmailSchema,
  customerSqft: z.number().int().min(SQFT_LIMITS.min).max(SQFT_LIMITS.max).nullable(),
  requestedFinish: z.enum(FINISH_SYSTEMS),
  consent: z.boolean().refine((value) => value),
  photos: z.array(photoSchema).min(PHOTO_LIMITS.minCount).max(PHOTO_LIMITS.maxCount),
})

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createSubmissionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid submission' }
  }

  const { photos, ...customer } = parsed.data
  const submissionId = randomUUID()
  const reviewToken = newReviewToken()
  const resultToken = newResultToken()
  const linksExpireAt = new Date(Date.now() + LINK_TTL_DAYS * 24 * 60 * 60 * 1000)
  const db = getDb()

  try {
    await db.batch([
      db.insert(schema.submissions).values({
        id: submissionId,
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail,
        customerSqft: customer.customerSqft,
        requestedFinish: customer.requestedFinish,
        consentAt: new Date(),
        status: 'pending_ai',
        reviewToken,
        resultToken,
        linksExpireAt,
      }),
      db.insert(schema.photos).values(
        photos.map((photo, index) => ({
          submissionId,
          url: photo.url,
          pathname: photo.pathname,
          contentType: photo.contentType,
          bytes: photo.bytes,
          width: photo.width,
          height: photo.height,
          sortOrder: index,
        })),
      ),
    ])
  } catch {
    return { ok: false, error: 'Could not save your submission' }
  }

  after(() => processSubmission(submissionId))

  return { ok: true, data: { id: submissionId } }
}
