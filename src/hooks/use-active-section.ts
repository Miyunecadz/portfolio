"use client"
import { useEffect, useRef, useState } from "react"

export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const ratioMap = useRef<Record<string, number>>({})

  useEffect(() => {
    if (sectionIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current[entry.target.id] = entry.intersectionRatio
        }

        let maxRatio = 0
        let maxId: string | null = null

        for (const [id, ratio] of Object.entries(ratioMap.current)) {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        }

        // Only update active ID if something is actually visible — don't reset to null mid-session
        if (maxRatio > 0 && maxId !== null) {
          setActiveId(maxId)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: "-64px 0px -20% 0px",
      }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
