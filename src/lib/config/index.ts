import 'server-only'
import { parseServerEnv, type ServerEnv } from './env'

let cachedEnv: ServerEnv | null = null

function env(): ServerEnv {
  if (!cachedEnv) cachedEnv = parseServerEnv(process.env)
  return cachedEnv
}

export const config = {
  get db() {
    return { url: env().DATABASE_URL }
  },
  get blob() {
    return { token: env().BLOB_READ_WRITE_TOKEN }
  },
  get openai() {
    const current = env()
    return { apiKey: current.OPENAI_API_KEY, model: current.OPENAI_MODEL }
  },
  get twilio() {
    const current = env()
    return {
      mode: current.SMS_MODE,
      accountSid: current.TWILIO_ACCOUNT_SID,
      authToken: current.TWILIO_AUTH_TOKEN,
      fromNumber: current.TWILIO_FROM_NUMBER,
    }
  },
  get app() {
    const current = env()
    return {
      baseUrl: current.APP_BASE_URL,
      contractorPhone: current.CONTRACTOR_PHONE,
      cronSecret: current.CRON_SECRET,
    }
  },
}
