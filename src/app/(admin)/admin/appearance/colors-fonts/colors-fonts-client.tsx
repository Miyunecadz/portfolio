"use client"

import { useState, useTransition } from "react"
import { saveTheme, generatePreviewToken, publishTheme } from "@/lib/actions/appearance"
import { type ThemeConfig } from "@/lib/theme-utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const FONT_OPTIONS = ["Inter", "Space Grotesk", "Geist"]

interface ColorsFontsClientProps {
  initialConfig: ThemeConfig
}

export function ColorsFontsClient({ initialConfig }: ColorsFontsClientProps) {
  const [config, setConfig] = useState<ThemeConfig>(initialConfig)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function setLightColor(key: keyof ThemeConfig["colors"]["light"], value: string) {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, light: { ...prev.colors.light, [key]: value } },
    }))
  }

  function setDarkColor(key: keyof ThemeConfig["colors"]["dark"], value: string) {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, dark: { ...prev.colors.dark, [key]: value } },
    }))
  }

  function setFont(key: keyof ThemeConfig["fonts"], value: string) {
    setConfig((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [key]: value },
    }))
  }

  function handleSave() {
    startTransition(async () => {
      const id = await saveTheme(config, config.templateName)
      setDraftId(id)
      toast.success("Colors & fonts saved as draft")
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
      {/* Light Mode Colors */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Light Mode Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          {(["primary", "accent", "background", "foreground"] as const).map((key) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`light-${key}`} className="capitalize">
                {key}
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id={`light-${key}`}
                  type="color"
                  value={config.colors.light[key] ?? "#000000"}
                  onChange={(e) => setLightColor(key, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {config.colors.light[key] ?? "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dark Mode Colors */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Dark Mode Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          {(["primary", "accent", "background", "foreground"] as const).map((key) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`dark-${key}`} className="capitalize">
                {key}
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id={`dark-${key}`}
                  type="color"
                  value={config.colors.dark[key] ?? "#000000"}
                  onChange={(e) => setDarkColor(key, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-input"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {config.colors.dark[key] ?? "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Typography</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Heading Font</Label>
            <Select
              value={config.fonts.heading ?? "Inter"}
              onValueChange={(val) => setFont("heading", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Body Font</Label>
            <Select
              value={config.fonts.body ?? "Inter"}
              onValueChange={(val) => setFont("body", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

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
