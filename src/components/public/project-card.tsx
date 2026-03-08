import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  slug: string
  shortDescription: string | null
  techStackTags: string[]
  thumbnail: string | null
  isFeatured: boolean
  className?: string
  index?: number
}

export function ProjectCard({
  title,
  slug,
  shortDescription,
  techStackTags,
  thumbnail,
  isFeatured,
  className,
  index,
}: ProjectCardProps) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <Link href={`/projects/${slug}`} className={cn("group block", className)}>
      <Card
        className="project-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
        data-index={index !== undefined ? String(index + 1).padStart(2, "0") : undefined}
      >
        {/* Thumbnail */}
        <div className="project-thumbnail relative w-full aspect-video bg-muted overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="project-thumbnail-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/8 to-accent/20">
              <span className="text-4xl font-bold text-primary/30 select-none tracking-tight" aria-hidden>
                {initials}
              </span>
            </div>
          )}
          {isFeatured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="project-title font-semibold text-lg text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {shortDescription && (
            <p className="project-description text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {shortDescription}
            </p>
          )}
          {techStackTags.length > 0 && (
            <div className="project-tags flex flex-wrap gap-1.5">
              {techStackTags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  className="tech-tag text-xs px-2.5 py-0.5 bg-primary/8 text-primary border border-primary/15 font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {techStackTags.length > 4 && (
                <Badge className="tech-tag text-xs px-2.5 py-0.5 bg-muted text-muted-foreground border border-border font-medium">
                  +{techStackTags.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
