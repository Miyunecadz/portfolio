"use server"
import { revalidateTag } from "next/cache"
import { db } from "@/db"
import { themes, activeTheme, siteSettings } from "@/db/schema/app"
import { eq } from "drizzle-orm"
import { type ThemeConfig } from "@/lib/theme-utils"

// Save or update the draft theme, returns new draft row id
export async function saveTheme(config: ThemeConfig, name: string) {
  // Delete existing draft(s) first
  await db.delete(themes).where(eq(themes.isDraft, true))
  const [row] = await db
    .insert(themes)
    .values({
      name,
      templateName: config.templateName,
      config: config as Record<string, unknown>,
      isDraft: true,
    })
    .returning({ id: themes.id })
  revalidateTag("theme", "max")
  return row.id
}

// Generate preview token for the draft theme, return preview URL path
export async function generatePreviewToken(draftId: string): Promise<string> {
  const token = crypto.randomUUID()
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  await db
    .update(themes)
    .set({ previewToken: token, previewTokenExpiry: expiry })
    .where(eq(themes.id, draftId))
  return `/preview?token=${token}`
}

// Promote draft to active — replace activeTheme row's themeId
export async function publishTheme(draftId: string) {
  await db
    .update(themes)
    .set({ isDraft: false, previewToken: null, previewTokenExpiry: null })
    .where(eq(themes.id, draftId))
  await db
    .update(activeTheme)
    .set({ themeId: draftId, updatedAt: new Date() })
    .where(eq(activeTheme.id, 1))
  revalidateTag("theme", "max")
}

export async function updateSectionOrdering(
  ordering: Array<{ key: string; label: string; isVisible: boolean; sortOrder: number }>
) {
  await db
    .update(siteSettings)
    .set({ sectionOrdering: ordering, updatedAt: new Date() })
    .where(eq(siteSettings.id, 1))
  revalidateTag("section-ordering", "max")
}
