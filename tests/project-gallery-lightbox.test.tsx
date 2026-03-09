// Wave 0 stubs — PROJ-15
// Tests describe the behavior of ProjectGalleryLightbox that Plan 04 will implement.
// These MUST fail (RED) since the component does not exist yet.

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ProjectGalleryLightbox from "@/app/(public)/projects/[slug]/project-gallery-lightbox"

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="dialog-content">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) =>
    <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) =>
    <p>{children}</p>,
}))

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

const screenshots = [
  { id: "s1", publicUrl: "https://example.com/s1.jpg", caption: "First caption", sortOrder: 0 },
  { id: "s2", publicUrl: "https://example.com/s2.jpg", caption: "Second caption", sortOrder: 1 },
  { id: "s3", publicUrl: "https://example.com/s3.jpg", caption: null, sortOrder: 2 },
]

describe("ProjectGalleryLightbox", () => {
  it("renders first screenshot image and caption when open=true", () => {
    render(
      <ProjectGalleryLightbox
        open={true}
        onClose={() => {}}
        screenshots={screenshots}
        initialIndex={0}
      />
    )

    expect(screen.getByAltText("First caption")).toBeInTheDocument()
    expect(screen.getByText("First caption")).toBeInTheDocument()
  })

  it("displays counter in '1 / 3' format when index=0 and screenshots.length=3", () => {
    render(
      <ProjectGalleryLightbox
        open={true}
        onClose={() => {}}
        screenshots={screenshots}
        initialIndex={0}
      />
    )

    expect(screen.getByText("1 / 3")).toBeInTheDocument()
  })

  it("ArrowRight key advances index to next screenshot", () => {
    render(
      <ProjectGalleryLightbox
        open={true}
        onClose={() => {}}
        screenshots={screenshots}
        initialIndex={0}
      />
    )

    fireEvent.keyDown(document, { key: "ArrowRight" })

    expect(screen.getByText("2 / 3")).toBeInTheDocument()
    expect(screen.getByAltText("Second caption")).toBeInTheDocument()
  })

  it("ArrowLeft key wraps from index 0 to last screenshot", () => {
    render(
      <ProjectGalleryLightbox
        open={true}
        onClose={() => {}}
        screenshots={screenshots}
        initialIndex={0}
      />
    )

    fireEvent.keyDown(document, { key: "ArrowLeft" })

    expect(screen.getByText("3 / 3")).toBeInTheDocument()
  })
})
