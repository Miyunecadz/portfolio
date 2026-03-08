import { ExperienceForm } from "@/components/admin/experience-form"

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Experience</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new work experience entry</p>
      </div>
      <ExperienceForm />
    </div>
  )
}
