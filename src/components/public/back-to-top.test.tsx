import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { BackToTop } from "@/components/public/back-to-top"

describe("BackToTop", () => {
  beforeEach(() => {
    vi.stubGlobal("scrollY", 0)
    vi.stubGlobal("innerHeight", 800)
    vi.stubGlobal("scrollTo", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("is not visible on initial render", () => {
    render(<BackToTop />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("opacity-0")
  })

  it("becomes visible when scrollY exceeds window.innerHeight", () => {
    render(<BackToTop />)
    act(() => {
      vi.stubGlobal("scrollY", 900)
      window.dispatchEvent(new Event("scroll"))
    })
    const button = screen.getByRole("button")
    expect(button.className).toContain("opacity-100")
  })

  it("has aria-label Back to top", () => {
    render(<BackToTop />)
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Back to top")
  })

  it("calls window.scrollTo on click", () => {
    const scrollToMock = vi.fn()
    vi.stubGlobal("scrollTo", scrollToMock)
    render(<BackToTop />)
    screen.getByRole("button").click()
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
  })
})
