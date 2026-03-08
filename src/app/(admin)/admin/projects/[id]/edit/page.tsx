import { getProject } from "@/lib/queries/projects"
import { getMediaAssets } from "@/lib/queries/media"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [project, mediaAssets] = await Promise.all([
    getProject(id),
    getMediaAssets(),
  ])
  if (!project) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground text-sm mt-1">{project.title}</p>
      </div>
      <ProjectForm project={project} mediaAssets={mediaAssets} />
    </div>
  )
}
