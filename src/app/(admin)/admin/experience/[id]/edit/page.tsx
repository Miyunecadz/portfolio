import { notFound } from "next/navigation"
import { getExperience } from "@/lib/queries/experience"
import { ExperienceForm } from "@/components/admin/experience-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params
  const experience = await getExperience(id)

  if (!experience) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Experience</h1>
        <p className="text-muted-foreground text-sm mt-1">{experience.jobTitle} at {experience.companyName}</p>
      </div>
      <ExperienceForm experience={experience} />
    </div>
  )
}
