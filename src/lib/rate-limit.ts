/**
 * In-memory sliding window rate limiter.
 * For production, swap the store with Upstash Redis.
 *
 * Each key maps to an array of request timestamps.
 * Requests older than the window are evicted on each check.
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

const store = new Map<string, number[]>()

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowMs

  const timestamps = (store.get(key) ?? []).filter((t) => t > windowStart)
  timestamps.push(now)
  store.set(key, timestamps)

  const count = timestamps.length
  const allowed = count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - count)
  const resetAt = new Date(timestamps[0] + config.windowMs)

  return { allowed, remaining, resetAt }
}

export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
}

/** Extracts a safe IP identifier from the request, trusting Vercel's proxy header. */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}
