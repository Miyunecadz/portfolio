import { unstable_cache } from "next/cache"
import { db } from "@/db"
import { themes, activeTheme, siteSettings } from "@/db/schema/app"
import { eq, and, gt } from "drizzle-orm"
import { DEFAULT_MINIMAL_CONFIG, DEFAULT_SECTION_ORDERING, type ThemeConfig } from "@/lib/theme-utils"

export const getActiveThemeConfig = unstable_cache(
  async (): Promise<ThemeConfig> => {
    const rows = await db
      .select({ config: themes.config, templateName: themes.templateName })
      .from(activeTheme)
      .leftJoin(themes, eq(activeTheme.themeId, themes.id))
      .limit(1)
    const config = rows[0]?.config
    return (config as ThemeConfig) ?? DEFAULT_MINIMAL_CONFIG
  },
  ["theme"],
  { tags: ["theme"] }
)

export async function getDraftThemeByToken(token: string): Promise<ThemeConfig | null> {
  const rows = await db
    .select({ config: themes.config })
    .from(themes)
    .where(
      and(
        eq(themes.isDraft, true),
        eq(themes.previewToken, token),
        gt(themes.previewTokenExpiry, new Date())
      )
    )
    .limit(1)
  return rows[0] ? (rows[0].config as ThemeConfig) : null
}

export const getSectionOrdering = unstable_cache(
  async () => {
    const rows = await db
      .select({ sectionOrdering: siteSettings.sectionOrdering })
      .from(siteSettings)
      .limit(1)
    return rows[0]?.sectionOrdering ?? DEFAULT_SECTION_ORDERING
  },
  ["section-ordering"],
  { tags: ["section-ordering"] }
)
