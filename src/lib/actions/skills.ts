"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { skills, skillCategories } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { createSkillSchema, updateSkillSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

export async function createSkill(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createSkillSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  try {
    const [skill] = await db.insert(skills).values(parsed.data).returning({ id: skills.id })
    await logActivity("created", "skill", skill.id, `Created skill "${parsed.data.name}"`)
    revalidatePath("/admin/skills")
    return { success: true, data: { id: skill.id } }
  } catch (e) {
    console.error("createSkill error:", e)
    return { success: false, error: "Failed to save skill." }
  }
}

export async function updateSkill(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateSkillSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  const { id, ...data } = parsed.data
  try {
    await db.update(skills).set({ ...data, updatedAt: new Date() }).where(eq(skills.id, id))
    await logActivity("updated", "skill", id, `Updated skill "${data.name}"`)
    revalidatePath("/admin/skills")
    return { success: true, data: { id } }
  } catch (e) {
    console.error("updateSkill error:", e)
    return { success: false, error: "Failed to update skill." }
  }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  try {
    const [skill] = await db.select({ name: skills.name }).from(skills).where(eq(skills.id, id)).limit(1)
    await db.delete(skills).where(eq(skills.id, id))
    await logActivity("deleted", "skill", id, `Deleted skill "${skill?.name ?? id}"`)
    revalidatePath("/admin/skills")
    return { success: true, data: undefined }
  } catch (e) {
    console.error("deleteSkill error:", e)
    return { success: false, error: "Failed to delete skill." }
  }
}

export async function createSkillCategory(name: string): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const [cat] = await db.insert(skillCategories).values({ name, isDefault: false }).returning({ id: skillCategories.id, name: skillCategories.name })
    return { success: true, data: cat }
  } catch (e) {
    console.error("createSkillCategory error:", e)
    return { success: false, error: "Category name already exists or is invalid." }
  }
}
