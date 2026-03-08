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
}

export function ProjectCard({
  title,
  slug,
  shortDescription,
  techStackTags,
  thumbnail,
  isFeatured,
  className,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className={cn("group block", className)}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 h-full">
        {/* Thumbnail */}
        <div className="relative w-full h-48 bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
              <span className="text-3xl font-bold text-primary/40 select-none" aria-hidden>
                {title
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() ?? "")
                  .join("")}
              </span>
            </div>
          )}
          {isFeatured && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{title}</h3>
          {shortDescription && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{shortDescription}</p>
          )}
          {techStackTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {techStackTags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {techStackTags.length > 4 && (
                <Badge className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
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
