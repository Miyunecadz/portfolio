"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { education } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { createEducationSchema, updateEducationSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

export async function createEducation(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createEducationSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  try {
    const [entry] = await db.insert(education).values(parsed.data).returning({ id: education.id })
    await logActivity("created", "education", entry.id, `Created education "${parsed.data.schoolName}"`)
    revalidatePath("/admin/education")
    return { success: true, data: { id: entry.id } }
  } catch (e) {
    console.error("createEducation error:", e)
    return { success: false, error: "Failed to save education entry." }
  }
}

export async function updateEducation(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateEducationSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  const { id, ...data } = parsed.data
  try {
    await db.update(education).set({ ...data, updatedAt: new Date() }).where(eq(education.id, id))
    await logActivity("updated", "education", id, `Updated education "${data.schoolName}"`)
    revalidatePath("/admin/education")
    return { success: true, data: { id } }
  } catch (e) {
    console.error("updateEducation error:", e)
    return { success: false, error: "Failed to update education entry." }
  }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    const [entry] = await db.select({ schoolName: education.schoolName }).from(education).where(eq(education.id, id)).limit(1)
    await db.delete(education).where(eq(education.id, id))
    await logActivity("deleted", "education", id, `Deleted education "${entry?.schoolName ?? id}"`)
    revalidatePath("/admin/education")
    return { success: true, data: undefined }
  } catch (e) {
    console.error("deleteEducation error:", e)
    return { success: false, error: "Failed to delete education entry." }
  }
}
