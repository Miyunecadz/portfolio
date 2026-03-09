import { getSiteSettingsAdmin } from "@/lib/queries/settings"
import { getProfilePublic } from "@/lib/queries/public"

export default async function MaintenancePage() {
  const [settings, profile] = await Promise.all([
    getSiteSettingsAdmin(),
    getProfilePublic(),
  ])
  const message =
    settings?.maintenanceMessage ?? "We're down for maintenance, check back soon."
  const email = profile?.email ?? null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">{settings?.siteTitle ?? "Portfolio"}</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      {email && (
        <p className="text-sm">
          Need to get in touch?{" "}
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </p>
      )}
    </main>
  )
}
