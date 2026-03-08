import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useActiveSection } from "@/hooks/use-active-section"

let observerCallback: IntersectionObserverCallback
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb
      }
      observe = mockObserve
      disconnect = mockDisconnect
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function makeEntry(id: string, ratio: number): IntersectionObserverEntry {
  const el = document.createElement("section")
  el.id = id
  return {
    target: el,
    intersectionRatio: ratio,
    isIntersecting: ratio > 0,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  }
}

describe("useActiveSection", () => {
  it("returns null initially when no sections are provided", () => {
    const { result } = renderHook(() => useActiveSection([]))
    expect(result.current).toBeNull()
  })

  it("returns null initially when sectionIds is non-empty (no intersection yet)", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "projects"]))
    expect(result.current).toBeNull()
  })

  it("returns the ID of the section with the highest intersectionRatio", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "projects", "contact"]))

    act(() => {
      observerCallback(
        [
          makeEntry("hero", 0.2),
          makeEntry("projects", 0.6),
          makeEntry("contact", 0.1),
        ],
        {} as IntersectionObserver
      )
    })

    expect(result.current).toBe("projects")
  })

  it("updates activeId when a different section becomes more visible", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "projects"]))

    act(() => {
      observerCallback([makeEntry("hero", 0.5), makeEntry("projects", 0.2)], {} as IntersectionObserver)
    })
    expect(result.current).toBe("hero")

    act(() => {
      observerCallback([makeEntry("hero", 0.1), makeEntry("projects", 0.8)], {} as IntersectionObserver)
    })
    expect(result.current).toBe("projects")
  })

  it("returns null initially; does not reset to null when all ratios drop to 0 mid-session", () => {
    const { result } = renderHook(() => useActiveSection(["hero", "about"]))

    // Establish an active section first
    act(() => {
      observerCallback([makeEntry("hero", 0.4)], {} as IntersectionObserver)
    })
    expect(result.current).toBe("hero")

    // All sections leave viewport — activeId stays as last known value
    act(() => {
      observerCallback(
        [makeEntry("hero", 0), makeEntry("about", 0)],
        {} as IntersectionObserver
      )
    })
    expect(result.current).toBe("hero")
  })

  it("calls observer.disconnect on cleanup", () => {
    const { unmount } = renderHook(() => useActiveSection(["hero"]))
    unmount()
    expect(mockDisconnect).toHaveBeenCalledOnce()
  })
})
