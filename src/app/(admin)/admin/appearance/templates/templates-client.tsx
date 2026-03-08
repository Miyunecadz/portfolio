"use client"

import { useState, useTransition } from "react"
import { saveTheme, generatePreviewToken, publishTheme } from "@/lib/actions/appearance"
import { type ThemeConfig } from "@/lib/theme-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { CheckCircle } from "@phosphor-icons/react"

interface TemplatesClientProps {
  activeTemplateName: string
  minimalConfig: ThemeConfig
  developerConfig: ThemeConfig
}

export function TemplatesClient({
  activeTemplateName,
  minimalConfig,
  developerConfig,
}: TemplatesClientProps) {
  const [selected, setSelected] = useState<"minimal" | "developer">(
    activeTemplateName as "minimal" | "developer"
  )
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const templates: Array<{
    key: "minimal" | "developer"
    label: string
    description: string
    config: ThemeConfig
  }> = [
    {
      key: "minimal",
      label: "Minimal",
      description:
        "Clean, distraction-free layout. Focuses on content with generous white space and neutral tones.",
      config: minimalConfig,
    },
    {
      key: "developer",
      label: "Developer",
      description:
        "Technical aesthetic with subtle code-inspired accents. Ideal for showcasing engineering work.",
      config: developerConfig,
    },
  ]

  function handleSelect(key: "minimal" | "developer", config: ThemeConfig) {
    setSelected(key)
    startTransition(async () => {
      const id = await saveTheme(config, key)
      setDraftId(id)
      toast.success(`Template "${key}" saved as draft`)
    })
  }

  function handlePreview() {
    if (!draftId) {
      toast.error("Select and save a template first")
      return
    }
    startTransition(async () => {
      const path = await generatePreviewToken(draftId)
      window.open(path, "_blank")
    })
  }

  function handlePublish() {
    if (!draftId) {
      toast.error("Select and save a template first")
      return
    }
    startTransition(async () => {
      await publishTheme(draftId)
      toast.success("Theme published — live site updated")
      setDraftId(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(({ key, label, description, config }) => {
          const isActive = selected === key
          return (
            <Card
              key={key}
              className={`relative p-5 cursor-pointer transition-all border-2 ${
                isActive
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-muted-foreground"
              }`}
              onClick={() => handleSelect(key, config)}
            >
              {isActive && (
                <CheckCircle
                  className="absolute top-3 right-3 text-primary"
                  size={20}
                  weight="fill"
                />
              )}
              <h2 className="font-semibold text-base mb-1">{label}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePreview}
          disabled={isPending || !draftId}
        >
          Preview in New Tab
        </Button>
        <Button onClick={handlePublish} disabled={isPending || !draftId}>
          Publish Theme
        </Button>
      </div>

      {draftId && (
        <p className="text-xs text-muted-foreground">
          Draft saved. Preview to verify before publishing.
        </p>
      )}
    </div>
  )
}
