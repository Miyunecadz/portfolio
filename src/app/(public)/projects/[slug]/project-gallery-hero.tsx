"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProjectGalleryLightbox from "./project-gallery-lightbox"

interface Screenshot {
  id: string
  publicUrl: string
  caption: string | null
  sortOrder?: number
}

interface Props {
  screenshots: Screenshot[]
  projectTitle: string
}

export function ProjectGalleryHero({ screenshots, projectTitle }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const current = screenshots[currentIndex]

  return (
    <>
      <div
        className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 bg-muted cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={current.publicUrl}
          alt={projectTitle}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 768px) 768px, 100vw"
        />

        {/* Prev button — only shown when more than one screenshot */}
        {screenshots.length > 1 && (
          <Button
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/30 z-10"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(
                (i) => (i - 1 + screenshots.length) % screenshots.length
              )
            }}
            aria-label="Previous screenshot"
          >
            <ChevronLeft />
          </Button>
        )}

        {/* Next button — only shown when more than one screenshot */}
        {screenshots.length > 1 && (
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/30 z-10"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((i) => (i + 1) % screenshots.length)
            }}
            aria-label="Next screenshot"
          >
            <ChevronRight />
          </Button>
        )}

        {/* Counter overlay */}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {screenshots.length}
        </span>
      </div>

      <ProjectGalleryLightbox
        screenshots={screenshots}
        initialIndex={currentIndex}
        open={lightboxOpen}
        onClose={setLightboxOpen}
      />
    </>
  )
}
