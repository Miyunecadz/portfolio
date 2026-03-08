import { Badge } from "@/components/ui/badge"
import { AnimateIn } from "@/components/public/animate-in"

interface Skill {
  id: string
  name: string
  proficiency: string
  iconUrl: string | null
  sortOrder: number | null
  categoryId: string | null
  categoryName: string | null
}

interface SkillsSectionProps {
  skillsByCategory: Record<string, Skill[]>
}

const PROFICIENCY_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  beginner: "outline",
  intermediate: "secondary",
  advanced: "default",
  expert: "default",
}

const PROFICIENCY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
}

export function SkillsSection({ skillsByCategory }: SkillsSectionProps) {
  const categories = Object.entries(skillsByCategory)

  if (categories.length === 0) {
    return <p className="text-muted-foreground">No skills listed yet.</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.map(([category, skills], index) => (
        <AnimateIn key={category} delay={index > 0 && index < 4 ? `delay-${index * 100}` : undefined}>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card"
                >
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <Badge
                    variant={PROFICIENCY_VARIANTS[skill.proficiency] ?? "secondary"}
                    className="text-xs px-1.5 py-0"
                  >
                    {PROFICIENCY_LABELS[skill.proficiency] ?? skill.proficiency}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      ))}
    </div>
  )
}
