// Wave 0 scaffold — SET-05 + SET-06
// Tests describe updateMaintenanceMode and updateCalendlySettings Server Actions.
// Wave 2 (07-02) will replace the stubs in src/lib/actions/settings.ts with real logic.
// All assertions will FAIL until Wave 2 lands. That is intentional.

import { updateMaintenanceMode, updateCalendlySettings } from "@/lib/actions/settings"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

const { insertMock, valuesMock, onConflictDoUpdateMock } = vi.hoisted(() => {
  const onConflictDoUpdateMock = vi.fn().mockResolvedValue([])
  const valuesMock = vi.fn().mockReturnValue({ onConflictDoUpdate: onConflictDoUpdateMock })
  const insertMock = vi.fn().mockReturnValue({ values: valuesMock })
  return { insertMock, valuesMock, onConflictDoUpdateMock }
})

vi.mock("@/db", () => ({
  db: {
    insert: insertMock,
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
    await updateMaintenanceMode(true).catch(() => {})
    expect(insertMock).toHaveBeenCalled()
    expect(onConflictDoUpdateMock).toHaveBeenCalled()
  })
})

describe("updateCalendlySettings (SET-06)", () => {
  it("saves calendlyEnabled and calendlyUrl to DB", async () => {
    await updateCalendlySettings({ calendlyEnabled: true, calendlyUrl: "https://cal.com/test" }).catch(() => {})
    expect(insertMock).toHaveBeenCalled()
    expect(onConflictDoUpdateMock).toHaveBeenCalled()
  })

  it("calls revalidatePath after save", async () => {
    // Wave 2 must call revalidatePath("/admin/settings") after updating
    await updateCalendlySettings({ calendlyEnabled: true, calendlyUrl: "https://cal.com/test" }).catch(() => {})
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/admin/settings")
  })
})
