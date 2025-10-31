import { test, expect } from "@playwright/test";

test.describe("AI Studio E2E", () => {
  test("complete user flow with restore", async ({ page }) => {
    // 1. Start at homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 2. Navigate to signup and create account
    await page.click('a[href="/signup"]');
    await page.waitForURL("**/signup");

    const email = `test${Date.now()}@example.com`;
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to studio
    await page.waitForURL("**/studio", { timeout: 10000 });

    // 3. Upload image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles("./e2e/fixtures/test-image.jpg");

    // Wait for preview
    await page.waitForSelector('img[alt="Preview"]', { timeout: 5000 });

    // 4. Fill form - Use the hidden select that syncs with buttons
    await page.fill('textarea[id="prompt"]', "A beautiful landscape");
    await page.selectOption('select[id="style"]', "realistic");

    // 5. Generate
    await page.click('button[type="submit"]:has-text("Generate")');

    // Wait for generation to complete
    await expect(
      page.getByText(/Generation completed successfully/i)
    ).toBeVisible({ timeout: 30000 });

    // 6. Verify history appears
    await expect(page.getByText("A beautiful landscape")).toBeVisible({
      timeout: 5000,
    });

    // 7. Test restore functionality - click on history item
    // The history items are buttons that contain the prompt text
    await page.click('button:has-text("A beautiful landscape")');

    // Wait a moment for the form to be populated
    await page.waitForTimeout(1000);

    // 8. Verify restoration - check that prompt is filled
    const promptValue = await page
      .locator('textarea[id="prompt"]')
      .inputValue();
    expect(promptValue).toBe("A beautiful landscape");

    // Verify style is restored
    const styleValue = await page.locator('select[id="style"]').inputValue();
    expect(styleValue).toBe("realistic");

    // Verify image preview is shown (restored image)
    await expect(page.locator('img[alt="Preview"]')).toBeVisible();

    // 9. Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL("**/login");
  });

  test("handles generation errors gracefully", async ({ page }) => {
    // Login first
    await page.goto("/login");
    const email = `test${Date.now()}@example.com`;

    // Create account
    await page.goto("/signup");
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/studio");

    // Try to generate without image
    await page.fill('textarea[id="prompt"]', "Test prompt");
    const generateButton = page.locator(
      'button[type="submit"]:has-text("Generate")'
    );

    // Button should be disabled
    await expect(generateButton).toBeDisabled();

    // Now add image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles("./e2e/fixtures/test-image.jpg");
    await page.waitForSelector('img[alt="Preview"]');

    // Button should be enabled
    await expect(generateButton).toBeEnabled();
  });

  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[id="email"]', "wrong@example.com");
    await page.fill('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message with role="alert"
    const errorAlert = page
      .getByRole("alert")
      .filter({ hasText: /Invalid credentials|Login Failed/i });

    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // Page should NOT redirect
    await expect(page).toHaveURL("http://localhost:3000/login");
  });

  test("signup validation", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "differentpassword");
    await page.click('button[type="submit"]');

    // Check for validation error with role="alert"
    const errorAlert = page
      .getByRole("alert")
      .filter({ hasText: "Passwords do not match" });

    await expect(errorAlert).toBeVisible({ timeout: 3000 });
  });

  test("can clear uploaded image", async ({ page }) => {
    // Create account and login
    const email = `test${Date.now()}@example.com`;
    await page.goto("/signup");
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/studio");

    // Upload image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles("./e2e/fixtures/test-image.jpg");
    await page.waitForSelector('img[alt="Preview"]');

    // Find and click the Clear button (it's in the top-right of the upload area)
    const clearButton = page.locator('button:has-text("Clear")');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Image preview should be gone
    await expect(page.locator('img[alt="Preview"]')).not.toBeVisible();

    // Upload area should show the upload prompt again
    await expect(page.getByText(/Upload your image/i)).toBeVisible();
  });
});
