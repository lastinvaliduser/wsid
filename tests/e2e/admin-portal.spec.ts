import { test, expect } from "@playwright/test"

test.describe("Admin Portal — Auth Guard", () => {
  test("unauthenticated access to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test("unauthenticated access to /admin/posts redirects to login", async ({ page }) => {
    await page.goto("/admin/posts")
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/admin/login")
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible()
  })

  test("invalid credentials show error message", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Email").fill("wrong@example.com")
    await page.getByLabel("Password").fill("wrongPassword123")
    await page.getByRole("button", { name: "Sign In" }).click()
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible()
  })
})

// These tests require a running server with a seeded admin account
// Run with: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run test:e2e
test.describe("Admin Portal — Authenticated", () => {
  test.skip(
    !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
    "Skipped: ADMIN_EMAIL and ADMIN_PASSWORD env vars not set"
  )

  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL!)
    await page.getByLabel("Password").fill(process.env.ADMIN_PASSWORD!)
    await page.getByRole("button", { name: "Sign In" }).click()
    await page.waitForURL("/admin")
  })

  test("dashboard shows stats", async ({ page }) => {
    await expect(page.getByText("Total Posts")).toBeVisible()
    await expect(page.getByText("Published")).toBeVisible()
    await expect(page.getByText("Drafts")).toBeVisible()
  })

  test("can navigate to new post form", async ({ page }) => {
    await page.goto("/admin/posts")
    await page.getByRole("link", { name: "New Post" }).click()
    await expect(page).toHaveURL("/admin/posts/new")
    await expect(page.getByPlaceholder("Post title...")).toBeVisible()
  })
})
