import { notFound } from "next/navigation"
import { getSkill, getSkillCategories } from "@/lib/queries/skills"
import { SkillForm } from "@/components/admin/skill-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: Props) {
  const { id } = await params
  const [skill, categories] = await Promise.all([getSkill(id), getSkillCategories()])

  if (!skill) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Skill</h1>
        <p className="text-muted-foreground text-sm mt-1">{skill.name}</p>
      </div>
      <SkillForm skill={skill} categories={categories} />
    </div>
  )
}
