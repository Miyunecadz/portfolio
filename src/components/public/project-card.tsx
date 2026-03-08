import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  slug: string
  shortDescription: string | null
  techStackTags: string[]
  thumbnail: string | null
  isFeatured: boolean
}

export function ProjectCard({
  title,
  slug,
  shortDescription,
  techStackTags,
  thumbnail,
  isFeatured,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full">
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
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No preview
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
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                  {tag}
                </Badge>
              ))}
              {techStackTags.length > 4 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
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
