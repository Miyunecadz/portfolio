import { notFound } from "next/navigation"
import { getReference } from "@/lib/queries/references"
import { getMediaAssets } from "@/lib/queries/media"
import { ReferenceForm } from "@/components/admin/reference-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditReferencePage({ params }: Props) {
  const { id } = await params
  const [reference, mediaAssets] = await Promise.all([
    getReference(id),
    getMediaAssets(),
  ])

  if (!reference) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Reference</h1>
        <p className="text-muted-foreground text-sm mt-1">{reference.name}</p>
      </div>
      <ReferenceForm reference={reference} mediaAssets={mediaAssets} />
    </div>
  )
}
