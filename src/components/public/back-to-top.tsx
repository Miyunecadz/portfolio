"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > window.innerHeight)
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <button
      className={`back-to-top fixed right-4 md:right-6 z-40 bottom-[calc(3.5rem+1.5rem)] md:bottom-6 h-10 w-10 rounded-full border border-border/50 bg-background shadow-sm transition-all duration-300 flex items-center justify-center ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
      }`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  )
}
