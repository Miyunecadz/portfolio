"use client"

import { cn } from "@/lib/utils"
import { DarkModeToggle } from "@/components/public/dark-mode-toggle"
import { useActiveSection } from "@/hooks/use-active-section"
import { BottomNav } from "@/components/public/bottom-nav"
import { BackToTop } from "@/components/public/back-to-top"

const NAV_LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
]

const SECTION_IDS = ["projects", "experience", "skills", "contact"]

interface PublicHeaderProps {
  siteName: string
  topOffset?: string
}

export function PublicHeader({ siteName, topOffset = "top-0" }: PublicHeaderProps) {
  const activeSection = useActiveSection(SECTION_IDS)

  return (
    <>
      <header className={`fixed ${topOffset} left-0 right-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-md`}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Site name / logo */}
          <a
            href="#"
            className="font-semibold text-base text-foreground hover:text-primary transition-colors tracking-tight"
          >
            {siteName}
          </a>

          {/* Desktop nav */}
          <div className="flex items-center gap-1">
            <nav className="hidden md:flex items-center gap-0.5 mr-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1)
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent/60 relative group",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-1.5 h-px bg-primary transition-transform origin-left",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                )
              })}
            </nav>

            {/* Dark mode toggle — always visible */}
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <BottomNav activeSection={activeSection} />
      <BackToTop />
    </>
  )
}
