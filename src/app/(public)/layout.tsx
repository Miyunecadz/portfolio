import { redirect } from "next/navigation"
import { ThemeProvider } from "@/components/public/theme-provider"
import { getSiteSettingsAdmin } from "@/lib/queries/settings"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettingsAdmin()
  if (settings?.maintenanceMode) {
    redirect("/maintenance")
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="portfolio-theme"
    >
      <div className="public-layout min-h-screen bg-background">{children}</div>
    </ThemeProvider>
  )
}
