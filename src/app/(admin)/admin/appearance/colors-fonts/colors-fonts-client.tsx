"use client"

import { useState, useTransition } from "react"
import { saveTheme, generatePreviewToken, publishTheme } from "@/lib/actions/appearance"
import {
  type ThemeConfig,
  DEFAULT_MINIMAL_CONFIG,
  DEFAULT_DEVELOPER_CONFIG,
  THEME_PRESETS,
} from "@/lib/theme-utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ColorsFontsClientProps {
  initialConfig: ThemeConfig
}

export function ColorsFontsClient({ initialConfig }: ColorsFontsClientProps) {
  const [config, setConfig] = useState<ThemeConfig>(initialConfig)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const defaultPrimary =
    config.templateName === "developer"
      ? DEFAULT_DEVELOPER_CONFIG.colors.light.primary!
      : DEFAULT_MINIMAL_CONFIG.colors.light.primary!

  const activePrimary = config.colors.light.primary ?? defaultPrimary
  const presets = THEME_PRESETS[config.templateName]

  function setLightColor(key: keyof ThemeConfig["colors"]["light"], value: string) {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, light: { ...prev.colors.light, [key]: value } },
    }))
  }

  function handleSave() {
    startTransition(async () => {
      const matchingPreset = presets.find((p) => p.primary === activePrimary)
      const themeName = matchingPreset?.name ?? "Custom"
      const id = await saveTheme(config, themeName)
      setDraftId(id)
      toast.success("Accent color saved as draft")
    })
  }

  function handlePreview() {
    if (!draftId) {
      toast.error("Save changes first")
      return
    }
    startTransition(async () => {
      const path = await generatePreviewToken(draftId)
      window.open(path, "_blank")
    })
  }

  function handlePublish() {
    if (!draftId) {
      toast.error("Save changes first")
      return
    }
    startTransition(async () => {
      await publishTheme(draftId)
      toast.success("Theme published — live site updated")
      setDraftId(null)
    })
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Accent Color</h2>

        {/* Preset swatch row */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Presets</p>
          <div className="flex gap-4">
            {presets.map((preset) => {
              const isSelected = preset.primary === activePrimary
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setLightColor("primary", preset.primary)}
                  className="flex flex-col items-center gap-1.5"
                  aria-label={`Select ${preset.name} preset`}
                >
                  <span
                    className={cn(
                      "block w-8 h-8 rounded-full border-2 border-transparent transition-all",
                      isSelected && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="text-xs text-muted-foreground">{preset.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Single primary picker */}
        <div className="space-y-1.5">
          <Label htmlFor="primary-color">Custom</Label>
          <div className="flex items-center gap-3">
            <input
              id="primary-color"
              type="color"
              value={activePrimary}
              onChange={(e) => setLightColor("primary", e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-input"
            />
            <span className="text-xs text-muted-foreground font-mono">{activePrimary}</span>
            <button
              type="button"
              onClick={() => setLightColor("primary", defaultPrimary)}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={isPending}>
          Save Draft
        </Button>
        <Button
          variant="outline"
          onClick={handlePreview}
          disabled={isPending || !draftId}
        >
          Preview in New Tab
        </Button>
        <Button
          variant="secondary"
          onClick={handlePublish}
          disabled={isPending || !draftId}
        >
          Publish
        </Button>
      </div>
    </div>
  )
}
