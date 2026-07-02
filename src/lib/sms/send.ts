import 'server-only'
import { config } from '@/lib/config'
import { createLogger } from '@/lib/logger'
import { getTwilio } from './client'

const log = createLogger('sms')

export interface SmsInput {
  to: string
  body: string
}

export interface SmsResult {
  sent: boolean
  sid: string | null
}

export async function sendSms({ to, body }: SmsInput): Promise<SmsResult> {
  if (config.twilio.mode !== 'live') {
    log.info('sandbox', { to, body })
    return { sent: false, sid: null }
  }

  const message = await getTwilio().messages.create({ to, from: config.twilio.fromNumber, body })
  return { sent: true, sid: message.sid }
}
