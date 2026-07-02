import { z } from 'zod'
import { FINISH_SYSTEMS } from '@/types/domain'
import { APPROVAL_LIMITS } from './constants'

const isBlankOrValidPrice = (value: string) => {
  if (value === '') return true
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= APPROVAL_LIMITS.priceMax
}

const priceField = z.string().trim().refine(isBlankOrValidPrice, 'Enter a valid amount')

export const approvalFormSchema = z
  .object({
    priceLow: priceField,
    priceHigh: priceField,
    system: z.enum(FINISH_SYSTEMS),
    notes: z.string().trim().max(APPROVAL_LIMITS.notesMax),
  })
  .refine((value) => (value.priceLow === '') === (value.priceHigh === ''), {
    message: 'Enter both prices or leave both blank',
    path: ['priceHigh'],
  })
  .refine((value) => value.priceLow === '' || Number(value.priceLow) <= Number(value.priceHigh), {
    message: 'Low must be less than or equal to high',
    path: ['priceHigh'],
  })

export type ApprovalFormValues = z.infer<typeof approvalFormSchema>
