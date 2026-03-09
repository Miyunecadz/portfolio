import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, Github, Linkedin, Facebook, Globe } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface HeroSectionProps {
  fullName: string
  tagline: string | null
  availabilityStatus: "open_to_work" | "open_to_freelance" | "not_available"
  resumeUrl: string | null
  avatarUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  facebookUrl: string | null
  blogUrl: string | null
}

export function HeroSection({
  fullName,
  tagline,
  availabilityStatus,
  resumeUrl,
  avatarUrl,
  githubUrl,
  linkedinUrl,
  facebookUrl,
  blogUrl,
}: HeroSectionProps) {
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("")

  const socialLinks = [
    githubUrl   && { href: githubUrl,   Icon: Github,   label: "GitHub" },
    linkedinUrl && { href: linkedinUrl, Icon: Linkedin,  label: "LinkedIn" },
    facebookUrl && { href: facebookUrl, Icon: Facebook,  label: "Facebook" },
    blogUrl     && { href: blogUrl,     Icon: Globe,     label: "Blog" },
  ].filter(Boolean) as { href: string; Icon: React.ElementType; label: string }[]
  return (
    <div className="hero-root min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative text-center gap-6 px-4 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/14 blur-[120px]" />
        <div className="absolute -bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Eyebrow label — styled per template via .hero-eyebrow class */}
        <span className="hero-eyebrow" aria-hidden>
          Portfolio
        </span>

        {/* Terminal prompt — decorative identity marker */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-primary/55 select-none" aria-hidden>
          <span className="text-primary/75">▸</span>
          <span>whoami</span>
          <span className="inline-block w-[6px] h-3.5 bg-primary/55 animate-pulse -mb-px" />
        </div>

        {/* Availability pill — more premium than a Badge */}
        {availabilityStatus !== "not_available" && (
          <div
            className={cn(
              "availability-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-background/70 backdrop-blur-sm text-sm font-medium",
              availabilityStatus === "open_to_work"
                ? "border-green-500/30 text-green-700 dark:text-green-400"
                : "border-amber-500/30 text-amber-700 dark:text-amber-400"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                availabilityStatus === "open_to_work"
                  ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.5)] animate-pulse"
                  : "bg-amber-500 shadow-[0_0_6px_2px_rgba(251,191,36,0.5)] animate-pulse"
              )}
            />
            {availabilityStatus === "open_to_work" ? "Open to Work" : "Open to Freelance"}
          </div>
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

      {/* Bottom center: identity bar + scroll indicator stacked */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        {/* Identity bar — desktop only */}
        {socialLinks.length > 0 && (
          <div
            data-testid="hero-profile-card"
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-border/30 backdrop-blur-md bg-background/60 shadow-sm"
          >
            <Avatar size="sm">
              <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>

            {socialLinks.length > 0 && (
              <>
                <span className="w-px h-4 bg-border/60 shrink-0" aria-hidden />
                <div className="flex items-center gap-2">
                  {socialLinks.map(({ href, Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Scroll indicator */}
        <a
          href="#projects"
          aria-label="Scroll to projects"
          className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium opacity-50 group-hover:opacity-100 transition-opacity">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </div>
  )
}
