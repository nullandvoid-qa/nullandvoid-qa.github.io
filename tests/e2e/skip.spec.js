const { test, expect } = require('@playwright/test');

test.describe('Smoke: Accessibility and navigation', () => {
  test('has skip link and main content landmark', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('.skip-link');
    await expect(skip).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toBeVisible();
  });
});
