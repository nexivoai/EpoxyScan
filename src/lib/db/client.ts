import 'server-only'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { config } from '@/lib/config'
import * as schema from './schema'

type Database = ReturnType<typeof drizzle<typeof schema>>

let database: Database | null = null

export function getDb(): Database {
  if (!database) {
    database = drizzle(neon(config.db.url), { schema })
  }
  return database
}

export { schema }
