import { getEducationEntries } from "@/lib/queries/education"
import { DataTable } from "@/components/admin/data-table"
import { educationColumns } from "@/components/admin/education-columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export default async function EducationPage() {
  const entries = await getEducationEntries()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Education</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/education/new">
            <Plus size={16} className="mr-2" /> Add Education
          </Link>
        </Button>
      </div>
      <DataTable
        columns={educationColumns}
        data={entries}
        emptyMessage="No education entries yet. Add your first degree or course."
      />
    </div>
  )
}
