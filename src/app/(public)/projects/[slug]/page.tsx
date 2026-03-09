import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublishedProjectBySlug, getPublishedProjects, getProjectScreenshotsPublic } from "@/lib/queries/public"
import { ProjectGalleryHero } from "./project-gallery-hero"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const screenshots = await getProjectScreenshotsPublic(project.id)

  const techTags = (project.techStackTags as string[]) ?? []

  return (
    <div className="min-h-screen bg-background">
      {/* Back link header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            &larr; Back
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero image — gallery when screenshots exist, thumbnail fallback when none */}
        {screenshots.length > 0 ? (
          <ProjectGalleryHero screenshots={screenshots} projectTitle={project.title} />
        ) : project.thumbnailUrl ? (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 bg-muted">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        ) : null}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {project.title}
        </h1>

        {/* Short description */}
        {project.shortDescription && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {project.shortDescription}
          </p>
        )}

        {/* Tech tags */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {techTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Live URL + Repo URL buttons */}
        {(project.liveUrl || project.repoUrl) && (
          <div className="flex flex-wrap gap-3 mb-10">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  View Live
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild variant="outline">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  View Repo
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Full description */}
        {project.fullDescription && (
          <div className="mb-12">
            <div
              className="prose prose-neutral max-w-none dark:prose-invert leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.fullDescription }}
            />
          </div>
        )}

        {/* Case study sections */}
        {project.problemStatement && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Problem Statement</h2>
            <div
              className="prose prose-neutral max-w-none dark:prose-invert text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.problemStatement }}
            />
          </div>
        )}

        {project.solutionApproach && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Solution Approach</h2>
            <div
              className="prose prose-neutral max-w-none dark:prose-invert text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.solutionApproach }}
            />
          </div>
        )}

        {project.outcomesAndImpact && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Outcomes &amp; Impact</h2>
            <div
              className="prose prose-neutral max-w-none dark:prose-invert text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.outcomesAndImpact }}
            />
          </div>
        )}

        {project.myRole && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-foreground">My Role</h2>
            <div
              className="prose prose-neutral max-w-none dark:prose-invert text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.myRole }}
            />
          </div>
        )}
      </main>
    </div>
  )
}
