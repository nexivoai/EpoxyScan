'use server'

import { and, eq, gt, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { getDb, schema } from '@/lib/db/client'
import { notifyCustomer } from '@/lib/notifications/submission'
import type { ActionResult } from '@/types/action'
import { FINISH_SYSTEMS } from '@/types/domain'
import { APPROVAL_LIMITS, REVIEW_CONTENT } from '../constants'

const APPROVABLE_STATUSES = ['ai_complete', 'inspection_required', 'ai_failed'] as const

const approveInputSchema = z
  .object({
    reviewToken: z.string().min(1),
    priceLow: z.number().int().min(0).max(APPROVAL_LIMITS.priceMax).nullable(),
    priceHigh: z.number().int().min(0).max(APPROVAL_LIMITS.priceMax).nullable(),
    system: z.enum(FINISH_SYSTEMS),
    notes: z.string().trim().max(APPROVAL_LIMITS.notesMax),
  })
  .refine((value) => (value.priceLow === null) === (value.priceHigh === null))
  .refine(
    (value) =>
      value.priceLow === null || value.priceHigh === null || value.priceLow <= value.priceHigh,
  )

export type ApproveSubmissionInput = z.infer<typeof approveInputSchema>

export async function approveSubmission(
  input: ApproveSubmissionInput,
): Promise<ActionResult<{ smsSent: boolean }>> {
  const parsed = approveInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: REVIEW_CONTENT.errors.approve }

  const { reviewToken, priceLow, priceHigh, system, notes } = parsed.data
  const db = getDb()

  const [claimed] = await db
    .update(schema.submissions)
    .set({
      status: 'approved',
      approvedAt: new Date(),
      contractorPriceLow: priceLow,
      contractorPriceHigh: priceHigh,
      contractorSystem: system,
      contractorNotes: notes === '' ? null : notes,
    })
    .where(
      and(
        eq(schema.submissions.reviewToken, reviewToken),
        gt(schema.submissions.linksExpireAt, new Date()),
        inArray(schema.submissions.status, [...APPROVABLE_STATUSES]),
      ),
    )
    .returning({ id: schema.submissions.id })

  if (!claimed) {
    const [existing] = await db
      .select({ status: schema.submissions.status })
      .from(schema.submissions)
      .where(eq(schema.submissions.reviewToken, reviewToken))

    if (existing?.status === 'approved') return { ok: true, data: { smsSent: false } }
    return { ok: false, error: REVIEW_CONTENT.errors.approve }
  }

  const sms = await notifyCustomer(claimed.id)
  return { ok: true, data: { smsSent: sms.sent } }
}

export async function resendCustomerSms(
  reviewToken: string,
): Promise<ActionResult<{ smsSent: boolean }>> {
  const db = getDb()

  const [submission] = await db
    .select({
      id: schema.submissions.id,
      status: schema.submissions.status,
      linksExpireAt: schema.submissions.linksExpireAt,
    })
    .from(schema.submissions)
    .where(eq(schema.submissions.reviewToken, reviewToken))

  if (!submission || submission.linksExpireAt <= new Date() || submission.status !== 'approved') {
    return { ok: false, error: REVIEW_CONTENT.errors.resend }
  }

  const sms = await notifyCustomer(submission.id, { force: true })
  return { ok: true, data: { smsSent: sms.sent } }
}
