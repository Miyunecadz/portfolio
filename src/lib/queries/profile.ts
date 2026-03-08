import { db } from "@/db"
import { profile } from "@/db/schema/app"

export type Profile = typeof profile.$inferSelect

export async function getProfile(): Promise<Profile | undefined> {
  const [row] = await db.select().from(profile).limit(1)
  return row
}
