"use client"

import { cn } from "@/lib/utils"

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
}

export function TagFilter({ tags, selectedTag, onTagChange }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagChange(null)}
        className={cn(
          "px-3 py-1.5 text-sm rounded-full border transition-colors",
          selectedTag === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === selectedTag ? null : tag)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full border transition-colors",
            selectedTag === tag
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
