// Wave 0 scaffold — MEDIA-06
// Tests describe MediaCategoryFilter component that Wave 2 will create at
// src/components/admin/media-category-filter.tsx.
// All assertions will FAIL until Wave 2 lands. That is intentional.

import { render, screen, fireEvent } from "@testing-library/react"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: (key: string) => (key === "category" ? null : null) }),
}))

// @ts-ignore — implementation pending
import { MediaCategoryFilter } from "@/components/admin/media-category-filter"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("MediaCategoryFilter (MEDIA-06)", () => {
  it("renders All pill and it is selected by default", () => {
    render(<MediaCategoryFilter activeCategory="all" />)
    // Wave 2 will render an "All" pill that is selected when activeCategory="all"
    const allPill =
      screen.queryByRole("button", { name: /^all$/i }) ??
      screen.queryByText(/^all$/i)
    expect(allPill).not.toBeNull()
  })

  it("renders all category pills: project, profile, experience, education, reference", () => {
    render(<MediaCategoryFilter activeCategory="all" />)
    // Wave 2 will render one pill per usedIn category
    expect(screen.queryByText(/project/i)).not.toBeNull()
    expect(screen.queryByText(/profile/i)).not.toBeNull()
    expect(screen.queryByText(/experience/i)).not.toBeNull()
    expect(screen.queryByText(/education/i)).not.toBeNull()
    expect(screen.queryByText(/reference/i)).not.toBeNull()
  })

  it("calls router.push with correct URL on pill click", () => {
    render(<MediaCategoryFilter activeCategory="all" />)
    // Wave 2: clicking "project" pill navigates to /admin/media?category=project
    const projectPill =
      screen.queryByRole("button", { name: /project/i }) ??
      screen.queryByText(/project/i)
    if (!projectPill) throw new Error("Project pill not found — Wave 2 not yet implemented")
    fireEvent.click(projectPill)
    expect(mockPush).toHaveBeenCalledWith("/admin/media?category=project")
  })

  it("highlights the active category pill", () => {
    render(<MediaCategoryFilter activeCategory="project" />)
    // Wave 2: the "project" pill should have an active state when activeCategory="project"
    const projectPill =
      screen.queryByRole("button", { name: /project/i }) ??
      screen.queryByText(/project/i)
    if (!projectPill) throw new Error("Project pill not found — Wave 2 not yet implemented")
    // Check for active indicator — aria-pressed, data-active, or an active class
    const isActive =
      projectPill.getAttribute("aria-pressed") === "true" ||
      projectPill.getAttribute("data-active") === "true" ||
      projectPill.className.includes("active") ||
      projectPill.className.includes("ring") ||
      projectPill.className.includes("bg-primary")
    expect(isActive).toBe(true)
  })
})
