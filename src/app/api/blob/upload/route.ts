import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/constants/upload'
import { config } from '@/lib/config'
import { createLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const log = createLogger('blob-upload')

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      token: config.blob.token,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_IMAGE_TYPES,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(result)
  } catch (error) {
    log.error('failed', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 })
  }
}
