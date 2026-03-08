"use client"

import { useState, useTransition } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { updateSectionOrdering } from "@/lib/actions/appearance"
import { SortableSectionRow } from "@/components/admin/sortable-section-row"
import { Button } from "@/components/ui/button"

type SectionItem = { key: string; label: string; isVisible: boolean; sortOrder: number }

interface SectionOrderingClientProps {
  initialItems: SectionItem[]
}

export function SectionOrderingClient({ initialItems }: SectionOrderingClientProps) {
  const [items, setItems] = useState(initialItems)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.key === active.id)
    const newIndex = items.findIndex((i) => i.key === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }))
    setItems(reordered)
    setSaved(false)
  }

  function handleToggle(key: string) {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, isVisible: !i.isVisible } : i))
    )
    setSaved(false)
  }

  function handleSave() {
    startTransition(async () => {
      await updateSectionOrdering(items)
      setSaved(true)
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag to reorder sections. Toggle visibility to show or hide a section on the public site.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableSectionRow
                key={item.key}
                id={item.key}
                label={item.label}
                isVisible={item.isVisible}
                onToggleVisibility={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Order & Visibility"}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>
    </div>
  )
}
