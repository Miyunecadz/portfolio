// Wave 0 scaffold — SET-05
// Tests describe the maintenance page at src/app/(public)/maintenance/page.tsx.
// Wave 2 (07-02) will replace the stub with a real implementation.
// All content assertions will FAIL until Wave 2 lands. That is intentional.

import { render, screen } from "@testing-library/react"
import MaintenancePage from "@/app/(public)/maintenance/page"

vi.mock("@/lib/queries/settings", () => ({
  getSiteSettingsAdmin: vi.fn().mockResolvedValue({
    maintenanceMessage: null,
    siteTitle: "My Portfolio",
    maintenanceMode: true,
    calendlyEnabled: false,
    calendlyUrl: null,
  }),
}))

vi.mock("@/lib/queries/public", () => ({
  getProfilePublic: vi.fn().mockResolvedValue({
    email: "admin@example.com",
  }),
}))

async function renderMaintenancePage() {
  const jsx = await MaintenancePage()
  return render(jsx)
}

describe("MaintenancePage (SET-05)", () => {
  it("renders fallback message when maintenanceMessage is null", async () => {
    await renderMaintenancePage()
    // Wave 2 will render a default fallback when no custom message is set
    const fallback =
      screen.queryByText(/down for maintenance/i) ??
      screen.queryByText(/be right back/i) ??
      screen.queryByText(/we.re currently/i)
    expect(fallback).not.toBeNull()
  })

  it("renders custom message when maintenanceMessage is set", async () => {
    const { getSiteSettingsAdmin } = await import("@/lib/queries/settings")
    vi.mocked(getSiteSettingsAdmin).mockResolvedValueOnce({
      maintenanceMessage: "Back soon!",
      siteTitle: "My Portfolio",
      maintenanceMode: true,
      calendlyEnabled: false,
      calendlyUrl: null,
    })

    await renderMaintenancePage()
    expect(screen.queryByText("Back soon!")).not.toBeNull()
  })

  it("renders admin email contact link", async () => {
    await renderMaintenancePage()
    // Wave 2 will include a mailto: link or visible email for the admin contact
    const emailLink =
      document.querySelector("a[href^='mailto:admin@example.com']") ??
      screen.queryByText(/admin@example\.com/i)
    expect(emailLink).not.toBeNull()
  })
})
