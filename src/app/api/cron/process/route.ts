import { NextResponse } from 'next/server'
import { sweepPendingSubmissions } from '@/features/estimate/server/process-submission'
import { config } from '@/lib/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<NextResponse> {
  const expected = config.app.cronSecret
  const authorized = expected && request.headers.get('authorization') === `Bearer ${expected}`
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const processed = await sweepPendingSubmissions()
  return NextResponse.json({ processed })
}
