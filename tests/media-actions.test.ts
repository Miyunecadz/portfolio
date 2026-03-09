// Wave 0 scaffold — MEDIA-07
// Tests describe the modified uploadMediaAsset signature that Wave 2 will implement.
// The function currently uses `section` as both the folder and usedIn value.
// Wave 2 will decouple them: folder = "misc" always; usedIn = explicit argument.
// All assertions will FAIL until Wave 2 lands. That is intentional.

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

function makeFormData(fileName = "test.jpg", mimeType = "image/jpeg"): FormData {
  const file = new File(["dummy content"], fileName, { type: mimeType })
  const formData = new FormData()
  formData.append("file", file)
  return formData
}

beforeEach(() => {
  vi.clearAllMocks()
  // Reset mock chain
  vi.mocked(db.insert).mockReturnThis()
  vi.mocked(db.insert(null as never).values).mockReturnThis()
  vi.mocked(db.insert(null as never).values(null as never).returning).mockResolvedValue([
    { id: "uuid-1", publicUrl: "https://example.com/test.jpg", fileName: "test.jpg" },
  ] as never)
})

describe("uploadMediaAsset — usedIn tagging (MEDIA-07)", () => {
  it("stores usedIn='project' when called with usedIn='project'", async () => {
    // Wave 2: uploadMediaAsset(formData, section, usedIn) decouples folder from usedIn
    // The usedIn column must reflect the explicit argument
    const formData = makeFormData()
    await uploadMediaAsset(formData, "project")

    const valuesCalls = vi.mocked(db.insert).mock.results
    // Check that db.insert().values() was called with usedIn: "project"
    const valuesCall = vi.mocked(db.insert(null as never).values).mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "project" })
  })

  it("stores usedIn='profile' when called with usedIn='profile'", async () => {
    const formData = makeFormData()
    await uploadMediaAsset(formData, "profile")

    const valuesCall = vi.mocked(db.insert(null as never).values).mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "profile" })
  })

  it("stores usedIn='misc' when no usedIn arg provided", async () => {
    // Wave 2: default usedIn should be "misc" when no argument is passed
    const formData = makeFormData()
    await uploadMediaAsset(formData)

    const valuesCall = vi.mocked(db.insert(null as never).values).mock.calls[0]?.[0]
    expect(valuesCall).toMatchObject({ usedIn: "misc" })
  })
})
