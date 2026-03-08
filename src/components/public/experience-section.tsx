import { Badge } from "@/components/ui/badge"
import { AnimateIn } from "@/components/public/animate-in"

interface Experience {
  id: string
  companyName: string
  companyLogoUrl: string | null
  jobTitle: string
  employmentType: string
  startDate: Date
  endDate: Date | null
  isCurrentRole: boolean
  description: string | null
  techStackTags: string[] | null
}

interface ExperienceSectionProps {
  experiences: Experience[]
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function formatDuration(start: Date, end: Date | null, isCurrent: boolean): string {
  const endDate = isCurrent ? new Date() : (end ?? new Date())
  const months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth())
  if (months < 12) return `${months}mo`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) {
    return <p className="text-muted-foreground">No experience entries yet.</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {experiences.map((exp, index) => (
        <AnimateIn key={exp.id} delay={index > 0 && index < 4 ? `delay-${index * 100}` : undefined}>
        <div className="experience-entry relative pl-6 border-l-2 border-border">
          {/* Timeline dot */}
          <div className="experience-dot absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary" />

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg leading-tight">
                  {exp.jobTitle}
                </h3>
                <p className="company-name text-muted-foreground font-medium">{exp.companyName}</p>
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {exp.employmentType}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>
                {formatDate(exp.startDate)} &ndash;{" "}
                {exp.isCurrentRole ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
              </span>
              <span aria-hidden className="opacity-40">·</span>
              <span className="tabular-nums">{formatDuration(exp.startDate, exp.endDate, exp.isCurrentRole)}</span>
            </p>

            {exp.description && (
              <div
                className="text-sm text-foreground/80 prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: exp.description }}
              />
            )}

            {exp.techStackTags && exp.techStackTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {exp.techStackTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        </AnimateIn>
      ))}
    </div>
  )
}
