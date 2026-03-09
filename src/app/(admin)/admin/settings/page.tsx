import { getSiteSettingsAdmin } from "@/lib/queries/settings"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const settings = await getSiteSettingsAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Site configuration and integrations.
        </p>
      </div>
      <SettingsClient initialSettings={settings} />
    </div>
  )
}
