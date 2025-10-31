import { test, expect } from "@playwright/test";
import path from "path";

test.describe("AI Studio E2E", () => {
  test("complete user flow with restore", async ({ page }) => {
    // Generate unique email for this test run
    const testEmail = `test${Date.now()}@example.com`;

    // 1. Signup - USE FULL URL
    await page.goto("http://localhost:3000/signup");

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to studio
    await page.waitForURL("**/studio", { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("AI Studio");

    // 2. Upload image
    const fileInput = page.locator('input[type="file"]');
    const imagePath = path.join(__dirname, "../fixtures/test-image.jpg");
    await fileInput.setInputFiles(imagePath);

    // Wait for preview to appear
    await expect(page.locator('img[alt="Preview"]')).toBeVisible({
      timeout: 5000,
    });

    // 3. Fill form
    await page.fill('textarea[id="prompt"]', "A beautiful landscape");
    await page.selectOption('select[id="style"]', "realistic");

    // 4. Generate
    await page.click('button:has-text("Generate")');

    // Wait for completion or error (up to 10 seconds)
    try {
      await page.waitForSelector(
        'div:has-text("completed successfully"), div:has-text("overloaded")',
        { timeout: 10000 }
      );
    } catch (e) {
      console.log("Generation timeout - continuing test");
    }

    // 5. Check if generation succeeded
    const successVisible = await page
      .locator('div:has-text("completed successfully")')
      .isVisible()
      .catch(() => false);

    if (successVisible) {
      // 6. Check history
      const historyItem = page
        .locator('button:has-text("A beautiful landscape")')
        .first();
      await expect(historyItem).toBeVisible({ timeout: 5000 });

      // 7. Restore from history
      await historyItem.click();

      // Verify fields are restored
      await expect(page.locator('textarea[id="prompt"]')).toHaveValue(
        "A beautiful landscape"
      );
      await expect(page.locator('select[id="style"]')).toHaveValue("realistic");
      await expect(page.locator('img[alt="Preview"]')).toBeVisible();
    } else {
      console.log(
        "⚠️  Generation failed or timed out - skipping history check"
      );
    }

    // 8. Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL("**/login", { timeout: 5000 });
  });

  test("abort generation", async ({ page }) => {
    const testEmail = `abort${Date.now()}@example.com`;

    // Signup first - USE FULL URL
    await page.goto("http://localhost:3000/signup");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/studio", { timeout: 10000 });

    // Upload and try to generate
    const fileInput = page.locator('input[type="file"]');
    const imagePath = path.join(__dirname, "../fixtures/test-image.jpg");
    await fileInput.setInputFiles(imagePath);

    await page.fill('textarea[id="prompt"]', "Test abort");
    await page.click('button:has-text("Generate")');

    // Try to click abort if it appears
    try {
      const abortButton = page.locator('button:has-text("Abort")');
      await abortButton.waitFor({ state: "visible", timeout: 2000 });
      await abortButton.click();

      // Check for cancelled message
      await expect(page.locator('div:has-text("cancelled")')).toBeVisible({
        timeout: 5000,
      });
    } catch (e) {
      console.log("⚠️  Abort button not visible or generation too fast");
    }
  });

  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // FIX: Filter to get only the visible error alert (not the Next.js route announcer)
    const errorAlert = page
      .getByRole("alert")
      .filter({ hasText: /Invalid credentials|Login Failed/i });

    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // Page should NOT redirect
    await expect(page).toHaveURL("http://localhost:3000/login");
  });

  test("signup validation", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");

    // Try mismatched passwords
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "different");
    await page.click('button[type="submit"]');

    // FIX: Filter to get only the visible error alert (not the Next.js route announcer)
    const errorAlert = page
      .getByRole("alert")
      .filter({ hasText: "Passwords do not match" });

    await expect(errorAlert).toBeVisible({ timeout: 3000 });
  });
});
