"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  mediaAssets,
  projects,
  profile,
  experiences,
  referencesTable,
  skills,
  education,
} from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"
import { createSupabaseServiceClient } from "@/lib/supabase"
import { logActivity } from "@/lib/activity"
import { type ActionResult } from "@/schemas/content"

type UsedInEntry = { entity: string; name: string }

export async function uploadMediaAsset(
  formData: FormData,
  section: string = "misc"
): Promise<ActionResult<{ id: string; publicUrl: string; fileName: string }>> {
  const file = formData.get("file") as File | null
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." }
  }

  // Determine storage folder from section
  const folderMap: Record<string, string> = {
    avatars: "avatars",
    resumes: "resumes",
    thumbnails: "thumbnails",
    logos: "logos",
  }
  const folder = folderMap[section] ?? "misc"
  const ext = file.name.split(".").pop() ?? "bin"
  const storagePath = `${folder}/${randomUUID()}.${ext}`

  const supabase = createSupabaseServiceClient()

  const { error: uploadError } = await supabase.storage
    .from("portfolio-media")
    .upload(storagePath, file, { upsert: false })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio-media").getPublicUrl(storagePath)

  try {
    const [asset] = await db
      .insert(mediaAssets)
      .values({
        storagePath,
        publicUrl,
        fileName: file.name,
        fileType: file.type,
        fileSizeBytes: file.size,
        usedIn: section,
      })
      .returning()

    await logActivity("uploaded", "media", asset.id, `Uploaded file "${file.name}"`)
    revalidatePath("/admin/media")

    return { success: true, data: { id: asset.id, publicUrl, fileName: file.name } }
  } catch {
    // Clean up Storage upload if DB insert fails
    await supabase.storage.from("portfolio-media").remove([storagePath])
    return { success: false, error: "Failed to record upload in database." }
  }
}

export async function deleteMediaAsset(
  id: string
): Promise<ActionResult | { success: false; usedIn: UsedInEntry[] }> {
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1)

  if (!asset) return { success: false, error: "File not found." }

  // Cross-check ALL entity URL columns. usedIn field on mediaAssets is informational only — not authoritative.
  const usedByEntities: UsedInEntry[] = []

  const [proj] = await db
    .select({ id: projects.id, title: projects.title })
    .from(projects)
    .where(eq(projects.thumbnailUrl, asset.publicUrl))
    .limit(1)
  if (proj) usedByEntities.push({ entity: "project thumbnail", name: proj.title })

  const [projOg] = await db
    .select({ id: projects.id, title: projects.title })
    .from(projects)
    .where(eq(projects.ogImageUrl, asset.publicUrl))
    .limit(1)
  if (projOg) usedByEntities.push({ entity: "project OG image", name: projOg.title })

  const [prof] = await db
    .select({ avatarUrl: profile.avatarUrl, resumeUrl: profile.resumeUrl })
    .from(profile)
    .limit(1)
  if (prof?.avatarUrl === asset.publicUrl) usedByEntities.push({ entity: "profile", name: "avatar" })
  if (prof?.resumeUrl === asset.publicUrl) usedByEntities.push({ entity: "profile", name: "resume PDF" })

  const [exp] = await db
    .select({ id: experiences.id, companyName: experiences.companyName })
    .from(experiences)
    .where(eq(experiences.companyLogoUrl, asset.publicUrl))
    .limit(1)
  if (exp) usedByEntities.push({ entity: "experience logo", name: exp.companyName })

  const [ref] = await db
    .select({ id: referencesTable.id, name: referencesTable.name })
    .from(referencesTable)
    .where(eq(referencesTable.photoUrl, asset.publicUrl))
    .limit(1)
  if (ref) usedByEntities.push({ entity: "reference photo", name: ref.name })

  const [skill] = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .where(eq(skills.iconUrl, asset.publicUrl))
    .limit(1)
  if (skill) usedByEntities.push({ entity: "skill icon", name: skill.name })

  const [edu] = await db
    .select({ id: education.id, schoolName: education.schoolName })
    .from(education)
    .where(eq(education.schoolLogoUrl, asset.publicUrl))
    .limit(1)
  if (edu) usedByEntities.push({ entity: "education logo", name: edu.schoolName })

  // Block deletion if file is in use
  if (usedByEntities.length > 0) {
    return { success: false, usedIn: usedByEntities }
  }

  // Safe to delete
  const supabase = createSupabaseServiceClient()
  const { error: storageError } = await supabase.storage
    .from("portfolio-media")
    .remove([asset.storagePath])

  if (storageError) {
    return { success: false, error: `Storage deletion failed: ${storageError.message}` }
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  await logActivity("deleted", "media", id, `Deleted file "${asset.fileName}"`)
  revalidatePath("/admin/media")

  return { success: true, data: undefined }
}
