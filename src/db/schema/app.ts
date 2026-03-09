import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core"
import { vector } from "drizzle-orm/pg-core"
import { users } from "./auth"

// ─── PROFILE ──────────────────────────────────────────────────────────────
export const profile = pgTable("profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 100 }),
  tagline: varchar("tagline", { length: 160 }),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  availabilityStatus: varchar("availability_status", { length: 30 }).default("not_available"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  facebookUrl: text("facebook_url"),
  blogUrl: text("blog_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── PROJECTS ─────────────────────────────────────────────────────────────
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  shortDescription: varchar("short_description", { length: 160 }),
  fullDescription: text("full_description"),
  techStackTags: jsonb("tech_stack_tags").$type<string[]>().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  thumbnailUrl: text("thumbnail_url"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  problemStatement: text("problem_statement"),
  solutionApproach: text("solution_approach"),
  outcomesAndImpact: text("outcomes_and_impact"),
  myRole: text("my_role"),
  githubRepoId: text("github_repo_id").unique(),
  sortOrder: integer("sort_order").default(0),
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  ogImageUrl: text("og_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── PROJECT SCREENSHOTS ──────────────────────────────────────────────────
export const projectScreenshots = pgTable("project_screenshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  storagePath: text("storage_path").notNull(),
  publicUrl: text("public_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── EXPERIENCES ──────────────────────────────────────────────────────────
export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: varchar("company_name", { length: 100 }).notNull(),
  companyLogoUrl: text("company_logo_url"),
  jobTitle: varchar("job_title", { length: 100 }).notNull(),
  employmentType: varchar("employment_type", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrentRole: boolean("is_current_role").default(false).notNull(),
  description: text("description"),
  techStackTags: jsonb("tech_stack_tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── SKILL CATEGORIES ─────────────────────────────────────────────────────
export const skillCategories = pgTable("skill_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── SKILLS ───────────────────────────────────────────────────────────────
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  categoryId: uuid("category_id").references(() => skillCategories.id),
  proficiency: varchar("proficiency", { length: 20 }).notNull(),
  iconUrl: text("icon_url"),
  isVisible: boolean("is_visible").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── REFERENCES ───────────────────────────────────────────────────────────
// Named "referencesTable" to avoid collision with PostgreSQL reserved word
export const referencesTable = pgTable("references", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  jobTitle: varchar("job_title", { length: 100 }),
  company: varchar("company", { length: 100 }),
  quote: text("quote").notNull(),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── EDUCATION ────────────────────────────────────────────────────────────
export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolName: varchar("school_name", { length: 100 }).notNull(),
  schoolLogoUrl: text("school_logo_url"),
  degreeType: varchar("degree_type", { length: 50 }).notNull(),
  fieldOfStudy: varchar("field_of_study", { length: 100 }),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── AI KNOWLEDGE CHUNKS ──────────────────────────────────────────────────
// pgvector MUST be enabled in Supabase before this migration runs
// embedding dimensions = 1536 (OpenAI text-embedding-3-small)
export const aiKnowledgeChunks = pgTable(
  "ai_knowledge_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops")),
  ]
)

// ─── MEDIA ASSETS ─────────────────────────────────────────────────────────
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  storagePath: text("storage_path").notNull(),
  publicUrl: text("public_url").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSizeBytes: integer("file_size_bytes"),
  usedIn: varchar("used_in", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── CONTACT SUBMISSIONS ──────────────────────────────────────────────────
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  budgetRange: varchar("budget_range", { length: 50 }),
  projectType: varchar("project_type", { length: 50 }),
  status: varchar("status", { length: 20 }).default("unread").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────
// userId FK to BetterAuth users table — records which admin performed each action
export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: uuid("entity_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── SITE SETTINGS ────────────────────────────────────────────────────────
// Single-row table (id = 1). Never delete this row. Covers SET-01, SET-02, DASH-02/DASH-05.
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  googleAnalyticsId: text("google_analytics_id"),
  siteTitle: varchar("site_title", { length: 60 }),
  siteTagline: varchar("site_tagline", { length: 160 }),
  contactFormEnabled: boolean("contact_form_enabled").default(true).notNull(),
  calendlyEnabled: boolean("calendly_enabled").default(false).notNull(),
  calendlyUrl: text("calendly_url"),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  maintenanceMessage: text("maintenance_message"),
  robotsContent: text("robots_content"),
  sectionOrdering: jsonb("section_ordering")
    .$type<Array<{ key: string; label: string; isVisible: boolean; sortOrder: number }>>()
    .default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
