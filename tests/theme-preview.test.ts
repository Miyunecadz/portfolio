// @ts-ignore — implementation pending
import { themeConfigToCssVars } from "@/lib/theme-utils"

describe("themeConfigToCssVars", () => {
  it("returns a string containing --primary when primary color provided", () => {
    const result = themeConfigToCssVars({
      colors: {
        light: { primary: "#3b82f6" },
        dark: {},
      },
      fonts: {},
    })
    expect(result).toContain("--primary:")
  })

  it("returns empty string for empty config without throwing", () => {
    const result = themeConfigToCssVars({})
    expect(result).toBe("")
  })
})
