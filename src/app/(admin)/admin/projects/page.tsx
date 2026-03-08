import { getProjects } from "@/lib/queries/projects"
import { DataTable } from "@/components/admin/data-table"
import { projectColumns } from "@/components/admin/projects-columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus size={16} className="mr-2" /> Add Project
          </Link>
        </Button>
      </div>
      <DataTable columns={projectColumns} data={projects} emptyMessage="No projects yet. Create your first project." />
    </div>
  )
}
