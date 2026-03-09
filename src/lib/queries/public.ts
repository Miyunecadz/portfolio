import { unstable_cache } from "next/cache"
import { db } from "@/db"
import {
  projects,
  projectScreenshots,
  experiences,
  skills,
  skillCategories,
  referencesTable,
  education,
  profile,
  siteSettings,
} from "@/db/schema/app"
import { eq, desc, and, sql } from "drizzle-orm"

// ─── PROJECTS ─────────────────────────────────────────────────────────────

// PROJ-05: published only, featured first, then by createdAt desc
export const getPublishedProjects = unstable_cache(
  async () => {
    return db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(desc(projects.isFeatured), desc(projects.createdAt))
  },
  ["public-published-projects"],
  { tags: ["projects"] }
)

// PROJ-06: filter by tech stack tag using JSONB @> operator
// Cannot use eq() for array element containment — must use sql template.
export const getPublishedProjectsByTag = unstable_cache(
  async (tag: string) => {
    return db
      .select()
      .from(projects)
      .where(
        sql`${projects.status} = 'published'
            AND ${projects.techStackTags} @> ${JSON.stringify([tag])}::jsonb`
      )
      .orderBy(desc(projects.isFeatured), desc(projects.createdAt))
  },
  ["public-projects-by-tag"],
  { tags: ["projects"] }
)

// Single project by slug — for project detail page in Phase 4
export const getPublishedProjectBySlug = unstable_cache(
  async (slug: string) => {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
      .limit(1)
    return project
  },
  ["public-project-by-slug"],
  { tags: ["projects"] }
)

// PROJ-15: public screenshots query — ISR cached, busts with "projects" tag
export const getProjectScreenshotsPublic = unstable_cache(
  async (projectId: string) => {
    return db
      .select()
      .from(projectScreenshots)
      .where(eq(projectScreenshots.projectId, projectId))
      .orderBy(projectScreenshots.sortOrder)
  },
  ["public-project-screenshots"],
  { tags: ["projects"] }
)

// All unique tech tags from published projects — for filter UI in Phase 4
export const getPublishedProjectTags = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db
      .select({ tags: projects.techStackTags })
      .from(projects)
      .where(eq(projects.status, "published"))
    // Flatten and deduplicate all tags across all projects
    const all = rows.flatMap((r) => (r.tags as string[]) ?? [])
    return [...new Set(all)].sort()
  },
  ["public-project-tags"],
  { tags: ["projects"] }
)

// ─── EXPERIENCE ───────────────────────────────────────────────────────────

// EXP-05: sorted by startDate descending; no isVisible filter on experience
export const getPublishedExperiences = unstable_cache(
  async () => {
    return db
      .select()
      .from(experiences)
      .orderBy(desc(experiences.startDate))
  },
  ["public-experiences"],
  { tags: ["experience"] }
)

// ─── SKILLS ───────────────────────────────────────────────────────────────

// SKILL-02: isVisible only; grouped by category for public display
export const getVisibleSkillsByCategory = unstable_cache(
  async () => {
    const rows = await db
      .select({
        id: skills.id,
        name: skills.name,
        proficiency: skills.proficiency,
        iconUrl: skills.iconUrl,
        sortOrder: skills.sortOrder,
        categoryId: skills.categoryId,
        categoryName: skillCategories.name,
      })
      .from(skills)
      .leftJoin(skillCategories, eq(skills.categoryId, skillCategories.id))
      .where(eq(skills.isVisible, true))
      .orderBy(skillCategories.name, skills.sortOrder, skills.name)

    // Group into { [categoryName]: Skill[] } for easy rendering
    const grouped: Record<string, typeof rows> = {}
    for (const skill of rows) {
      const cat = skill.categoryName ?? "Other"
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(skill)
    }
    return grouped
  },
  ["public-skills"],
  { tags: ["skills"] }
)

// ─── REFERENCES ───────────────────────────────────────────────────────────

// REF-03: isVisible only, sorted createdAt desc
export const getVisibleReferences = unstable_cache(
  async () => {
    return db
      .select()
      .from(referencesTable)
      .where(eq(referencesTable.isVisible, true))
      .orderBy(desc(referencesTable.createdAt))
  },
  ["public-references"],
  { tags: ["references"] }
)

// ─── EDUCATION ────────────────────────────────────────────────────────────

// EDU-03: isVisible only, sorted startYear desc
export const getVisibleEducation = unstable_cache(
  async () => {
    return db
      .select()
      .from(education)
      .where(eq(education.isVisible, true))
      .orderBy(desc(education.startYear))
  },
  ["public-education"],
  { tags: ["education"] }
)

// ─── PROFILE ──────────────────────────────────────────────────────────────

// Single profile row — used by Phase 4 hero section (PROF-04, PROF-05, PROF-06)
export const getProfilePublic = unstable_cache(
  async () => {
    const [row] = await db.select().from(profile).limit(1)
    return row
  },
  ["public-profile"],
  { tags: ["profile"] }
)

// ─── SITE SETTINGS ────────────────────────────────────────────────────────

// Public-facing settings: contact form + calendly visibility flags
export const getSiteSettingsPublic = unstable_cache(
  async () => {
    const [row] = await db
      .select({
        contactFormEnabled: siteSettings.contactFormEnabled,
        calendlyEnabled: siteSettings.calendlyEnabled,
        calendlyUrl: siteSettings.calendlyUrl,
      })
      .from(siteSettings)
      .limit(1)
    return row ?? { contactFormEnabled: true, calendlyEnabled: false, calendlyUrl: null }
  },
  ["public-site-settings"],
  { tags: ["site-settings"] }
)
