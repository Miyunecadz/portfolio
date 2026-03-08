import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { BottomNav } from "@/components/public/bottom-nav"

describe("BottomNav", () => {
  it("renders 4 navigation items", () => {
    render(<BottomNav activeSection={null} />)
    expect(screen.getAllByRole("link")).toHaveLength(4)
  })

  it("renders correct hrefs", () => {
    render(<BottomNav activeSection={null} />)
    const links = screen.getAllByRole("link")
    const hrefs = links.map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("#projects")
    expect(hrefs).toContain("#experience")
    expect(hrefs).toContain("#skills")
    expect(hrefs).toContain("#contact")
  })

  it("renders correct labels", () => {
    render(<BottomNav activeSection={null} />)
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Experience")).toBeInTheDocument()
    expect(screen.getByText("Skills")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
  })

  it("applies text-primary class to active item", () => {
    render(<BottomNav activeSection="projects" />)
    const links = screen.getAllByRole("link")
    const projectsLink = links.find((l) => l.getAttribute("href") === "#projects")
    const experienceLink = links.find((l) => l.getAttribute("href") === "#experience")
    expect(projectsLink?.className).toContain("text-primary")
    expect(experienceLink?.className).not.toContain("text-primary")
  })

  it("applies aria-current to active item", () => {
    render(<BottomNav activeSection="skills" />)
    const links = screen.getAllByRole("link")
    const skillsLink = links.find((l) => l.getAttribute("href") === "#skills")
    expect(skillsLink).toHaveAttribute("aria-current", "true")
  })

  it("applies no aria-current when activeSection is null", () => {
    render(<BottomNav activeSection={null} />)
    const links = screen.getAllByRole("link")
    links.forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current", "true")
    })
  })
})
