import { getMediaAssets } from "@/lib/queries/media"
import { EducationForm } from "@/components/admin/education-form"

export default async function NewEducationPage() {
  const mediaAssets = await getMediaAssets()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Education</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a degree, course, or certification</p>
      </div>
      <EducationForm mediaAssets={mediaAssets} />
    </div>
  )
}
