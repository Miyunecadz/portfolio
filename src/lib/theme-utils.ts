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
  const lines: string[] = []
  const { colors, fonts } = config
  if (colors?.light?.primary) lines.push(`--primary: ${colors.light.primary};`)
  if (colors?.light?.accent) lines.push(`--accent: ${colors.light.accent};`)
  if (colors?.light?.background) lines.push(`--background: ${colors.light.background};`)
  if (colors?.light?.foreground) lines.push(`--foreground: ${colors.light.foreground};`)
  if (fonts?.heading) lines.push(`--font-heading: var(--font-${fontNameToVar(fonts.heading)});`)
  if (fonts?.body) lines.push(`--font-body: var(--font-${fontNameToVar(fonts.body)});`)
  if (fonts?.mono) lines.push(`--font-mono: var(--font-${fontNameToVar(fonts.mono)});`)
  return lines.join("\n")
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
    light: { primary: "oklch(0.21 0.006 285.88)", accent: "oklch(0.97 0 0)", background: "oklch(1 0 0)", foreground: "oklch(0.141 0.005 285.82)" },
    dark: { primary: "oklch(0.928 0.006 264.53)", accent: "oklch(0.274 0.006 264.53)", background: "oklch(0.141 0.005 285.82)", foreground: "oklch(0.985 0 0)" },
  },
  fonts: { heading: "Inter", body: "Inter", mono: "JetBrains Mono" },
}

export const DEFAULT_DEVELOPER_CONFIG: ThemeConfig = {
  templateName: "developer",
  colors: {
    light: { primary: "oklch(0.55 0.2 250)", accent: "oklch(0.95 0.05 250)", background: "oklch(0.98 0 0)", foreground: "oklch(0.15 0.01 250)" },
    dark: { primary: "oklch(0.7 0.18 250)", accent: "oklch(0.2 0.05 250)", background: "oklch(0.1 0.01 250)", foreground: "oklch(0.95 0 0)" },
  },
  fonts: { heading: "Space Grotesk", body: "Inter", mono: "JetBrains Mono" },
}
