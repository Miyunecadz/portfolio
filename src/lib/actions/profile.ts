"use server"

import { revalidateTag, revalidatePath } from "next/cache"
import { db } from "@/db"
import { profile } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { upsertProfileSchema, type ActionResult } from "@/schemas/content"
import { logActivity } from "@/lib/activity"

export async function upsertProfile(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = upsertProfileSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { id, ...data } = parsed.data

  try {
    let profileId: string

    if (id) {
      // Update existing row
      await db.update(profile).set({ ...data, updatedAt: new Date() }).where(eq(profile.id, id))
      profileId = id
    } else {
      // Insert (fallback if seed was not run)
      const [row] = await db.insert(profile).values(data).returning({ id: profile.id })
      profileId = row.id
    }

    await logActivity("updated", "profile", profileId, "Updated profile")
    revalidateTag("profile", "max")
    revalidatePath("/admin/profile")

    return { success: true, data: { id: profileId } }
  } catch (e) {
    console.error("upsertProfile error:", e)
    return { success: false, error: "Failed to save profile." }
  }
}
