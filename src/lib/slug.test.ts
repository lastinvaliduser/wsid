import { describe, it, expect } from "vitest"
import { generateSlug, appendSuffix } from "./slug"

describe("generateSlug", () => {
  it("converts title to lowercase hyphenated slug", () => {
    expect(generateSlug("My First Blog Post")).toBe("my-first-blog-post")
  })

  it("removes special characters", () => {
    expect(generateSlug("Hello, World! How are you?")).toBe("hello-world-how-are-you")
  })

  it("collapses multiple spaces into a single hyphen", () => {
    expect(generateSlug("too   many   spaces")).toBe("too-many-spaces")
  })

  it("collapses multiple hyphens", () => {
    expect(generateSlug("a---b")).toBe("a-b")
  })

  it("strips leading and trailing hyphens", () => {
    expect(generateSlug("  trimmed  ")).toBe("trimmed")
  })

  it("handles titles with numbers", () => {
    expect(generateSlug("Top 10 Guitar Tips for 2024")).toBe(
      "top-10-guitar-tips-for-2024"
    )
  })

  it("handles titles with apostrophes", () => {
    expect(generateSlug("Don't Stop Riding")).toBe("dont-stop-riding")
  })

  it("handles unicode characters gracefully by stripping them", () => {
    expect(generateSlug("Café au lait")).toBe("caf-au-lait")
  })

  it("returns empty string for blank input", () => {
    expect(generateSlug("   ")).toBe("")
  })
})

describe("appendSuffix", () => {
  it("appends numeric suffix to slug", () => {
    expect(appendSuffix("my-post", 2)).toBe("my-post-2")
    expect(appendSuffix("my-post", 10)).toBe("my-post-10")
  })
})
