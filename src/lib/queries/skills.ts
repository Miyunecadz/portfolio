import { db } from "@/db"
import { skills, skillCategories } from "@/db/schema/app"
import { eq } from "drizzle-orm"

export type Skill = typeof skills.$inferSelect
export type SkillCategory = typeof skillCategories.$inferSelect

export async function getSkills() {
  return db
    .select({
      id: skills.id,
      name: skills.name,
      categoryId: skills.categoryId,
      categoryName: skillCategories.name,
      proficiency: skills.proficiency,
      iconUrl: skills.iconUrl,
      isVisible: skills.isVisible,
      sortOrder: skills.sortOrder,
      createdAt: skills.createdAt,
      updatedAt: skills.updatedAt,
    })
    .from(skills)
    .leftJoin(skillCategories, eq(skills.categoryId, skillCategories.id))
    .orderBy(skillCategories.name, skills.name)
}

export async function getSkill(id: string) {
  const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1)
  return skill
}

export async function getSkillCategories() {
  return db.select().from(skillCategories).orderBy(skillCategories.name)
}
