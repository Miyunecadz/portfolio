import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Reference {
  id: string
  name: string
  jobTitle: string | null
  company: string | null
  quote: string
  photoUrl: string | null
  linkedinUrl: string | null
}

interface ReferencesSectionProps {
  references: Reference[]
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  if (references.length === 0) {
    return <p className="text-muted-foreground">No references yet.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {references.map((ref) => (
        <Card key={ref.id} className="reference-card h-full">
          <CardContent className="p-6 flex flex-col gap-4">
            {/* Quote */}
            <blockquote className="text-foreground/80 italic leading-relaxed">
              &ldquo;{ref.quote}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center gap-3 mt-auto">
              {ref.photoUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={ref.photoUrl}
                    alt={ref.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {ref.linkedinUrl ? (
                    <a
                      href={ref.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {ref.name}
                    </a>
                  ) : (
                    ref.name
                  )}
                </p>
                {(ref.jobTitle || ref.company) && (
                  <p className="text-xs text-muted-foreground">
                    {[ref.jobTitle, ref.company].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
