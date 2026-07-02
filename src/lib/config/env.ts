import { z } from 'zod'
import { DEFAULT_OPENAI_MODEL, SMS_MODES } from '@/constants/app-defaults'

const TWILIO_LIVE_KEYS = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'] as const

export const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'is required (Neon Postgres connection string)'),
    BLOB_READ_WRITE_TOKEN: z.string().min(1, 'is required (Vercel Blob read/write token)'),
    OPENAI_API_KEY: z.string().min(1, 'is required'),
    OPENAI_MODEL: z.string().min(1).default(DEFAULT_OPENAI_MODEL),
    CONTRACTOR_PHONE: z.string().min(1, 'is required (E.164, e.g. +15551234567)'),
    APP_BASE_URL: z.string().min(1, 'is required (e.g. https://your-app.vercel.app)'),
    SMS_MODE: z.enum(SMS_MODES).default('sandbox'),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_FROM_NUMBER: z.string().optional(),
    CRON_SECRET: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.SMS_MODE !== 'live') return
    for (const key of TWILIO_LIVE_KEYS) {
      if (!env[key]) {
        ctx.addIssue({ code: 'custom', path: [key], message: 'is required when SMS_MODE=live' })
      }
    }
  })

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function parseServerEnv(raw: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(raw)
  if (result.success) return result.data

  const issues = result.error.issues
    .map((issue) => `  • ${String(issue.path[0] ?? '(root)')} — ${issue.message}`)
    .join('\n')

  throw new Error(
    `\nInvalid environment configuration:\n${issues}\n\n` +
      `Fix your local .env file, or Vercel → Project → Settings → Environment Variables.\n` +
      `See .env.example for the full list of required variables.\n`,
  )
}
