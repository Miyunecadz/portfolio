// Unit tests for the rate limit logic in POST /api/chat
// Mocks the DB and tests count thresholds at the boundaries.
//
// The route handler does an atomic upsert and checks:
//   if (row.count > 20) → 429
//   remaining = 20 - row.count

import { describe, it, expect, vi, beforeEach } from "vitest"

// ─── Mock @/db ────────────────────────────────────────────────────────────────

const { returningMock, onConflictDoUpdateMock, valuesMock, insertMock } = vi.hoisted(() => {
  const returningMock = vi.fn()
  const onConflictDoUpdateMock = vi.fn().mockReturnValue({ returning: returningMock })
  const valuesMock = vi.fn().mockReturnValue({ onConflictDoUpdate: onConflictDoUpdateMock })
  const insertMock = vi.fn().mockReturnValue({ values: valuesMock })
  return { returningMock, onConflictDoUpdateMock, valuesMock, insertMock }
})

// Also mock siteSettings query (select chain)
const { selectMock } = vi.hoisted(() => {
  const limitMock = vi.fn().mockResolvedValue([])
  const fromMock = vi.fn().mockReturnValue({ limit: limitMock })
  const selectMock = vi.fn().mockReturnValue({ from: fromMock })
  return { selectMock }
})

vi.mock("@/db", () => ({
  db: {
    insert: insertMock,
    select: selectMock,
  },
}))

// ─── Mock @/db/schema/app ─────────────────────────────────────────────────────
vi.mock("@/db/schema/app", () => ({
  aiRateLimits: { ip: "ip", date: "date", count: "count" },
  siteSettings: { personaPrompt: "persona_prompt" },
}))

// ─── Mock drizzle-orm sql ────────────────────────────────────────────────────
vi.mock("drizzle-orm", () => ({
  sql: vi.fn((strings: TemplateStringsArray) => strings[0]),
}))

// ─── Mock @/lib/env ────────────────────────────────────────────────────────────
vi.mock("@/lib/env", () => ({
  env: { GROQ_API_KEY: "gsk_test_key" },
}))

// ─── Mock @ai-sdk/groq ────────────────────────────────────────────────────────
vi.mock("@ai-sdk/groq", () => ({
  createGroq: () => (model: string) => ({ model }),
}))

// ─── Mock ai (streamText) ────────────────────────────────────────────────────
vi.mock("ai", () => ({
  streamText: vi.fn().mockResolvedValue({
    toUIMessageStreamResponse: () =>
      new Response("stream", {
        status: 200,
        headers: new Headers({ "content-type": "text/event-stream" }),
      }),
  }),
}))

// ─── Mock public query functions ─────────────────────────────────────────────
vi.mock("@/lib/queries/public", () => ({
  getPublishedProjects: vi.fn().mockResolvedValue([]),
  getPublishedExperiences: vi.fn().mockResolvedValue([]),
  getVisibleSkillsByCategory: vi.fn().mockResolvedValue({}),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a minimal POST Request targeting /api/chat with the given message count.
 */
function makeRequest(ip = "1.2.3.4"): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
  })
}

/**
 * Configure the upsert mock to return a specific count value.
 * This simulates what Postgres would return after the atomic increment.
 */
