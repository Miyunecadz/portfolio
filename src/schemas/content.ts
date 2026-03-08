import { z } from "zod"

// ─── SHARED ───────────────────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─── PROJECTS ─────────────────────────────────────────────────────────────
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z.string().min(1, "Slug is required").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  shortDescription: z.string().max(160).optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  techStackTags: z.array(z.string()).default([]),
  liveUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  repoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  thumbnailUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  problemStatement: z.string().optional().nullable(),
  solutionApproach: z.string().optional().nullable(),
  outcomesAndImpact: z.string().optional().nullable(),
  myRole: z.string().optional().nullable(),
})

export const updateProjectSchema = createProjectSchema.extend({
  id: z.string().uuid(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
