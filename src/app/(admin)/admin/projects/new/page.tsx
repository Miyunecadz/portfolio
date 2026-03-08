import { getMediaAssets } from "@/lib/queries/media"
import { ProjectForm } from "@/components/admin/project-form"

export default async function NewProjectPage() {
  const mediaAssets = await getMediaAssets()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Project</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new portfolio project.</p>
      </div>
      <ProjectForm mediaAssets={mediaAssets} />
    </div>
  )
}
