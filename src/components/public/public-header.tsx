"use client"

import { DarkModeToggle } from "@/components/public/dark-mode-toggle"
import { MobileNav } from "@/components/public/mobile-nav"

const NAV_LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
]

interface PublicHeaderProps {
  siteName: string
}

export function PublicHeader({ siteName }: PublicHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Site name / logo */}
        <a href="#" className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
          {siteName}
        </a>

        {/* Desktop nav */}
        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1 mr-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Dark mode toggle — always visible */}
          <DarkModeToggle />

          {/* Mobile hamburger — shown below md */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
