"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

interface TemplateThemeInitializerProps {
  defaultDark: boolean
}

export function TemplateThemeInitializer({ defaultDark }: TemplateThemeInitializerProps) {
  const { setTheme } = useTheme()
  useEffect(() => {
    // Only set if user has no stored preference
    if (!localStorage.getItem("portfolio-theme") && defaultDark) {
      setTheme("dark")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
