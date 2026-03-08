import { db } from "@/db"
import { projects } from "@/db/schema/app"
import { eq, desc } from "drizzle-orm"

export type Project = typeof projects.$inferSelect

export async function getProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt))
}

export async function getProject(id: string): Promise<Project | undefined> {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1)
  return project
}
