import { notFound } from "next/navigation"
import { getReference } from "@/lib/queries/references"
import { ReferenceForm } from "@/components/admin/reference-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditReferencePage({ params }: Props) {
  const { id } = await params
  const reference = await getReference(id)

  if (!reference) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Reference</h1>
        <p className="text-muted-foreground text-sm mt-1">{reference.name}</p>
      </div>
      <ReferenceForm reference={reference} />
    </div>
  )
}
