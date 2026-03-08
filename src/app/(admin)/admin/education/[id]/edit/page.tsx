import { notFound } from "next/navigation"
import { getEducationEntry } from "@/lib/queries/education"
import { getMediaAssets } from "@/lib/queries/media"
import { EducationForm } from "@/components/admin/education-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEducationPage({ params }: Props) {
  const { id } = await params
  const [entry, mediaAssets] = await Promise.all([
    getEducationEntry(id),
    getMediaAssets(),
  ])

  if (!entry) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Education</h1>
        <p className="text-muted-foreground text-sm mt-1">{entry.schoolName}</p>
      </div>
      <EducationForm entry={entry} mediaAssets={mediaAssets} />
    </div>
  )
}
