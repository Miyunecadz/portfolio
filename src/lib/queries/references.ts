import { db } from "@/db"
import { referencesTable } from "@/db/schema/app"
import { eq, desc } from "drizzle-orm"

export type Reference = typeof referencesTable.$inferSelect

export async function getReferences() {
  return db.select().from(referencesTable).orderBy(desc(referencesTable.createdAt))
}

export async function getReference(id: string) {
  const [ref] = await db.select().from(referencesTable).where(eq(referencesTable.id, id)).limit(1)
  return ref
}
