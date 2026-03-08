import { getSectionOrdering } from "@/lib/queries/appearance"
import { SectionOrderingClient } from "@/components/admin/section-ordering-client"

export default async function SectionsPage() {
  const ordering = await getSectionOrdering()
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Sections &amp; Ordering</h1>
      <SectionOrderingClient initialItems={ordering as Array<{ key: string; label: string; isVisible: boolean; sortOrder: number }>} />
    </div>
  )
}
