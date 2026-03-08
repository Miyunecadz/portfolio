"use client"

import { useState } from "react"
import { TagFilter } from "@/components/public/tag-filter"
import { ProjectCard } from "@/components/public/project-card"

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

  return (
    <div className="flex flex-col gap-8">
      <TagFilter tags={tags} selectedTag={selectedTag} onTagChange={setSelectedTag} />

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No projects found{selectedTag ? ` for "${selectedTag}"` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              slug={project.slug}
              shortDescription={project.shortDescription}
              techStackTags={project.techStackTags ?? []}
              thumbnail={project.thumbnailUrl}
              isFeatured={project.isFeatured}
            />
          ))}
        </div>
      )}
    </div>
  )
}
