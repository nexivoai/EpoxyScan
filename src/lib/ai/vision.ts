import 'server-only'
import { APIConnectionError, APIError } from 'openai'
import { AI_DEFAULTS, AI_RETRYABLE_STATUSES } from '@/constants/ai'
import { config } from '@/lib/config'
import { AiTransientError, AiValidationError } from '@/lib/errors'
import { getOpenAI } from './client'
import { buildSystemPrompt, USER_PROMPT } from './prompt'
import { analysisSchema, type AnalysisResult } from './schema'

function isTransientError(error: unknown): boolean {
  if (error instanceof APIConnectionError) return true
  if (error instanceof APIError) {
    return typeof error.status === 'number' && AI_RETRYABLE_STATUSES.includes(error.status)
  }
  return false
}

async function requestAnalysis(imageUrls: string[]) {
  const openai = getOpenAI()

  try {
    return await openai.chat.completions.create({
      model: config.openai.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        {
          role: 'user',
          content: [
            { type: 'text' as const, text: USER_PROMPT },
            ...imageUrls.map((url) => ({
              type: 'image_url' as const,
              image_url: { url, detail: AI_DEFAULTS.imageDetail },
            })),
          ],
        },
      ],
    })
  } catch (error) {
    if (isTransientError(error)) {
      throw new AiTransientError(error instanceof Error ? error.message : String(error))
    }
    throw error
  }
}

export async function analyzeSubmissionImages(imageUrls: string[]): Promise<AnalysisResult> {
  const completion = await requestAnalysis(imageUrls)

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new AiValidationError('Empty AI response')

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new AiValidationError('AI response was not valid JSON')
  }

  const parsed = analysisSchema.safeParse(json)
  if (!parsed.success) throw new AiValidationError('AI response did not match the schema')

  return parsed.data
}
