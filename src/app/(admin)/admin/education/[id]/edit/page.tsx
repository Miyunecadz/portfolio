import { notFound } from "next/navigation"
import { getEducationEntry } from "@/lib/queries/education"
import { EducationForm } from "@/components/admin/education-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEducationPage({ params }: Props) {
  const { id } = await params
  const entry = await getEducationEntry(id)

  if (!entry) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Education</h1>
        <p className="text-muted-foreground text-sm mt-1">{entry.schoolName}</p>
      </div>
      <EducationForm entry={entry} />
    </div>
  )
}
