import type { photos, submissions } from '@/lib/db/schema'

export type Submission = typeof submissions.$inferSelect
export type Photo = typeof photos.$inferSelect
