import { redirect } from "next/navigation"
import { getDraftThemeByToken } from "@/lib/queries/appearance"
import { getSectionOrdering } from "@/lib/queries/appearance"
import { themeConfigToCssVars } from "@/lib/theme-utils"
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

interface PreviewPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { token } = await searchParams

  if (!token) redirect("/")

  const draftConfig = await getDraftThemeByToken(token)
  if (!draftConfig) redirect("/")

  const cssVars = themeConfigToCssVars(draftConfig)

  const [
    sectionOrdering,
    projects,
    tags,
    experiences,
    skillsByCategory,
    references,
    education,
    profile,
    settings,
  ] = await Promise.all([
    getSectionOrdering(),
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
  const visibleSections = [...sectionOrdering]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Inject draft theme CSS vars — overrides the active theme */}
      <style dangerouslySetInnerHTML={{ __html: `:root { ${cssVars} }` }} />

      {/* Preview mode banner — fixed, ~36px tall (py-1.5 + text-sm line-height) */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 text-sm font-medium text-center py-1.5 px-4">
        Preview Mode — this theme is not live. Close this tab to exit preview.
      </div>

      {/* Header offset by banner height (top-9 = 36px) */}
      <PublicHeader siteName={siteName} topOffset="top-9" />

      {/* main offset: 36px banner + 64px header = 100px */}
      <main className="pt-[100px]">
          {visibleSections.map((section) => {
            const content = renderSection(section.key)
            if (!content) return null

            return (
              <section
                key={section.key}
                id={section.key}
                className="py-20 md:py-28"
              >
                <div className="max-w-5xl mx-auto px-4">
                  {section.key !== "hero" && (
                    <h2 className="text-3xl font-bold tracking-tight mb-10">
                      {SECTION_HEADINGS[section.key] ?? section.label}
                    </h2>
                  )}
                  {content}
                </div>
              </section>
            )
          })}
        </main>
      </div>
    </div>
  )
}
