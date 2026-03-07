import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema/auth.ts", "./src/db/schema/app.ts"],
  dialect: "postgresql",
  dbCredentials: {
    // CRITICAL: DATABASE_URL_DIRECT (port 5432), never the pooler for migrations
    url: process.env.DATABASE_URL_DIRECT!,
  },
})
