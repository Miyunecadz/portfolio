"use client"

import { useEffect } from "react"

interface TemplateClassApplierProps {
  templateName: string
}

export function TemplateClassApplier({ templateName }: TemplateClassApplierProps) {
  useEffect(() => {
    document.body.classList.toggle("developer", templateName === "developer")
    return () => document.body.classList.remove("developer")
  }, [templateName])
  return null
}
