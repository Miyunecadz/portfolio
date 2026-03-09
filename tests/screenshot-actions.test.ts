// Wave 0 stubs — PROJ-11, PROJ-12, PROJ-13, PROJ-14
// Tests describe the behavior of Server Actions that Plan 02 will implement.
// These MUST fail (RED) since @/lib/actions/screenshots does not exist yet.

import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getScreenshotUploadUrl,
  recordScreenshot,
  reorderScreenshots,
  updateScreenshotCaption,
  deleteScreenshot,
} from "@/lib/actions/screenshots"
import { db } from "@/db"

vi.mock("@/lib/supabase", () => ({
  createSupabaseServiceClient: () => ({
    storage: {
      from: () => ({
        createSignedUploadUrl: vi.fn().mockResolvedValue({
          data: { signedUrl: "https://storage.supabase.co/signed", token: "tok123" },
          error: null,
        }),
        remove: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/screenshots/img.jpg" } }),
      }),
    },
  }),
}))

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: "uuid-1" }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
    limit: vi.fn().mockResolvedValue([]),
    transaction: vi.fn(),
  },
}))

vi.mock("@/lib/activity", () => ({ logActivity: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbMock = db as any

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(db.insert).mockReturnValue(db as never)
  dbMock.values.mockReturnValue(db as never)
  dbMock.returning.mockResolvedValue([{ id: "uuid-1" }])
  vi.mocked(db.update).mockReturnValue(db as never)
  dbMock.set.mockReturnValue(db as never)
  dbMock.where.mockReturnValue(db as never)
  vi.mocked(db.delete).mockReturnValue(db as never)
  vi.mocked(db.select).mockReturnValue(db as never)
  dbMock.from.mockReturnValue(db as never)
  dbMock.orderBy.mockResolvedValue([])
  dbMock.limit.mockResolvedValue([])
  dbMock.transaction.mockImplementation((fn: (tx: unknown) => unknown) => fn(db))
})

describe("getScreenshotUploadUrl", () => {
  it("returns signedUrl, token, storagePath, publicUrl for valid jpg extension", async () => {
    const result = await getScreenshotUploadUrl("project-abc", "screenshot.jpg")
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveProperty("signedUrl")
      expect(result.data).toHaveProperty("token")
      expect(result.data).toHaveProperty("storagePath")
      expect(result.data).toHaveProperty("publicUrl")
    }
  })

  it("returns { success: false } for invalid extension (exe)", async () => {
    const result = await getScreenshotUploadUrl("project-abc", "malware.exe")
    expect(result.success).toBe(false)
  })
})

describe("recordScreenshot", () => {
  it("inserts a DB row with matching projectId, publicUrl, storagePath and returns { success: true, data: { id } }", async () => {
    const result = await recordScreenshot({
      projectId: "project-abc",
      publicUrl: "https://example.com/screenshots/img.jpg",
      storagePath: "screenshots/project-abc/img.jpg",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveProperty("id")
    }

    const valuesCall = dbMock.values.mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({
      projectId: "project-abc",
      publicUrl: "https://example.com/screenshots/img.jpg",
      storagePath: "screenshots/project-abc/img.jpg",
    })
  })
})

describe("reorderScreenshots", () => {
  it("calls db.transaction and sets sortOrder 0..N for each ID in order", async () => {
    const ids = ["id-0", "id-1", "id-2"]
    const result = await reorderScreenshots("project-abc", ids)

    expect(result.success).toBe(true)
    expect(dbMock.transaction).toHaveBeenCalled()
  })
})

describe("updateScreenshotCaption", () => {
  it("calls db.update with the new caption text and matching screenshot id", async () => {
    const result = await updateScreenshotCaption("screenshot-id-1", "New caption text")

    expect(result.success).toBe(true)
    const setCall = dbMock.set.mock.calls[0]?.[0]
    expect(setCall).toMatchObject({ caption: "New caption text" })
  })
})

describe("deleteScreenshot", () => {
  it("calls db.delete + storage.remove and rewrites sort order", async () => {
    dbMock.from.mockResolvedValueOnce([
      { id: "screenshot-id-1", storagePath: "screenshots/proj/img.jpg", projectId: "project-abc", sortOrder: 0 },
    ])

    const result = await deleteScreenshot("screenshot-id-1")

    expect(result.success).toBe(true)
    expect(dbMock.delete).toHaveBeenCalled()
  })
})
