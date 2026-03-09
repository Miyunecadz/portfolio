"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { updateMaintenanceMode, updateCalendlySettings } from "@/lib/actions/settings"

interface SettingsClientProps {
  initialSettings: {
    maintenanceMode: boolean
    maintenanceMessage: string | null
    calendlyEnabled: boolean
    calendlyUrl: string | null
  } | null
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(
    initialSettings?.maintenanceMode ?? false
  )
  const [calendlyEnabled, setCalendlyEnabled] = useState(
    initialSettings?.calendlyEnabled ?? false
  )
  const [calendlyUrl, setCalendlyUrl] = useState(
    initialSettings?.calendlyUrl ?? ""
  )
  const [calendlySaving, setCalendlySaving] = useState(false)
  const [maintenanceSaving, setMaintenanceSaving] = useState(false)

  async function handleMaintenanceToggle(checked: boolean) {
    setMaintenanceSaving(true)
    setMaintenanceMode(checked)
    const result = await updateMaintenanceMode(checked)
    setMaintenanceSaving(false)
    if (result.success) {
      toast.success(
        checked
          ? "Maintenance mode enabled — public site is now offline."
          : "Maintenance mode disabled — public site is live."
      )
    } else {
      // Revert on failure
      setMaintenanceMode(!checked)
      toast.error(result.error)
    }
  }

  async function handleCalendlySave() {
    setCalendlySaving(true)
    const result = await updateCalendlySettings({
      calendlyEnabled,
      calendlyUrl: calendlyUrl || null,
    })
    setCalendlySaving(false)
    if (result.success) {
      toast.success("Booking widget settings saved.")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            When enabled, all public pages redirect to /maintenance. The admin
            panel, login, and API routes remain accessible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
              disabled={maintenanceSaving}
              aria-label="Maintenance mode"
            />
            <Label htmlFor="maintenance-mode" className="text-sm">
              {maintenanceMode ? "Site is offline (maintenance)" : "Site is live"}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Booking Widget */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Widget</CardTitle>
          <CardDescription>
            Embed a Calendly booking widget on the public contact section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              id="calendly-enabled"
              checked={calendlyEnabled}
              onCheckedChange={setCalendlyEnabled}
              aria-label="Calendly widget enabled"
            />
            <Label htmlFor="calendly-enabled" className="text-sm">
              {calendlyEnabled ? "Booking widget enabled" : "Booking widget disabled"}
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="calendly-url">Calendly URL</Label>
            <Input
              id="calendly-url"
              type="url"
              placeholder="https://calendly.com/your-link"
              value={calendlyUrl}
              onChange={(e) => setCalendlyUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleCalendlySave} disabled={calendlySaving}>
            {calendlySaving ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
