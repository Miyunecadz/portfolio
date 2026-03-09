"use client"

import { useState } from "react"
import { TagFilter } from "@/components/public/tag-filter"
import { ProjectCard } from "@/components/public/project-card"
import { AnimateIn } from "@/components/public/animate-in"

interface Project {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  techStackTags: string[] | null
  thumbnailUrl: string | null
  isFeatured: boolean
}

interface ProjectsSectionProps {
  projects: Project[]
  tags: string[]
}

export function ProjectsSection({ projects, tags }: ProjectsSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filtered = selectedTag
    ? projects.filter((p) => (p.techStackTags ?? []).includes(selectedTag))
    : projects

  const featuredFirst = [
    ...filtered.filter((p) => p.isFeatured),
    ...filtered.filter((p) => !p.isFeatured),
  ]

  return (
    <div className="flex flex-col gap-8">
      <TagFilter tags={tags} selectedTag={selectedTag} onTagChange={setSelectedTag} />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No projects found{selectedTag ? ` for "${selectedTag}"` : ""}.
        </p>
      ) : (
        <div className="projects-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFirst.map((project, i) => (
            <AnimateIn
              key={project.id}
              delay={i > 0 && i < 4 ? `delay-${i * 75}` : undefined}
              className={project.isFeatured && i === 0 ? "md:col-span-2 lg:col-span-3" : undefined}
            >
              <ProjectCard
                title={project.title}
                slug={project.slug}
                shortDescription={project.shortDescription}
                techStackTags={project.techStackTags ?? []}
                thumbnail={project.thumbnailUrl}
                isFeatured={project.isFeatured}
                index={i}
              />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}
