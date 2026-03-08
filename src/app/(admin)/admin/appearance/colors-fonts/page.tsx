import { getActiveThemeConfig } from "@/lib/queries/appearance"
import { ColorsFontsClient } from "./colors-fonts-client"

export default async function ColorsFontsPage() {
  const activeConfig = await getActiveThemeConfig()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Colors &amp; Fonts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the accent color for your portfolio. Changes are saved as a draft until published.
        </p>
      </div>

      <ColorsFontsClient initialConfig={activeConfig} />
    </div>
  )
}
