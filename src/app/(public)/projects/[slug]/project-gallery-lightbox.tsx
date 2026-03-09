"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Screenshot {
  id: string
  publicUrl: string
  caption: string | null
  sortOrder?: number
}

interface Props {
  screenshots: Screenshot[]
  initialIndex: number
  open: boolean
  onClose: (open: boolean) => void
}

export default function ProjectGalleryLightbox({
  screenshots,
  initialIndex,
  open,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex)

  // Sync internal index when initialIndex or open changes
  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex, open])

  // ArrowLeft/ArrowRight keyboard nav — Radix Dialog handles Escape, do NOT add it here
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % screenshots.length)
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, screenshots.length])

  const current = screenshots[index]

  return (
    <div data-testid="gallery-lightbox">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95">
          <div className="relative">
            {/* Counter */}
            <span className="absolute top-3 right-4 text-white/80 text-sm font-medium z-10">
              {index + 1} / {screenshots.length}
            </span>

            {/* Main image */}
            <div className="relative w-full h-[60vh]">
              <Image
                src={current.publicUrl}
                alt={current.caption ?? ""}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>

            {/* Prev button */}
            {screenshots.length > 1 && (
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={() =>
                  setIndex((i) => (i - 1 + screenshots.length) % screenshots.length)
                }
                aria-label="Previous screenshot"
              >
                <ChevronLeft />
              </Button>
            )}

            {/* Next button */}
            {screenshots.length > 1 && (
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i + 1) % screenshots.length)}
                aria-label="Next screenshot"
              >
                <ChevronRight />
              </Button>
            )}
          </div>

          {/* Caption */}
          {current.caption && (
            <p className="text-center text-white/70 text-sm px-6 py-3">
              {current.caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
