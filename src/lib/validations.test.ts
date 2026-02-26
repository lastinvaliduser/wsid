import { describe, it, expect } from "vitest"
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostQuerySchema,
  SignInSchema,
  ChangePasswordSchema,
  UpdateSettingSchema,
  MediaMetaSchema,
  SlugSchema,
} from "./validations"

describe("SlugSchema", () => {
  it("accepts valid slugs", () => {
    expect(SlugSchema.parse("hello-world")).toBe("hello-world")
    expect(SlugSchema.parse("my-guitar-journey-2024")).toBe("my-guitar-journey-2024")
    expect(SlugSchema.parse("a")).toBe("a")
  })

  it("rejects slugs with uppercase letters", () => {
    expect(() => SlugSchema.parse("Hello-World")).toThrow()
  })

  it("rejects slugs with path traversal characters", () => {
    expect(() => SlugSchema.parse("../secret")).toThrow()
    expect(() => SlugSchema.parse("a/b")).toThrow()
  })

  it("rejects slugs with spaces", () => {
    expect(() => SlugSchema.parse("hello world")).toThrow()
  })

  it("rejects slugs with leading/trailing hyphens", () => {
    expect(() => SlugSchema.parse("-hello")).toThrow()
    expect(() => SlugSchema.parse("hello-")).toThrow()
  })

  it("rejects empty slugs", () => {
    expect(() => SlugSchema.parse("")).toThrow()
  })
})

describe("CreatePostSchema", () => {
  const validPost = {
    title: "My First Post",
    category: "CODING" as const,
    content: "# Hello\n\nThis is content.",
    status: "DRAFT" as const,
  }

  it("accepts a minimal valid post", () => {
    const result = CreatePostSchema.parse(validPost)
    expect(result.title).toBe("My First Post")
    expect(result.tags).toEqual([])
    expect(result.status).toBe("DRAFT")
  })

  it("defaults status to DRAFT when omitted", () => {
    const { status: _, ...withoutStatus } = validPost
    const result = CreatePostSchema.parse(withoutStatus)
    expect(result.status).toBe("DRAFT")
  })

  it("rejects empty title", () => {
    expect(() => CreatePostSchema.parse({ ...validPost, title: "" })).toThrow()
  })

  it("rejects invalid category", () => {
    expect(() =>
      CreatePostSchema.parse({ ...validPost, category: "COOKING" })
    ).toThrow()
  })

  it("rejects cover image that is not a URL", () => {
    expect(() =>
      CreatePostSchema.parse({ ...validPost, coverImage: "not-a-url" })
    ).toThrow()
  })

  it("rejects tags array exceeding 10 items", () => {
    const tooManyTags = Array.from({ length: 11 }, (_, i) => `tag${i}`)
    expect(() =>
      CreatePostSchema.parse({ ...validPost, tags: tooManyTags })
    ).toThrow()
  })

  it("rejects seoTitle longer than 70 characters", () => {
    expect(() =>
      CreatePostSchema.parse({ ...validPost, seoTitle: "a".repeat(71) })
    ).toThrow()
  })

  it("rejects seoDesc longer than 160 characters", () => {
    expect(() =>
      CreatePostSchema.parse({ ...validPost, seoDesc: "a".repeat(161) })
    ).toThrow()
  })
})

describe("UpdatePostSchema", () => {
  it("accepts an empty partial update", () => {
    const result = UpdatePostSchema.parse({})
    expect(result).toEqual({})
  })

  it("accepts updating only title", () => {
    const result = UpdatePostSchema.parse({ title: "Updated Title" })
    expect(result.title).toBe("Updated Title")
  })
})

describe("PostQuerySchema", () => {
  it("defaults to PUBLISHED status and page 1", () => {
    const result = PostQuerySchema.parse({})
    expect(result.status).toBe("PUBLISHED")
    expect(result.page).toBe(1)
    expect(result.limit).toBe(10)
  })

  it("coerces string numbers to integers", () => {
    const result = PostQuerySchema.parse({ page: "2", limit: "20" })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(20)
  })

  it("rejects limit greater than 50", () => {
    expect(() => PostQuerySchema.parse({ limit: "51" })).toThrow()
  })
})

describe("SignInSchema", () => {
  it("accepts valid credentials", () => {
    const result = SignInSchema.parse({
      email: "creovibecoding@gmail.com",
      password: "securePassword123",
    })
    expect(result.email).toBe("creovibecoding@gmail.com")
  })

  it("rejects invalid email format", () => {
    expect(() =>
      SignInSchema.parse({ email: "not-an-email", password: "securePassword123" })
    ).toThrow()
  })

  it("rejects passwords shorter than 12 characters", () => {
    expect(() =>
      SignInSchema.parse({ email: "test@example.com", password: "short" })
    ).toThrow()
  })
})

describe("ChangePasswordSchema", () => {
  it("accepts matching passwords", () => {
    const result = ChangePasswordSchema.parse({
      currentPassword: "oldPassword123!",
      newPassword: "newPassword456!",
      confirmPassword: "newPassword456!",
    })
    expect(result.newPassword).toBe("newPassword456!")
  })

  it("rejects mismatched passwords", () => {
    expect(() =>
      ChangePasswordSchema.parse({
        currentPassword: "oldPassword123!",
        newPassword: "newPassword456!",
        confirmPassword: "differentPassword!",
      })
    ).toThrow()
  })
})

describe("UpdateSettingSchema", () => {
  it("accepts known setting keys", () => {
    const result = UpdateSettingSchema.parse({ key: "site.bio", value: "Hello!" })
    expect(result.key).toBe("site.bio")
  })

  it("rejects unknown setting keys", () => {
    expect(() =>
      UpdateSettingSchema.parse({ key: "unknown.key", value: "value" })
    ).toThrow()
  })
})

describe("MediaMetaSchema", () => {
  const validMedia = {
    filename: "photo.jpg",
    url: "https://utfs.io/f/abc123",
    mimeType: "image/jpeg" as const,
    size: 1024 * 1024,
  }

  it("accepts valid image metadata", () => {
    const result = MediaMetaSchema.parse(validMedia)
    expect(result.filename).toBe("photo.jpg")
  })

  it("rejects files larger than 4MB", () => {
    expect(() =>
      MediaMetaSchema.parse({ ...validMedia, size: 4 * 1024 * 1024 + 1 })
    ).toThrow()
  })

  it("rejects disallowed MIME types", () => {
    expect(() =>
      MediaMetaSchema.parse({ ...validMedia, mimeType: "application/pdf" })
    ).toThrow()
  })

  it("rejects non-URL values for url field", () => {
    expect(() =>
      MediaMetaSchema.parse({ ...validMedia, url: "not-a-url" })
    ).toThrow()
  })
})
