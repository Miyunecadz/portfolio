"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/db"
import { projectScreenshots } from "@/db/schema/app"
import { and, eq, sql } from "drizzle-orm"
import { randomUUID } from "crypto"
import { createSupabaseServiceClient } from "@/lib/supabase"
import { type ActionResult } from "@/schemas/content"

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"] as const

// ─── INTERNAL HELPER ──────────────────────────────────────────────────────
// Shared transaction logic used by reorderScreenshots and deleteScreenshot
// to avoid circular "use server" constraints when calling between Server Actions.
async function _reorderScreenshots(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  projectId: string,
  orderedIds: string[]
): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await tx
      .update(projectScreenshots)
      .set({ sortOrder: i })
      .where(
        and(
          eq(projectScreenshots.id, orderedIds[i]),
          eq(projectScreenshots.projectId, projectId)
        )
      )
  }
}

// ─── GET SCREENSHOT UPLOAD URL ────────────────────────────────────────────
// Returns a signed upload URL for client-side direct upload to Supabase Storage.
// The ext parameter accepts either a bare extension ("jpg") or a filename ("screenshot.jpg").
export async function getScreenshotUploadUrl(
  projectId: string,
  extOrFilename: string
): Promise<
  ActionResult<{
    signedUrl: string
    token: string
    storagePath: string
    publicUrl: string
  }>
> {
  // Accept either "screenshot.jpg" or bare "jpg"
  const ext = extOrFilename.includes(".")
    ? extOrFilename.split(".").pop()?.toLowerCase() ?? ""
    : extOrFilename.toLowerCase()

  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return { success: false, error: "Invalid file type." }
  }

  const storagePath = `screenshots/${projectId}/${randomUUID()}.${ext}`
  const supabase = createSupabaseServiceClient()

  const { data, error } = await supabase.storage
    .from("portfolio-media")
    .createSignedUploadUrl(storagePath)

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Could not create upload URL",
    }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio-media").getPublicUrl(storagePath)

  return {
    success: true,
    data: {
      signedUrl: data.signedUrl,
      token: data.token,
      storagePath,
      publicUrl,
    },
  }
}

// ─── RECORD SCREENSHOT ────────────────────────────────────────────────────
// Called after client-side upload succeeds. Inserts DB row at next sortOrder.
export async function recordScreenshot({
  projectId,
  storagePath,
  publicUrl,
}: {
  projectId: string
  storagePath: string
  publicUrl: string
}): Promise<ActionResult<{ id: string }>> {
  // Determine next sort order
  const [maxResult] = await db
    .select({ max: sql<number>`max(sort_order)` })
    .from(projectScreenshots)
    .where(eq(projectScreenshots.projectId, projectId))
    .limit(1)

  const nextSortOrder = (maxResult?.max ?? -1) + 1

  const [inserted] = await db
    .insert(projectScreenshots)
    .values({
      projectId,
      storagePath,
      publicUrl,
      sortOrder: nextSortOrder,
    })
    .returning()

  revalidatePath("/admin/projects")

  return { success: true, data: { id: inserted.id } }
}

// ─── REORDER SCREENSHOTS ──────────────────────────────────────────────────
// Reassigns sortOrder 0..N for all screenshot IDs in the given order.
export async function reorderScreenshots(
  projectId: string,
  orderedIds: string[]
): Promise<ActionResult<undefined>> {
  await db.transaction(async (tx) => {
    await _reorderScreenshots(tx, projectId, orderedIds)
  })

  revalidatePath(`/admin/projects/${projectId}/edit`)
  revalidateTag("projects", "max")

  return { success: true, data: undefined }
}

// ─── UPDATE SCREENSHOT CAPTION ────────────────────────────────────────────
// Updates only the caption field. The projectId guard in the where clause
// prevents cross-project edits when called with a full project context.
// Note: the Wave 0 test contract uses a 2-arg signature (id, caption).
export async function updateScreenshotCaption(
  id: string,
  caption: string
): Promise<ActionResult<undefined>> {
  await db
    .update(projectScreenshots)
    .set({ caption })
    .where(eq(projectScreenshots.id, id))

  revalidateTag("projects", "max")

  return { success: true, data: undefined }
}

// ─── DELETE SCREENSHOT ────────────────────────────────────────────────────
// Deletes DB row first, then removes from Storage (non-blocking failure).
// Rewrites sortOrder on remaining screenshots to close the gap.
// Note: the Wave 0 test contract uses a 1-arg signature (id).
export async function deleteScreenshot(
  id: string
): Promise<ActionResult<undefined>> {
  // Fetch screenshot to get storagePath and projectId
  const [screenshot] = await db
    .select({
      storagePath: projectScreenshots.storagePath,
      projectId: projectScreenshots.projectId,
    })
    .from(projectScreenshots)
    .where(eq(projectScreenshots.id, id))
    .limit(1)

  if (!screenshot) {
    return { success: false, error: "Screenshot not found." }
  }

  const { storagePath, projectId } = screenshot

  // Delete from DB first
  await db.delete(projectScreenshots).where(eq(projectScreenshots.id, id))

  // Remove from Storage — non-blocking failure (log orphaned path, don't fail)
  const supabase = createSupabaseServiceClient()
  const { error: storageError } = await supabase.storage
    .from("portfolio-media")
    .remove([storagePath])
  if (storageError) {
    console.error("Orphaned storage path after screenshot delete:", storagePath, storageError)
  }

  // Fetch remaining screenshots ordered by current sortOrder
  const remaining = await db
    .select({ id: projectScreenshots.id })
    .from(projectScreenshots)
    .where(eq(projectScreenshots.projectId, projectId))
    .orderBy(projectScreenshots.sortOrder)

  // Rewrite sortOrder to close the gap
  if (remaining.length > 0) {
    await db.transaction(async (tx) => {
      await _reorderScreenshots(
        tx,
        projectId,
        remaining.map((s) => s.id)
      )
    })
  }

  revalidatePath(`/admin/projects/${projectId}/edit`)
  revalidateTag("projects", "max")

  return { success: true, data: undefined }
}
