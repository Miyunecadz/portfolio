import { EducationForm } from "@/components/admin/education-form"

export default function NewEducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Education</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a degree, course, or certification</p>
      </div>
      <EducationForm />
    </div>
  )
}
