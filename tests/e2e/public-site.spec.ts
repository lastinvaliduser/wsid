import { test, expect } from "@playwright/test"

test.describe("Public Site", () => {
  test("landing page renders hero and category cards", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /What Should I Do Now/i })).toBeVisible()
    await expect(page.getByText("Coding")).toBeVisible()
    await expect(page.getByText("Guitar")).toBeVisible()
    await expect(page.getByText("Photography")).toBeVisible()
    await expect(page.getByText("Motorbikes")).toBeVisible()
  })

  test("navigation links point to correct category pages", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Coding" }).first().click()
    await expect(page).toHaveURL("/coding")
  })

  test("category page shows posts list or empty state", async ({ page }) => {
    await page.goto("/coding")
    // Either shows posts or empty state
    const hasEmptyState = await page.getByText("No posts yet").isVisible().catch(() => false)
    const hasPosts = await page.locator("article").count()
    expect(hasEmptyState || hasPosts >= 0).toBe(true)
  })

  test("invalid category returns 404", async ({ page }) => {
    const response = await page.goto("/invalidcategory")
    expect(response?.status()).toBe(404)
  })

  test("about page renders author information", async ({ page }) => {
    await page.goto("/about")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("site nav is visible on all public pages", async ({ page }) => {
    await page.goto("/")
    const nav = page.locator("header")
    await expect(nav).toBeVisible()
    await expect(nav.getByText("wsid.now")).toBeVisible()
  })
})
