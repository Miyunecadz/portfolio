import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { HeroSection } from "@/components/public/hero-section"

// Radix UI AvatarImage only renders <img> when the image loads (never in jsdom).
// Mock the avatar subcomponents to always render deterministically.
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) =>
    <span data-slot="avatar" {...props}>{children}</span>,
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) =>
    src ? <img src={src} alt={alt} /> : null,
  AvatarFallback: ({ children }: React.HTMLAttributes<HTMLSpanElement>) =>
    <span data-slot="avatar-fallback">{children}</span>,
}))

const baseProps = {
  fullName: "Jane Doe",
  tagline: null,
  availabilityStatus: "not_available" as const,
  resumeUrl: null,
  avatarUrl: null,
  githubUrl: null,
  linkedinUrl: null,
  facebookUrl: null,
  blogUrl: null,
}

describe("HeroSection — hero profile card", () => {
  // HERO-01: Card renders with full data
  it("renders avatar image and social links when all data provided", () => {
    render(
      <HeroSection
        {...baseProps}
        fullName="Jane Doe"
        avatarUrl="/avatar.jpg"
        githubUrl="https://github.com/jane"
        linkedinUrl="https://linkedin.com/in/jane"
        facebookUrl={null}
        blogUrl={null}
      />
    )

    expect(screen.getByAltText("Jane Doe")).toBeInTheDocument()
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument()
  })

  // HERO-02a: Initials fallback when avatarUrl is null
  it("shows initials fallback when avatarUrl is null", () => {
    render(
      <HeroSection
        {...baseProps}
        fullName="Jane Doe"
        avatarUrl={null}
        githubUrl="https://github.com/jane"
      />
    )

    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  // HERO-02b: Card not rendered when all social URLs are null
  it("omits the identity bar when all social URLs are null", () => {
    render(
      <HeroSection
        {...baseProps}
        fullName="Solo Dev"
        avatarUrl={null}
        githubUrl={null}
        linkedinUrl={null}
        facebookUrl={null}
        blogUrl={null}
      />
    )

    expect(screen.queryByTestId("hero-profile-card")).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument()
  })

  // HERO-02c: Card wrapper has hidden md:flex classes
  it("card wrapper has hidden and md:flex classes for desktop-only visibility", () => {
    const { container } = render(
      <HeroSection
        {...baseProps}
        fullName="Test"
        avatarUrl={null}
        githubUrl="https://github.com/test"
      />
    )

    const card = container.querySelector("[data-testid='hero-profile-card']")
    expect(card).toBeInTheDocument()
    expect(card?.className).toContain("hidden")
    expect(card?.className).toContain("md:flex")
  })
})
