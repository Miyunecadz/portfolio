// Wave 0 scaffold — MEDIA-07
// Tests describe the modified uploadMediaAsset signature that Wave 2 will implement.
// The function currently uses `section` as both the folder and usedIn value.
// Wave 2 will decouple them: folder = "misc" always; usedIn = explicit argument.

import { uploadMediaAsset } from "@/lib/actions/media"
import { db } from "@/db"

vi.mock("@/lib/supabase", () => ({
  createSupabaseServiceClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/test.jpg" } }),
        remove: vi.fn(),
      }),
    },
  }),
}))

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([
      { id: "uuid-1", publicUrl: "https://example.com/test.jpg", fileName: "test.jpg" },
    ]),
  },
}))

vi.mock("@/lib/activity", () => ({
  logActivity: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

// Cast to any so we can access mock-only properties (.values, .returning) on the db mock object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbMock = db as any

function makeFormData(fileName = "test.jpg", mimeType = "image/jpeg"): FormData {
  const file = new File(["dummy content"], fileName, { type: mimeType })
  const formData = new FormData()
  formData.append("file", file)
  return formData
}

beforeEach(() => {
  vi.clearAllMocks()
  // Re-wire mock chain without calling through it (avoids consuming mock.calls[0])
  vi.mocked(db.insert).mockReturnValue(db as never)
  dbMock.values.mockReturnValue(db as never)
  dbMock.returning.mockResolvedValue([
    { id: "uuid-1", publicUrl: "https://example.com/test.jpg", fileName: "test.jpg" },
  ])
})

describe("uploadMediaAsset — usedIn tagging (MEDIA-07)", () => {
  it("stores usedIn='project' when called with usedIn='project'", async () => {
    const formData = makeFormData()
    await uploadMediaAsset(formData, "project")

    // dbMock.values is called by the insert chain — check first call args
    const valuesCall = dbMock.values.mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "project" })
  })

  it("stores usedIn='profile' when called with usedIn='profile'", async () => {
    const formData = makeFormData()
    await uploadMediaAsset(formData, "profile")

    const valuesCall = dbMock.values.mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "profile" })
  })

  it("stores usedIn='misc' when no usedIn arg provided", async () => {
    const formData = makeFormData()
    await uploadMediaAsset(formData)

    const valuesCall = dbMock.values.mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "misc" })
  })
})
