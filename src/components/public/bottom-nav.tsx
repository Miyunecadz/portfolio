"use client"

import { FolderCode, Briefcase, Wrench, Mail } from "lucide-react"

const NAV_ITEMS = [
  { href: "#projects", label: "Projects", icon: FolderCode, sectionId: "projects" },
  { href: "#experience", label: "Experience", icon: Briefcase, sectionId: "experience" },
  { href: "#skills", label: "Skills", icon: Wrench, sectionId: "skills" },
  { href: "#contact", label: "Contact", icon: Mail, sectionId: "contact" },
]

interface BottomNavProps {
  activeSection: string | null
}

export function BottomNav({ activeSection }: BottomNavProps) {
  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/50 bg-background"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon, sectionId }) => {
          const isActive = sectionId === activeSection
          return (
            <a
              key={sectionId}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
