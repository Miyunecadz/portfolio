"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/db"
import { referencesTable } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { createReferenceSchema, updateReferenceSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

export async function createReference(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = createReferenceSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  try {
    const [ref] = await db.insert(referencesTable).values(parsed.data).returning({ id: referencesTable.id })
    await logActivity("created", "reference", ref.id, `Created reference from "${parsed.data.name}"`)
    revalidateTag("references", "max")
    revalidatePath("/admin/references")
    return { success: true, data: { id: ref.id } }
  } catch (e) {
    console.error("createReference error:", e)
    return { success: false, error: "Failed to save reference." }
  }
}

export async function updateReference(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = updateReferenceSchema.safeParse(formData)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
  const { id, ...data } = parsed.data
  try {
    await db.update(referencesTable).set({ ...data, updatedAt: new Date() }).where(eq(referencesTable.id, id))
    await logActivity("updated", "reference", id, `Updated reference from "${data.name}"`)
    revalidateTag("references", "max")
    revalidatePath("/admin/references")
    return { success: true, data: { id } }
  } catch (e) {
    console.error("updateReference error:", e)
    return { success: false, error: "Failed to update reference." }
  }
}

export async function deleteReference(id: string): Promise<ActionResult> {
  try {
    const [ref] = await db.select({ name: referencesTable.name }).from(referencesTable).where(eq(referencesTable.id, id)).limit(1)
    await db.delete(referencesTable).where(eq(referencesTable.id, id))
    await logActivity("deleted", "reference", id, `Deleted reference from "${ref?.name ?? id}"`)
    revalidateTag("references", "max")
    revalidatePath("/admin/references")
    return { success: true, data: undefined }
  } catch (e) {
    console.error("deleteReference error:", e)
    return { success: false, error: "Failed to delete reference." }
  }
}
