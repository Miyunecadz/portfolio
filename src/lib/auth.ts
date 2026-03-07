import "server-only"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import * as authSchema from "@/db/schema/auth"
import * as appSchema from "@/db/schema/app"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      ...authSchema,
      ...appSchema,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    },
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
