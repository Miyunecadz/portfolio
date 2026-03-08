import { describe, it, expect } from "vitest"
import { THEME_PRESETS, DEFAULT_MINIMAL_CONFIG, DEFAULT_DEVELOPER_CONFIG } from "./theme-utils"

const HEX_REGEX = /^#[0-9a-f]{6}$/  // lowercase 6-char hex only

describe("THEME_PRESETS", () => {
  it("has exactly 3 presets for the minimal template", () => {
    expect(THEME_PRESETS.minimal).toHaveLength(3)
  })

  it("has exactly 3 presets for the developer template", () => {
    expect(THEME_PRESETS.developer).toHaveLength(3)
  })

  it("minimal presets all use lowercase 6-char hex", () => {
    THEME_PRESETS.minimal.forEach((p) => {
      expect(p.primary).toMatch(HEX_REGEX)
    })
  })

  it("developer presets all use lowercase 6-char hex", () => {
    THEME_PRESETS.developer.forEach((p) => {
      expect(p.primary).toMatch(HEX_REGEX)
    })
  })

  it("exactly one minimal preset has isDefault: true", () => {
    const defaults = THEME_PRESETS.minimal.filter((p) => p.isDefault)
    expect(defaults).toHaveLength(1)
  })

  it("exactly one developer preset has isDefault: true", () => {
    const defaults = THEME_PRESETS.developer.filter((p) => p.isDefault)
    expect(defaults).toHaveLength(1)
  })

  it("minimal default preset primary matches DEFAULT_MINIMAL_CONFIG", () => {
    const defaultPreset = THEME_PRESETS.minimal.find((p) => p.isDefault)!
    expect(defaultPreset.primary).toBe(DEFAULT_MINIMAL_CONFIG.colors.light.primary)
  })

  it("developer default preset primary matches DEFAULT_DEVELOPER_CONFIG", () => {
    const defaultPreset = THEME_PRESETS.developer.find((p) => p.isDefault)!
    expect(defaultPreset.primary).toBe(DEFAULT_DEVELOPER_CONFIG.colors.light.primary)
  })
})
