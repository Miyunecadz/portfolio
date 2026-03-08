import { getSkillCategories } from "@/lib/queries/skills"
import { SkillForm } from "@/components/admin/skill-form"

export default async function NewSkillPage() {
  const categories = await getSkillCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Skill</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new skill to your profile</p>
      </div>
      <SkillForm categories={categories} />
    </div>
  )
}
