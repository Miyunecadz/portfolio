import { db } from "@/db"
import { education } from "@/db/schema/app"
import { eq, desc } from "drizzle-orm"

export type Education = typeof education.$inferSelect

export async function getEducationEntries() {
  return db.select().from(education).orderBy(desc(education.startYear))
}

export async function getEducationEntry(id: string) {
  const [entry] = await db.select().from(education).where(eq(education.id, id)).limit(1)
  return entry
}
