"use client"
import { useState, useEffect } from "react"

interface RelativeTimeProps {
  date: Date | string
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const [label, setLabel] = useState<string>("")

  useEffect(() => {
    const d = new Date(date)
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
    if (seconds < 60) {
      setLabel("just now")
    } else if (seconds < 3600) {
      setLabel(`${Math.floor(seconds / 60)}m ago`)
    } else if (seconds < 86400) {
      setLabel(`${Math.floor(seconds / 3600)}h ago`)
    } else {
      setLabel(`${Math.floor(seconds / 86400)}d ago`)
    }
  }, [date])

  // Returns empty string during SSR — renders only after hydration (avoids mismatch)
  return (
    <time dateTime={new Date(date).toISOString()} className="text-xs text-muted-foreground">
      {label}
    </time>
  )
}
