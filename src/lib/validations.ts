import { z } from "zod"

// ─── Shared primitives ───────────────────────────────────────────────────────

const SlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with hyphens only",
  })

const CategorySchema = z.enum(["CODING", "GUITAR", "PHOTOGRAPHY", "MOTORBIKES"])

const PostStatusSchema = z.enum(["DRAFT", "PUBLISHED"])

// ─── Post schemas ─────────────────────────────────────────────────────────────

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  category: CategorySchema,
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).nullable().optional(),
  coverImage: z.string().url().nullable().optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  seoTitle: z.string().max(70).nullable().optional(),
  seoDesc: z.string().max(160).nullable().optional(),
  status: PostStatusSchema.default("DRAFT"),
})

// UpdatePostSchema strips defaults so unset fields are truly absent (PATCH semantics)
export const UpdatePostSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(300),
    category: CategorySchema,
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().max(500).nullable().optional(),
    coverImage: z.string().url().nullable().optional(),
    tags: z.array(z.string().max(50)).max(10),
    seoTitle: z.string().max(70).nullable().optional(),
    seoDesc: z.string().max(160).nullable().optional(),
    status: PostStatusSchema,
  })
  .partial()

export const PostQuerySchema = z.object({
  category: CategorySchema.optional(),
  status: PostStatusSchema.optional().default("PUBLISHED"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
})

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters"),
})

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(12),
    confirmPassword: z.string().min(12),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// ─── Settings schemas ─────────────────────────────────────────────────────────

const ALLOWED_SETTING_KEYS = [
  "site.author",
  "site.email",
  "site.bio",
  "site.avatar",
  "site.twitter",
  "site.github",
] as const

export const UpdateSettingSchema = z.object({
  key: z.enum(ALLOWED_SETTING_KEYS),
  value: z.string().max(2000),
})

// ─── Media schemas ────────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const

export const MediaMetaSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url(),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  size: z.number().int().positive().max(4 * 1024 * 1024), // 4MB max
})

// ─── Slug schema (standalone, used in route params) ───────────────────────────

export { SlugSchema, CategorySchema, PostStatusSchema }
