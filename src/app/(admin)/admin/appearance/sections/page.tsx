import { getSectionOrdering } from "@/lib/queries/appearance"
import { SectionsClient } from "./sections-client"

export default async function SectionsPage() {
  const sectionOrdering = await getSectionOrdering()

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sections &amp; Ordering</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control which sections appear on your public portfolio and their order.
        </p>
        {/* TODO: 04-03-PLAN upgrades this to @dnd-kit/sortable drag-and-drop */}
      </div>

      <SectionsClient initialOrdering={sectionOrdering as Array<{ key: string; label: string; isVisible: boolean; sortOrder: number }>} />
    </div>
  )
}
