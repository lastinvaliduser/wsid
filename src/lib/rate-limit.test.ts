import { describe, it, expect, beforeEach, vi } from "vitest"
import { checkRateLimit, getClientIp } from "./rate-limit"

// Reset the module's store between tests by re-importing with a fresh module
// The store is module-level so we test via black-box behavior

describe("checkRateLimit", () => {
  const config = { maxRequests: 3, windowMs: 60_000 }

  it("allows requests within the limit", () => {
    const key = `test-${Date.now()}-allow`
    const result1 = checkRateLimit(key, config)
    const result2 = checkRateLimit(key, config)
    const result3 = checkRateLimit(key, config)

    expect(result1.allowed).toBe(true)
    expect(result2.allowed).toBe(true)
    expect(result3.allowed).toBe(true)
    expect(result3.remaining).toBe(0)
  })

  it("blocks the request that exceeds the limit", () => {
    const key = `test-${Date.now()}-block`
    checkRateLimit(key, config)
    checkRateLimit(key, config)
    checkRateLimit(key, config)

    const result = checkRateLimit(key, config)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("provides a resetAt date in the future", () => {
    const key = `test-${Date.now()}-reset`
    const result = checkRateLimit(key, config)
    expect(result.resetAt).toBeInstanceOf(Date)
    expect(result.resetAt.getTime()).toBeGreaterThan(Date.now())
  })

  it("uses separate counters for different keys", () => {
    const key1 = `test-${Date.now()}-key1`
    const key2 = `test-${Date.now()}-key2`

    checkRateLimit(key1, config)
    checkRateLimit(key1, config)
    checkRateLimit(key1, config)
    checkRateLimit(key1, config) // over limit

    const result = checkRateLimit(key2, config)
    expect(result.allowed).toBe(true)
  })
})

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    })
    expect(getClientIp(request)).toBe("1.2.3.4")
  })

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "9.10.11.12" },
    })
    expect(getClientIp(request)).toBe("9.10.11.12")
  })

  it("returns unknown when no IP headers are present", () => {
    const request = new Request("http://localhost")
    expect(getClientIp(request)).toBe("unknown")
  })
})
