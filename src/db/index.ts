import "server-only"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// prepare: false is REQUIRED for Supabase transaction pooler (pgBouncer)
const client = postgres(process.env.DATABASE_URL!, { prepare: false })
export const db = drizzle(client)
