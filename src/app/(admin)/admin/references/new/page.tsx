import { ReferenceForm } from "@/components/admin/reference-form"

export default function NewReferencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Reference</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new testimonial or reference</p>
      </div>
      <ReferenceForm />
    </div>
  )
}
