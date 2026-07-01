import { z } from 'zod'
import { FINISH_SYSTEMS } from '@/types/domain'
import { SQFT_LIMITS } from './constants'

const countDigits = (value: string) => value.replace(/\D/g, '').length

const isBlankOrValidSqft = (value: string) => {
  if (value === '') return true
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= SQFT_LIMITS.min && parsed <= SQFT_LIMITS.max
}

export const customerNameSchema = z.string().trim().min(2, 'Please enter your full name')

export const customerPhoneSchema = z
  .string()
  .trim()
  .refine((value) => countDigits(value) >= 10, 'Please enter a valid phone number')

export const customerEmailSchema = z.string().trim().pipe(z.email('Please enter a valid email'))

export const intakeFormSchema = z.object({
  customerName: customerNameSchema,
  customerPhone: customerPhoneSchema,
  customerEmail: customerEmailSchema,
  customerSqft: z
    .string()
    .trim()
    .refine(isBlankOrValidSqft, `Enter a number between ${SQFT_LIMITS.min} and ${SQFT_LIMITS.max}`),
  requestedFinish: z.enum(FINISH_SYSTEMS),
  consent: z.boolean().refine((value) => value, 'Please accept to continue'),
})

export type IntakeFormValues = z.infer<typeof intakeFormSchema>
