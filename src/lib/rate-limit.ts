const requestMap = new Map<string, { count: number; windowStart: number }>()
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5

/** Returns true if the IP is rate limited (should be blocked). */
export function rateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestMap.get(ip)
  if (!record || now - record.windowStart > WINDOW_MS) {
    requestMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (record.count >= MAX_REQUESTS) return true
  record.count++
  return false
}

// NOTE: In-memory limiter resets on serverless cold start (acceptable for single-admin use)
