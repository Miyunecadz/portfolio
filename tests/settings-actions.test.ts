// Wave 0 scaffold — SET-05 + SET-06
// Tests describe updateMaintenanceMode and updateCalendlySettings Server Actions.
// Wave 2 (07-02) will replace the stubs in src/lib/actions/settings.ts with real logic.
// All assertions will FAIL until Wave 2 lands. That is intentional.

import { updateMaintenanceMode, updateCalendlySettings } from "@/lib/actions/settings"
import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

vi.mock("@/db", () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  },
}))

// Use a getter to return the same spy object so tests can check call counts
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

const mockCookieStore = {
  set: vi.fn(),
  delete: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(cookies).mockResolvedValue(mockCookieStore as never)
})

describe("updateMaintenanceMode (SET-05)", () => {
  it("sets maintenance-mode=1 cookie when enabled is true", async () => {
    // Wave 2 must call cookieStore.set("maintenance-mode", "1", { httpOnly: true, ... })
    await updateMaintenanceMode(true).catch(() => {})
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "maintenance-mode",
      "1",
      expect.objectContaining({ httpOnly: true })
    )
  })

  it("deletes maintenance-mode cookie when enabled is false", async () => {
    // Wave 2 must call cookieStore.delete("maintenance-mode")
    await updateMaintenanceMode(false).catch(() => {})
    expect(mockCookieStore.delete).toHaveBeenCalledWith("maintenance-mode")
  })

  it("persists maintenanceMode to DB", async () => {
    // Wave 2 must call db.update(siteSettings).set({ maintenanceMode: ... })
    await updateMaintenanceMode(true).catch(() => {})
    expect(vi.mocked(db.update)).toHaveBeenCalled()
  })
})

describe("updateCalendlySettings (SET-06)", () => {
  it("saves calendlyEnabled and calendlyUrl to DB", async () => {
    // Wave 2 must persist both fields via db.update
    await updateCalendlySettings({ calendlyEnabled: true, calendlyUrl: "https://cal.com/test" }).catch(() => {})
    expect(vi.mocked(db.update)).toHaveBeenCalled()
  })

  it("calls revalidatePath after save", async () => {
    // Wave 2 must call revalidatePath("/admin/settings") after updating
    await updateCalendlySettings({ calendlyEnabled: true, calendlyUrl: "https://cal.com/test" }).catch(() => {})
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/admin/settings")
  })
})
