import { getActiveThemeConfig } from "@/lib/queries/appearance"
import { themeConfigToCssVars } from "@/lib/theme-utils"
import { ThemeProvider } from "@/components/public/theme-provider"
import { TemplateClassApplier } from "@/components/public/template-class-applier"
import { TemplateThemeInitializer } from "@/components/public/template-theme-initializer"
import "@/components/public/developer-template.css"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeConfig = await getActiveThemeConfig()
  const cssVars = themeConfigToCssVars(themeConfig)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="portfolio-theme"
      >
        <TemplateClassApplier templateName={themeConfig.templateName} />
        <TemplateThemeInitializer defaultDark={themeConfig.templateName === "developer"} />
        {children}
      </ThemeProvider>
    </>
  )
}
