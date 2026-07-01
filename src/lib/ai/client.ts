import 'server-only'
import OpenAI from 'openai'
import { config } from '@/lib/config'

let client: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: config.openai.apiKey })
  }
  return client
}
