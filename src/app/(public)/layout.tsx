import {
  DM_Serif_Display,
  DM_Sans,
  DM_Mono,
  Syne,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google"
import { getActiveThemeConfig } from "@/lib/queries/appearance"
import { themeConfigToCssVars } from "@/lib/theme-utils"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/public/theme-provider"
import { TemplateClassApplier } from "@/components/public/template-class-applier"
import { TemplateThemeInitializer } from "@/components/public/template-theme-initializer"
import { CursorGlow } from "@/components/public/cursor-glow"
import "@/components/public/developer-template.css"
import "@/components/public/minimal-template.css"

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  display: "swap",
})
const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})
const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
})
const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
})
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
})
const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeConfig = await getActiveThemeConfig()
  const cssVars = themeConfigToCssVars(themeConfig)

  const fontClassNames = cn(
    dmSerifDisplay.variable,
    dmSans.variable,
    dmMono.variable,
    syne.variable,
    instrumentSerif.variable,
    jetbrainsMono.variable
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div className={fontClassNames}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="portfolio-theme"
        >
          <TemplateClassApplier
            templateName={themeConfig.templateName}
            fontClassNames={fontClassNames}
          />
          <TemplateThemeInitializer defaultDark={themeConfig.templateName === "developer"} />
          <CursorGlow templateName={themeConfig.templateName} />
          {children}
        </ThemeProvider>
      </div>
    </>
  )
}
