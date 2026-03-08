import { getExperiences } from "@/lib/queries/experience"
import { DataTable } from "@/components/admin/data-table"
import { experienceColumns } from "@/components/admin/experience-columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Experience</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {experiences.length} entr{experiences.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/experience/new">
            <Plus size={16} className="mr-2" /> Add Experience
          </Link>
        </Button>
      </div>
      <DataTable
        columns={experienceColumns}
        data={experiences}
        emptyMessage="No experience entries yet. Add your first role."
      />
    </div>
  )
}
