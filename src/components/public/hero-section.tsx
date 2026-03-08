import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface HeroSectionProps {
  fullName: string
  tagline: string | null
  availabilityStatus: "open_to_work" | "open_to_freelance" | "not_available"
  resumeUrl: string | null
}

export function HeroSection({
  fullName,
  tagline,
  availabilityStatus,
  resumeUrl,
}: HeroSectionProps) {
  return (
    <div className="hero-root min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative text-center gap-6 px-4">
      {/* Decorative gradient tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent dark:from-primary/5 dark:via-primary/2 dark:to-transparent"
      />

      {/* Content above gradient */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Eyebrow label — visible in Minimal template via CSS, hidden otherwise */}
        <span className="hero-eyebrow" aria-hidden>
          {tagline ? "Portfolio" : "Available for work"}
        </span>

        {/* Availability badge — only shown when actively open */}
        {availabilityStatus === "open_to_work" && (
          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            Open to Work
          </Badge>
        )}
        {availabilityStatus === "open_to_freelance" && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
            Open to Freelance
          </Badge>
        )}

        {/* Name heading */}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-foreground">
          {fullName}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            {tagline}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button asChild size="lg">
            <a href="#projects">View My Work</a>
          </Button>
          {resumeUrl && (
            <Button asChild variant="outline" size="lg">
              <a href={resumeUrl} download>
                Download Resume
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Bouncing scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <ChevronDown className="w-6 h-6" />
      </div>
    </div>
  )
}
