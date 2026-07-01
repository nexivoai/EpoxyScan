import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { del, put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { LINK_TTL_DAYS } from '../src/constants/app-defaults'
import { parseServerEnv } from '../src/lib/config/env'
import * as schema from '../src/lib/db/schema'
import { newResultToken, newReviewToken } from '../src/lib/tokens'

config({ path: ['.env.local', '.env'] })

async function main() {
  const env = parseServerEnv(process.env)
  const db = drizzle(neon(env.DATABASE_URL), { schema })

  const [submission] = await db
    .insert(schema.submissions)
    .values({
      customerName: 'Smoke Test',
      customerPhone: '+15555550100',
      customerEmail: 'smoke@example.com',
      consentAt: new Date(),
      requestedFinish: 'flake',
      reviewToken: newReviewToken(),
      resultToken: newResultToken(),
      linksExpireAt: new Date(Date.now() + LINK_TTL_DAYS * 24 * 60 * 60 * 1000),
    })
    .returning()

  await db.insert(schema.photos).values([
    {
      submissionId: submission.id,
      url: 'https://example.com/a.jpg',
      pathname: 'a.jpg',
      contentType: 'image/jpeg',
      bytes: 1234,
      sortOrder: 0,
    },
    {
      submissionId: submission.id,
      url: 'https://example.com/b.jpg',
      pathname: 'b.jpg',
      contentType: 'image/jpeg',
      bytes: 5678,
      sortOrder: 1,
    },
  ])

  const photos = await db
    .select()
    .from(schema.photos)
    .where(eq(schema.photos.submissionId, submission.id))
  await db.delete(schema.submissions).where(eq(schema.submissions.id, submission.id))

  const blob = await put('smoke-test/hello.txt', 'epoxy-scan smoke test', {
    access: 'public',
    token: env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: true,
  })
  await del(blob.url, { token: env.BLOB_READ_WRITE_TOKEN })

  console.log(
    `config ok | submission inserted/selected | photos=${photos.length} | blob=${blob.url}`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
