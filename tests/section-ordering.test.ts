// @ts-ignore — implementation pending
import { DEFAULT_SECTION_ORDERING } from "@/lib/theme-utils"

describe("DEFAULT_SECTION_ORDERING", () => {
  it("contains all expected section keys", () => {
    const keys = DEFAULT_SECTION_ORDERING.map((s: { key: string }) => s.key)
    const expectedKeys = ["hero", "projects", "experience", "skills", "references", "education", "contact"]
    for (const key of expectedKeys) {
      expect(keys).toContain(key)
    }
  })
})
