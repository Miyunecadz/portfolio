import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Project</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new portfolio project.</p>
      </div>
      <ProjectForm />
    </div>
  )
}
