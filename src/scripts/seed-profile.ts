// Standalone seed script — does NOT import @/db to avoid server-only restriction.
// Uses dotenv + postgres directly with DATABASE_URL from .env.local
import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core"

// Inline table definition to avoid importing from schema (which pulls in server-only)
const profile = pgTable("profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 100 }),
  tagline: varchar("tagline", { length: 160 }),
  bio: text("bio"),
  availabilityStatus: varchar("availability_status", { length: 30 }).default("not_available"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false })
  const db = drizzle(client)

  const existing = await db.select({ id: profile.id }).from(profile).limit(1)
  if (existing.length > 0) {
    console.log("Profile row already exists — skipping seed")
    await client.end()
    process.exit(0)
  }

  await db.insert(profile).values({
    fullName: "",
    tagline: "",
    bio: "",
    availabilityStatus: "not_available",
  })

  console.log("Profile row seeded")
  await client.end()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
