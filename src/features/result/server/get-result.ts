import 'server-only'
import { and, eq, gt } from 'drizzle-orm'
import { getDb, schema } from '@/lib/db/client'
import type { Submission } from '@/types/db'

export async function getResultSubmission(resultToken: string): Promise<Submission | null> {
  const db = getDb()

  const [submission] = await db
    .select()
    .from(schema.submissions)
    .where(
      and(
        eq(schema.submissions.resultToken, resultToken),
        gt(schema.submissions.linksExpireAt, new Date()),
      ),
    )

  return submission ?? null
}
