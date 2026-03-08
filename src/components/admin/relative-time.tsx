"use client"
import { useState, useEffect } from "react"

interface RelativeTimeProps {
  date: Date | string
}

function computeRelativeLabel(date: Date | string): string {
  const d = new Date(date)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const [label, setLabel] = useState<string>("")

  useEffect(() => {
    setLabel(computeRelativeLabel(date))
  }, [date])

  // Returns empty string during SSR — renders only after hydration (avoids mismatch)
  return (
    <time dateTime={new Date(date).toISOString()} className="text-xs text-muted-foreground">
      {label}
    </time>
  )
}
