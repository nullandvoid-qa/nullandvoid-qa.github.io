const { test, expect } = require('@playwright/test');

test.describe('Smoke: Home', () => {
  test('loads homepage and has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Null and Void QA Course/);
  });
});
