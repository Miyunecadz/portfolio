import Image from "next/image"

interface Education {
  id: string
  schoolName: string
  schoolLogoUrl: string | null
  degreeType: string
  fieldOfStudy: string | null
  startYear: number
  endYear: number | null
}

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return <p className="text-muted-foreground">No education entries yet.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {education.map((edu) => (
        <div key={edu.id} className="flex items-start gap-4">
          {edu.schoolLogoUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-background shrink-0">
              <Image
                src={edu.schoolLogoUrl}
                alt={edu.schoolName}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground">{edu.schoolName}</h3>
            <p className="text-muted-foreground text-sm">
              {edu.degreeType}
              {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {edu.startYear} &ndash; {edu.endYear ?? "Present"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
