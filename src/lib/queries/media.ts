import { db } from "@/db"
import { mediaAssets } from "@/db/schema/app"
import { eq, desc } from "drizzle-orm"

export type MediaAsset = typeof mediaAssets.$inferSelect

export async function getMediaAssets(section?: string) {
  const query = db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
  if (section) {
    return query.where(eq(mediaAssets.usedIn, section))
  }
  return query
}
