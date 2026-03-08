export type ThemeConfig = {
  templateName: "minimal" | "developer"
  colors: {
    light: { primary?: string; accent?: string; background?: string; foreground?: string }
    dark: { primary?: string; accent?: string; background?: string; foreground?: string }
  }
  fonts: {
    heading?: string  // e.g. "Inter", "Space Grotesk"
    body?: string
    mono?: string     // e.g. "JetBrains Mono"
  }
}

// Maps a font name like "Space Grotesk" to "--font-space-grotesk"
function fontNameToVar(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-")
}

export function themeConfigToCssVars(config: Partial<ThemeConfig>): string {
  const { colors, fonts } = config
  const rootLines: string[] = []
  const darkLines: string[] = []

  if (colors?.light?.primary) rootLines.push(`  --primary: ${colors.light.primary};`)
  if (colors?.light?.accent) rootLines.push(`  --accent: ${colors.light.accent};`)
  if (colors?.light?.background) rootLines.push(`  --background: ${colors.light.background};`)
  if (colors?.light?.foreground) rootLines.push(`  --foreground: ${colors.light.foreground};`)

  if (colors?.dark?.primary) darkLines.push(`  --primary: ${colors.dark.primary};`)
  if (colors?.dark?.accent) darkLines.push(`  --accent: ${colors.dark.accent};`)
  if (colors?.dark?.background) darkLines.push(`  --background: ${colors.dark.background};`)
  if (colors?.dark?.foreground) darkLines.push(`  --foreground: ${colors.dark.foreground};`)

  if (fonts?.heading) rootLines.push(`  --font-heading: var(--font-${fontNameToVar(fonts.heading)});`)
  if (fonts?.body) rootLines.push(`  --font-body: var(--font-${fontNameToVar(fonts.body)});`)
  if (fonts?.mono) rootLines.push(`  --font-mono: var(--font-${fontNameToVar(fonts.mono)});`)

  const parts: string[] = []
  if (rootLines.length) parts.push(`:root {\n${rootLines.join("\n")}\n}`)
  if (darkLines.length) parts.push(`.dark {\n${darkLines.join("\n")}\n}`)
  return parts.join("\n")
}

export const DEFAULT_SECTION_ORDERING = [
  { key: "hero",       label: "Hero",       isVisible: true, sortOrder: 0 },
  { key: "projects",   label: "Projects",   isVisible: true, sortOrder: 1 },
  { key: "experience", label: "Experience", isVisible: true, sortOrder: 2 },
  { key: "skills",     label: "Skills",     isVisible: true, sortOrder: 3 },
  { key: "references", label: "References", isVisible: true, sortOrder: 4 },
  { key: "education",  label: "Education",  isVisible: true, sortOrder: 5 },
  { key: "contact",    label: "Contact",    isVisible: true, sortOrder: 6 },
]

export const DEFAULT_MINIMAL_CONFIG: ThemeConfig = {
  templateName: "minimal",
  colors: {
    light: {
      primary: "#c85a1e",       // rust/burnt orange — locked decision
      accent: "#f0ece4",
      background: "#f8f6f2",    // warm off-white — locked decision
      foreground: "#1a1a2e",
    },
    dark: {
      primary: "#e07040",       // lighter rust for dark mode
      accent: "#2a2520",
      background: "#1a1814",
      foreground: "#f0ece4",
    },
  },
  fonts: { heading: "DM Serif Display", body: "DM Sans", mono: "DM Mono" },
}

export const DEFAULT_DEVELOPER_CONFIG: ThemeConfig = {
  templateName: "developer",
  colors: {
    light: {
      primary: "#00e5ff",       // cyan — locked decision
      accent: "oklch(0.2 0.05 250)",
      background: "#080a0f",    // dark — locked decision
      foreground: "oklch(0.95 0 0)",
    },
    dark: {
      primary: "#00e5ff",       // same cyan in dark mode
      accent: "oklch(0.2 0.05 250)",
      background: "#080a0f",
      foreground: "oklch(0.95 0 0)",
    },
  },
  fonts: { heading: "Syne", body: "JetBrains Mono", mono: "JetBrains Mono" },
}
