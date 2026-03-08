"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-9 h-9" aria-label="Toggle dark mode" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </Button>
  )
}
