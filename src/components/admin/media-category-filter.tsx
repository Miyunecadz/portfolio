"use client"

import { useRouter } from "next/navigation"

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "project", label: "Project" },
  { value: "profile", label: "Profile" },
  { value: "experience", label: "Experience" },
  { value: "education", label: "Education" },
  { value: "reference", label: "Reference" },
] as const

interface MediaCategoryFilterProps {
  activeCategory: string
}

export function MediaCategoryFilter({ activeCategory }: MediaCategoryFilterProps) {
  const router = useRouter()

  const handleSelect = (value: string) => {
    if (value === "all") {
      router.push("/admin/media")
    } else {
      router.push(`/admin/media?category=${value}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => handleSelect(cat.value)}
            className={[
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
