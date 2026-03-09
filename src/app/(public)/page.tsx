import { cn } from "@/lib/utils"
import {
  getPublishedProjects,
  getPublishedProjectTags,
  getPublishedExperiences,
  getVisibleSkillsByCategory,
  getVisibleReferences,
  getVisibleEducation,
  getProfilePublic,
  getSiteSettingsPublic,
} from "@/lib/queries/public"
import { PublicHeader } from "@/components/public/public-header"
import { HeroSection } from "@/components/public/hero-section"
import { ProjectsSection } from "@/components/public/projects-section"
import { ExperienceSection } from "@/components/public/experience-section"
import { SkillsSection } from "@/components/public/skills-section"
import { ReferencesSection } from "@/components/public/references-section"
import { EducationSection } from "@/components/public/education-section"
import { ContactSection } from "@/components/public/contact-section"

const SECTION_HEADINGS: Record<string, string> = {
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  references: "References",
  education: "Education",
  contact: "Get in Touch",
}

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Hero", isVisible: true, sortOrder: 0 },
  { key: "projects", label: "Projects", isVisible: true, sortOrder: 1 },
  { key: "experience", label: "Experience", isVisible: true, sortOrder: 2 },
  { key: "skills", label: "Skills", isVisible: true, sortOrder: 3 },
  { key: "references", label: "References", isVisible: true, sortOrder: 4 },
  { key: "education", label: "Education", isVisible: true, sortOrder: 5 },
  { key: "contact", label: "Contact", isVisible: true, sortOrder: 6 },
]

export default async function PublicHomePage() {
  const [
    projects,
    tags,
    experiences,
    skillsByCategory,
    references,
    education,
    profile,
    settings,
  ] = await Promise.all([
    getPublishedProjects(),
    getPublishedProjectTags(),
    getPublishedExperiences(),
    getVisibleSkillsByCategory(),
    getVisibleReferences(),
    getVisibleEducation(),
    getProfilePublic(),
    getSiteSettingsPublic(),
  ])

  const siteName = profile?.fullName ?? "Portfolio"
  const visibleSections = DEFAULT_SECTIONS.filter((s) => s.isVisible)

  function renderSection(sectionKey: string) {
    switch (sectionKey) {
      case "hero":
        return (
          <HeroSection
            fullName={profile?.fullName ?? "Portfolio"}
            tagline={profile?.tagline ?? null}
            availabilityStatus={
              (profile?.availabilityStatus as "open_to_work" | "open_to_freelance" | "not_available") ??
              "not_available"
            }
            resumeUrl={profile?.resumeUrl ?? null}
            avatarUrl={profile?.avatarUrl ?? null}
            githubUrl={profile?.githubUrl ?? null}
            linkedinUrl={profile?.linkedinUrl ?? null}
            facebookUrl={profile?.facebookUrl ?? null}
            blogUrl={profile?.blogUrl ?? null}
          />
        )
      case "projects":
        return <ProjectsSection projects={projects} tags={tags} />
      case "experience":
        return <ExperienceSection experiences={experiences} />
      case "skills":
        return <SkillsSection skillsByCategory={skillsByCategory} />
      case "references":
        return <ReferencesSection references={references} />
      case "education":
        return <EducationSection education={education} />
      case "contact":
        return (
          <ContactSection
            contactFormEnabled={settings.contactFormEnabled}
            calendlyEnabled={settings.calendlyEnabled}
            calendlyUrl={settings.calendlyUrl}
          />
        )
      default:
        return null
    }
  }

  let sectionHeadingIndex = 0

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader siteName={siteName} />

      {/* Main content offset for sticky header */}
      <main className="pt-16 pb-20 md:pb-0">
        {visibleSections.map((section) => {
          const content = renderSection(section.key)
          if (!content) return null

          if (section.key !== "hero") sectionHeadingIndex++
          const labelNumber = String(sectionHeadingIndex).padStart(2, "0")

          return (
            <section
              key={section.key}
              id={section.key}
              className={cn(
                section.key !== "hero" ? "py-20 md:py-28 border-t border-border/50" : "",
                section.key === "contact" ? "contact-section bg-muted/30" : ""
              )}
            >
              <div className="max-w-5xl mx-auto px-4">
                {section.key !== "hero" && (
                  <div className="mb-12">
                    <span className="section-label">
                      {labelNumber} / {SECTION_HEADINGS[section.key] ?? section.label}
                    </span>
                    <h2 className="section-heading text-3xl font-bold tracking-tight mt-1">
                      {SECTION_HEADINGS[section.key] ?? section.label}
                    </h2>
                    <div className="w-12 h-1 bg-primary mt-3 section-accent-bar" aria-hidden />
                    {section.key === "contact" && (
                      <p className="text-muted-foreground mt-3 text-base">
                        Have a project in mind or want to chat? I&apos;d love to hear from you.
                      </p>
                    )}
                  </div>
                )}
                {content}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
