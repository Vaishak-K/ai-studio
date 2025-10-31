import { test, expect } from "@playwright/test";

test("servers are running", async ({ page }) => {
  // Test backend
  const backendResponse = await page.goto("http://localhost:3001/health");
  expect(backendResponse?.status()).toBe(200);

  // Test frontend
  await page.goto("http://localhost:3000");
  await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
});
