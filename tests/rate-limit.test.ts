// @ts-ignore — implementation pending
import { rateLimit } from "@/lib/rate-limit"

describe("rateLimit", () => {
  it("returns false for first 5 calls from same IP", () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit("1.2.3.4")).toBe(false)
    }
  })

  it("returns true on 6th call within 1 hour window", () => {
    // Reset by using a fresh IP
    const ip = "10.0.0.1"
    for (let i = 0; i < 5; i++) {
      rateLimit(ip)
    }
    expect(rateLimit(ip)).toBe(true)
  })

  it("tracks different IPs independently", () => {
    const ipA = "192.168.1.1"
    const ipB = "192.168.1.2"
    for (let i = 0; i < 5; i++) {
      rateLimit(ipA)
    }
    // ipA is rate limited but ipB is fresh
    expect(rateLimit(ipA)).toBe(true)
    expect(rateLimit(ipB)).toBe(false)
  })
})
