import { sql, eq, desc } from "drizzle-orm"
import { db } from "@/db"
import {
  projects,
  experiences,
  skills,
  contactSubmissions,
  activityLog,
} from "@/db/schema/app"

export async function getDashboardStats() {
  const [
    [{ value: projectCount }],
    [{ value: experienceCount }],
    [{ value: skillCount }],
    [{ value: unreadCount }],
  ] = await Promise.all([
    db.select({ value: sql<number>`cast(count(*) as integer)` }).from(projects),
    db.select({ value: sql<number>`cast(count(*) as integer)` }).from(experiences),
    db.select({ value: sql<number>`cast(count(*) as integer)` }).from(skills),
    db
      .select({ value: sql<number>`cast(count(*) as integer)` })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, "unread")),
  ])
  return { projectCount, experienceCount, skillCount, unreadCount }
}

export async function getRecentActivity() {
  return db
    .select()
    .from(activityLog)
    .orderBy(desc(activityLog.createdAt))
    .limit(20)
}
