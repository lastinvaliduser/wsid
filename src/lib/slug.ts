/**
 * Generates a URL-safe slug from a given title.
 * Lowercase, alphanumeric and hyphens only. Consecutive hyphens collapsed.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Appends a numeric suffix to a slug to make it unique.
 * e.g. "my-post" → "my-post-2" → "my-post-3"
 */
export function appendSuffix(slug: string, suffix: number): string {
  return `${slug}-${suffix}`
}
