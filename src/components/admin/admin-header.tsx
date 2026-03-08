"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

function formatSegment(segment: string): string {
  if (segment === "admin" || segment === "") return "Dashboard"
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 1 && segments[0] === "admin") return "Dashboard"
  const last = segments[segments.length - 1]
  return formatSegment(last)
}

export function AdminHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-6">
      <h1 className="text-sm font-semibold">{title}</h1>
      <Button variant="outline" size="sm" asChild>
        <a href="/" target="_blank" rel="noopener noreferrer">
          View Public Site
        </a>
      </Button>
    </header>
  )
}
