import { db } from "@/db"
import { siteSettings } from "@/db/schema/app"

export async function getSiteSettingsAdmin() {
  const row = await db.select().from(siteSettings).limit(1)
  return row[0] ?? null
}
