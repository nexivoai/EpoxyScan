import 'server-only'
import twilio, { type Twilio } from 'twilio'
import { config } from '@/lib/config'

let client: Twilio | null = null

export function getTwilio(): Twilio {
  if (!client) {
    const { accountSid, authToken } = config.twilio
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not configured')
    }
    client = twilio(accountSid, authToken)
  }
  return client
}
