import { DEFAULT_SECTION_ORDERING } from "@/lib/theme-utils"
import { arrayMove } from "@dnd-kit/sortable"

describe("DEFAULT_SECTION_ORDERING", () => {
  it("contains all expected section keys", () => {
    const keys = DEFAULT_SECTION_ORDERING.map((s: { key: string }) => s.key)
    const expectedKeys = ["hero", "projects", "experience", "skills", "references", "education", "contact"]
    for (const key of expectedKeys) {
      expect(keys).toContain(key)
    }
  })

  it("has exactly 7 items", () => {
    expect(DEFAULT_SECTION_ORDERING).toHaveLength(7)
  })

  it("all items have isVisible: true by default", () => {
    for (const item of DEFAULT_SECTION_ORDERING) {
      expect(item.isVisible).toBe(true)
    }
  })
})

describe("arrayMove reordering", () => {
  it("moves item from index 0 to index 2 correctly — item at 0 becomes item at index 1", () => {
    const items = [...DEFAULT_SECTION_ORDERING]
    const moved = arrayMove(items, 0, 2)
    // After moving index 0 to index 2, the item at the new index 0 is what was at index 1
    expect(moved[0].key).toBe(items[1].key)
  })
})
