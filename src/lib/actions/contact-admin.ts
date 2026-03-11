"use server"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { contactSubmissions } from "@/db/schema/app"
import { eq } from "drizzle-orm"

export async function markAsRead(id: string) {
  await db
    .update(contactSubmissions)
    .set({ status: "read", updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id))
  revalidatePath("/admin/inbox")
}

export async function archiveSubmission(id: string) {
  await db
    .update(contactSubmissions)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id))
  revalidatePath("/admin/inbox")
}

export async function deleteSubmission(id: string) {
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id))
  revalidatePath("/admin/inbox")
}
