"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/db"
import { experiences } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { createExperienceSchema, updateExperienceSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

export async function createExperience(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createExperienceSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  try {
    const data = {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    }
    const [exp] = await db.insert(experiences).values(data).returning({ id: experiences.id })
    await logActivity("created", "experience", exp.id, `Created experience "${parsed.data.jobTitle} at ${parsed.data.companyName}"`)
    revalidateTag("experience", "default")
    revalidatePath("/admin/experience")
    return { success: true, data: { id: exp.id } }
  } catch (e) {
    console.error("createExperience error:", e)
    return { success: false, error: "Failed to save experience." }
  }
}

export async function updateExperience(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateExperienceSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const { id, ...data } = parsed.data
  try {
    await db.update(experiences).set({
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      updatedAt: new Date(),
    }).where(eq(experiences.id, id))

    await logActivity("updated", "experience", id, `Updated experience "${data.jobTitle} at ${data.companyName}"`)
    revalidateTag("experience", "default")
    revalidatePath("/admin/experience")
    return { success: true, data: { id } }
  } catch (e) {
    console.error("updateExperience error:", e)
    return { success: false, error: "Failed to update experience." }
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  try {
    const [exp] = await db.select({ jobTitle: experiences.jobTitle }).from(experiences).where(eq(experiences.id, id)).limit(1)
    await db.delete(experiences).where(eq(experiences.id, id))
    await logActivity("deleted", "experience", id, `Deleted experience "${exp?.jobTitle ?? id}"`)
    revalidateTag("experience", "default")
    revalidatePath("/admin/experience")
    return { success: true, data: undefined }
  } catch (e) {
    console.error("deleteExperience error:", e)
    return { success: false, error: "Failed to delete experience." }
  }
}
