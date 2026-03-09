"use server"

import { revalidateTag, revalidatePath } from "next/cache"
import { db } from "@/db"
import { projects } from "@/db/schema/app"
import { eq, like } from "drizzle-orm"
import { createProjectSchema, updateProjectSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const existing = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(like(projects.slug, `${base}%`))

  const slugSet = new Set(
    existing
      .map((r) => r.slug)
      .filter((s) => s !== excludeId)
  )

  if (!slugSet.has(base)) return base
  let i = 1
  while (slugSet.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

export async function createProject(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createProjectSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const uniqueSlug = await ensureUniqueSlug(parsed.data.slug)
    const [project] = await db
      .insert(projects)
      .values({ ...parsed.data, slug: uniqueSlug })
      .returning({ id: projects.id })

    await logActivity("created", "project", project.id, `Created project "${parsed.data.title}"`)
    revalidateTag("projects", "default")
    revalidatePath("/admin/projects")

    return { success: true, data: { id: project.id } }
  } catch (e) {
    console.error("createProject error:", e)
    return { success: false, error: "Failed to save project. Please try again." }
  }
}

export async function updateProject(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateProjectSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, ...data } = parsed.data

  try {
    const uniqueSlug = await ensureUniqueSlug(data.slug, id)
    await db
      .update(projects)
      .set({ ...data, slug: uniqueSlug, updatedAt: new Date() })
      .where(eq(projects.id, id))

    await logActivity("updated", "project", id, `Updated project "${data.title}"`)
    revalidateTag("projects", "default")
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${id}/edit`)

    return { success: true, data: { id } }
  } catch (e) {
    console.error("updateProject error:", e)
    return { success: false, error: "Failed to update project. Please try again." }
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const [project] = await db
      .select({ title: projects.title })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1)

    await db.delete(projects).where(eq(projects.id, id))
    await logActivity("deleted", "project", id, `Deleted project "${project?.title ?? id}"`)
    revalidateTag("projects", "default")
    revalidatePath("/admin/projects")

    return { success: true, data: undefined }
  } catch (e) {
    console.error("deleteProject error:", e)
    return { success: false, error: "Failed to delete project." }
  }
}
