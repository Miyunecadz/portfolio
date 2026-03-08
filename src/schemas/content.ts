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

// ─── EXPERIENCE ───────────────────────────────────────────────────────────
export const createExperienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(100),
  companyLogoUrl: z.string().optional().nullable(),
  jobTitle: z.string().min(1, "Job title is required").max(100),
  employmentType: z.enum(["full-time", "part-time", "contract", "freelance", "internship"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  isCurrentRole: z.boolean().default(false),
  description: z.string().optional().nullable(),
  techStackTags: z.array(z.string()).default([]),
})
export const updateExperienceSchema = createExperienceSchema.extend({ id: z.string().uuid() })
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>

// ─── SKILLS ───────────────────────────────────────────────────────────────
export const createSkillSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  categoryId: z.string().uuid("Select a category").optional().nullable(),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  iconUrl: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
})
export const updateSkillSchema = createSkillSchema.extend({ id: z.string().uuid() })
export type CreateSkillInput = z.infer<typeof createSkillSchema>
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>

// ─── REFERENCES ───────────────────────────────────────────────────────────
export const createReferenceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  jobTitle: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  quote: z.string().min(1, "Quote/testimonial is required"),
  photoUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isVisible: z.boolean().default(true),
})
export const updateReferenceSchema = createReferenceSchema.extend({ id: z.string().uuid() })
export type CreateReferenceInput = z.infer<typeof createReferenceSchema>
export type UpdateReferenceInput = z.infer<typeof updateReferenceSchema>

// ─── EDUCATION ────────────────────────────────────────────────────────────
export const createEducationSchema = z.object({
  schoolName: z.string().min(1, "School name is required").max(100),
  schoolLogoUrl: z.string().optional().nullable(),
  degreeType: z.enum(["bachelor", "master", "phd", "associate", "diploma", "certificate", "bootcamp", "self-taught", "other"]),
  fieldOfStudy: z.string().max(100).optional().nullable(),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).optional().nullable(),
  isVisible: z.boolean().default(true),
})
export const updateEducationSchema = createEducationSchema.extend({ id: z.string().uuid() })
export type CreateEducationInput = z.infer<typeof createEducationSchema>
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>
