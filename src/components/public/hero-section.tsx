import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    <div className="flex flex-col items-start gap-6">
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
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
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
  )
}
