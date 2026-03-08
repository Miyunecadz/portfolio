"use client"

import { useEffect, useRef } from "react"

interface CursorGlowProps {
  templateName: string
}

export function CursorGlow({ templateName }: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (templateName !== "developer") return

    const el = glowRef.current
    if (!el) return

    const handler = (e: MouseEvent) => {
      el.style.setProperty("--glow-x", `${e.clientX}px`)
      el.style.setProperty("--glow-y", `${e.clientY}px`)
    }

    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [templateName])

  if (templateName !== "developer") return null

  return <div ref={glowRef} className="cursor-glow" aria-hidden />
}
