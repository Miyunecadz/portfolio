import { getReferences } from "@/lib/queries/references"
import { DataTable } from "@/components/admin/data-table"
import { referenceColumns } from "@/components/admin/references-columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export default async function ReferencesPage() {
  const references = await getReferences()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">References</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {references.length} reference{references.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/references/new">
            <Plus size={16} className="mr-2" /> Add Reference
          </Link>
        </Button>
      </div>
      <DataTable
        columns={referenceColumns}
        data={references}
        emptyMessage="No references yet. Add your first testimonial."
      />
    </div>
  )
}
