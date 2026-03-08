import { getMediaAssets } from "@/lib/queries/media"
import { ExperienceForm } from "@/components/admin/experience-form"

export default async function NewExperiencePage() {
  const mediaAssets = await getMediaAssets()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Experience</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new work experience entry</p>
      </div>
      <ExperienceForm mediaAssets={mediaAssets} />
    </div>
  )
}
