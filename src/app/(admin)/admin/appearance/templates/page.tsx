import { getActiveThemeConfig } from "@/lib/queries/appearance"
import { DEFAULT_MINIMAL_CONFIG, DEFAULT_DEVELOPER_CONFIG } from "@/lib/theme-utils"
import { TemplatesClient } from "./templates-client"

export default async function TemplatesPage() {
  const activeConfig = await getActiveThemeConfig()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a base template for your portfolio. Changes are saved as a draft until published.
        </p>
      </div>

      <TemplatesClient
        activeTemplateName={activeConfig.templateName}
        minimalConfig={DEFAULT_MINIMAL_CONFIG}
        developerConfig={DEFAULT_DEVELOPER_CONFIG}
      />
    </div>
  )
}
