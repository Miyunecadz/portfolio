"use client"

import { useState, useTransition } from "react"
import { updateSectionOrdering } from "@/lib/actions/appearance"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Section = { key: string; label: string; isVisible: boolean; sortOrder: number }

interface SectionsClientProps {
  initialOrdering: Section[]
}

export function SectionsClient({ initialOrdering }: SectionsClientProps) {
  const [sections, setSections] = useState<Section[]>(
    [...initialOrdering].sort((a, b) => a.sortOrder - b.sortOrder)
  )
  const [isPending, startTransition] = useTransition()

  function toggleVisibility(key: string) {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, isVisible: !s.isVisible } : s))
    )
  }

  function handleSave() {
    startTransition(async () => {
      await updateSectionOrdering(sections)
      toast.success("Section ordering saved")
    })
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border rounded-lg border">
        {sections.map((section) => (
          <li
            key={section.key}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm w-5 text-center">
                {section.sortOrder + 1}
              </span>
              <Label htmlFor={`toggle-${section.key}`} className="font-medium cursor-pointer">
                {section.label}
              </Label>
            </div>
            <Switch
              id={`toggle-${section.key}`}
              checked={section.isVisible}
              onCheckedChange={() => toggleVisibility(section.key)}
            />
          </li>
        ))}
      </ul>

      <Button onClick={handleSave} disabled={isPending}>
        Save Ordering
      </Button>
    </div>
  )
}
