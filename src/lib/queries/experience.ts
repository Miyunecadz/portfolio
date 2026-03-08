import { db } from "@/db"
import { experiences } from "@/db/schema/app"
import { eq, desc } from "drizzle-orm"

export type Experience = typeof experiences.$inferSelect

export async function getExperiences() {
  return db.select().from(experiences).orderBy(desc(experiences.startDate))
}

export async function getExperience(id: string) {
  const [exp] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1)
  return exp
}
