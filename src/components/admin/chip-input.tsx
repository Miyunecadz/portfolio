"use client"

import { useState, KeyboardEvent, useRef } from "react"
import { X } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ChipInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function ChipInput({ value, onChange, placeholder = "Add tag...", className }: ChipInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue("")
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 p-2 border rounded-md min-h-10 cursor-text",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(index) }}
            className="rounded hover:bg-destructive/20 transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <X size={12} />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addTag(inputValue) }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
