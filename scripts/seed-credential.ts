#!/usr/bin/env npx tsx
/**
 * Seed script: creates the admin credential (email+password) account.
 * Run ONCE: npx tsx scripts/seed-credential.ts
 * Requires: ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL_DIRECT in .env.local
 */
import { config } from "dotenv"
config({ path: ".env.local" })

import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import * as authSchema from "../src/db/schema/auth"
import * as appSchema from "../src/db/schema/app"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.split(",")[0].trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local")
  process.exit(1)
}

if (!process.env.DATABASE_URL_DIRECT) {
  console.error("Error: DATABASE_URL_DIRECT must be set in .env.local")
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL_DIRECT)
const db = drizzle(sql, { schema: { ...authSchema, ...appSchema } })

const seedAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: { ...authSchema, ...appSchema },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false, // allow sign-up for seeding only; production auth.ts uses disableSignUp: true
    minPasswordLength: 8,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedEmails = process.env.ADMIN_EMAIL
            ?.split(",")
            .map((e) => e.trim())
            .filter(Boolean) ?? []
          if (allowedEmails.length > 0 && !allowedEmails.includes(user.email)) {
            throw new Error("Unauthorized: not an authorized admin email")
          }
        },
      },
    },
  },
})

async function main() {
  // Idempotency: check if credential account already exists
  const existing = await db
    .select()
    .from(authSchema.users)
    .where(eq(authSchema.users.email, ADMIN_EMAIL!))

  if (existing.length > 0) {
    console.log("Credential account already exists — skipping.")
    await sql.end()
    process.exit(0)
  }

  console.log(`Creating credential account for ${ADMIN_EMAIL}…`)

  const result = await seedAuth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
      name: "Admin",
    },
  })

  if (!result || !result.user) {
    console.error("Failed to create credential account.")
    await sql.end()
    process.exit(1)
  }

  console.log(`Credential account created successfully for ${ADMIN_EMAIL}`)
  await sql.end()
  process.exit(0)
}

main().catch(async (err) => {
  console.error("Error:", err)
  await sql.end()
  process.exit(1)
})
