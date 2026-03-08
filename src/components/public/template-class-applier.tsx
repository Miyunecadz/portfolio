"use client"

import { useEffect } from "react"

interface TemplateClassApplierProps {
  templateName: string
  fontClassNames: string
}

export function TemplateClassApplier({ templateName, fontClassNames }: TemplateClassApplierProps) {
  useEffect(() => {
    // Apply font variable classNames to html element so CSS vars cascade
    // into body-scoped .minimal / .developer rules
    const fontClasses = fontClassNames.split(" ").filter(Boolean)
    fontClasses.forEach((cls) => document.documentElement.classList.add(cls))

    // Toggle template body classes
    document.body.classList.toggle("developer", templateName === "developer")
    document.body.classList.toggle("minimal", templateName === "minimal")

    return () => {
      document.body.classList.remove("developer")
      document.body.classList.remove("minimal")
      fontClasses.forEach((cls) => document.documentElement.classList.remove(cls))
    }
  }, [templateName, fontClassNames])

  return null
}
