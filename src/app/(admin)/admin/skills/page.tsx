import { getSkills } from "@/lib/queries/skills"
import { DataTable } from "@/components/admin/data-table"
import { skillColumns } from "@/components/admin/skills-columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="text-muted-foreground text-sm mt-1">{skills.length} skill{skills.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/admin/skills/new">
            <Plus size={16} className="mr-2" /> Add Skill
          </Link>
        </Button>
      </div>
      <DataTable
        columns={skillColumns}
        data={skills}
        emptyMessage="No skills yet. Add your first skill."
      />
    </div>
  )
}
