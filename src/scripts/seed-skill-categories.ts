// Standalone seed script — does NOT import @/db to avoid server-only restriction.
// Uses dotenv + postgres directly with DATABASE_URL from .env.local
import { config } from "dotenv"
import { resolve } from "path"

config({ path: resolve(process.cwd(), ".env.local") })

import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core"

// Inline table definition to avoid importing from schema (which pulls in server-only)
const skillCategories = pgTable("skill_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

const defaults = ["Frontend", "Backend", "DevOps", "Database", "Tools", "Other"]

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false })
  const db = drizzle(client)

  for (const name of defaults) {
    await db.insert(skillCategories).values({ name, isDefault: true }).onConflictDoNothing()
  }

  console.log("Skill categories seeded:", defaults.join(", "))
  await client.end()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