function mockUpsertReturnsCount(count: number) {
  returningMock.mockResolvedValue([{ count }])
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("POST /api/chat — rate limit logic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: siteSettings select returns empty (uses fallback persona)
    const limitMock = vi.fn().mockResolvedValue([])
    const fromMock = vi.fn().mockReturnValue({ limit: limitMock })
    selectMock.mockReturnValue({ from: fromMock })
  })

  it("1st message of day: count=1, remaining=19, returns 200 stream", async () => {
    mockUpsertReturnsCount(1)

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(200)
    // The route sets X-Remaining-Messages = 20 - 1 = 19
    expect(response.headers.get("X-Remaining-Messages")).toBe("19")
  })

  it("19th message of day: count=19, remaining=1, returns 200 stream", async () => {
    mockUpsertReturnsCount(19)

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(200)
    expect(response.headers.get("X-Remaining-Messages")).toBe("1")
  })

  it("20th message of day: count=20, remaining=0, returns 200 stream", async () => {
    mockUpsertReturnsCount(20)

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(200)
    expect(response.headers.get("X-Remaining-Messages")).toBe("0")
  })

  it("21st message of day: count=21, returns 429 with error payload", async () => {
    mockUpsertReturnsCount(21)

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(429)
    const body = (await response.json()) as { error: string; remaining: number }
    expect(body.error).toBe("rate_limit_exceeded")
    expect(body.remaining).toBe(0)
  })

  it("count=100 (heavily over limit): still returns 429, not a crash", async () => {
    mockUpsertReturnsCount(100)

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(429)
  })

  it("DB upsert failure returns 500", async () => {
    returningMock.mockRejectedValue(new Error("DB connection refused"))

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(makeRequest())

    expect(response.status).toBe(500)
    const body = (await response.json()) as { error: string }
    expect(body.error).toBe("internal_error")
  })

  it("missing messages array returns 400", async () => {
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [] }), // min(1) violated
    })

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it("malformed JSON body returns 400", async () => {
    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not json{{{",
    })

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it("missing x-forwarded-for header uses 'unknown' as IP bucket", async () => {
    mockUpsertReturnsCount(1)

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }] }),
    })

    const { POST } = await import("@/app/api/chat/route")
    const response = await POST(request)

    // Should succeed (not crash on missing header)
    expect(response.status).toBe(200)
    // DB insert should have been called with ip="unknown"
    expect(insertMock).toHaveBeenCalled()
    const insertedValues = valuesMock.mock.calls[0]?.[0] as { ip: string } | undefined
    expect(insertedValues?.ip).toBe("unknown")
  })

  it("only first IP from comma-separated x-forwarded-for is used", async () => {
    mockUpsertReturnsCount(1)

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12",
      },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }] }),
    })

    const { POST } = await import("@/app/api/chat/route")
    await POST(request)

    const insertedValues = valuesMock.mock.calls[0]?.[0] as { ip: string } | undefined
    expect(insertedValues?.ip).toBe("1.2.3.4")
  })
})

describe("POST /api/chat — persona prompt fallback", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpsertReturnsCount(1)
  })

  it("uses fallback persona when personaPrompt is null in DB", async () => {
    // siteSettings row with null personaPrompt
    const limitMock = vi.fn().mockResolvedValue([{ personaPrompt: null }])
    const fromMock = vi.fn().mockReturnValue({ limit: limitMock })
    selectMock.mockReturnValue({ from: fromMock })

    const { streamText } = await import("ai")
    const { POST } = await import("@/app/api/chat/route")
    await POST(makeRequest())

    const streamTextCalls = vi.mocked(streamText).mock.calls
    expect(streamTextCalls.length).toBeGreaterThan(0)
    const systemPrompt = streamTextCalls[0]?.[0]?.system as string
    expect(systemPrompt).toContain("You are JV, a software engineer.")
  })

  it("uses DB personaPrompt when set", async () => {
    const customPersona = "You are JV, a TypeScript wizard who loves hiking."
    const limitMock = vi.fn().mockResolvedValue([{ personaPrompt: customPersona }])
    const fromMock = vi.fn().mockReturnValue({ limit: limitMock })
    selectMock.mockReturnValue({ from: fromMock })

    const { streamText } = await import("ai")
    const { POST } = await import("@/app/api/chat/route")
    await POST(makeRequest())

    const streamTextCalls = vi.mocked(streamText).mock.calls
    expect(streamTextCalls.length).toBeGreaterThan(0)
    const systemPrompt = streamTextCalls[0]?.[0]?.system as string
    expect(systemPrompt).toContain(customPersona)
  })
})
