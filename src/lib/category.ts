import type { Category } from "@prisma/client"

/** Maps a Prisma Category enum value to its public URL path segment. */
export function categoryToUrlSegment(category: Category): string {
  const map: Record<Category, string> = {
    CODING: "coding",
    GUITAR: "guitar",
    PHOTOGRAPHY: "photography",
    MOTORBIKES: "motorbikes",
  }
  return map[category]
}

/** Maps a URL path segment back to the Prisma Category enum value, or null if invalid. */
export function urlSegmentToCategory(segment: string): Category | null {
  const map: Record<string, Category> = {
    coding: "CODING",
    guitar: "GUITAR",
    photography: "PHOTOGRAPHY",
    motorbikes: "MOTORBIKES",
  }
  return map[segment] ?? null
}

export const CATEGORY_LABELS: Record<Category, string> = {
  CODING: "Coding",
  GUITAR: "Guitar",
  PHOTOGRAPHY: "Photography",
  MOTORBIKES: "Motorbikes",
}
