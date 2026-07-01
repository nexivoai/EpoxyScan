import 'server-only'
import { and, asc, eq, gt } from 'drizzle-orm'
import { getDb, schema } from '@/lib/db/client'
import type { Photo, Submission } from '@/types/db'

export interface ReviewData {
  submission: Submission
  photos: Photo[]
}

export async function getReviewSubmission(reviewToken: string): Promise<ReviewData | null> {
  const db = getDb()

  const [submission] = await db
    .select()
    .from(schema.submissions)
    .where(
      and(
        eq(schema.submissions.reviewToken, reviewToken),
        gt(schema.submissions.linksExpireAt, new Date()),
      ),
    )

  if (!submission) return null

  const photos = await db
    .select()
    .from(schema.photos)
    .where(eq(schema.photos.submissionId, submission.id))
    .orderBy(asc(schema.photos.sortOrder))

  return { submission, photos }
}
