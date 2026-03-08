"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface SortableSectionRowProps {
  id: string
  label: string
  isVisible: boolean
  onToggleVisibility: (key: string) => void
}

export function SortableSectionRow({ id, label, isVisible, onToggleVisibility }: SortableSectionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
        aria-label={`Drag to reorder ${label}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Switch
        checked={isVisible}
        onCheckedChange={() => onToggleVisibility(id)}
        aria-label={`Toggle visibility of ${label} section`}
      />
    </div>
  )
}
