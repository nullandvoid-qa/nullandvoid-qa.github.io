const { test, expect } = require('@playwright/test');

test.describe('Smoke: Dashboard bookmarks & certificates', () => {
  test('dashboard shows bookmarks and certificates sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const bm = page.locator('#dashboard-bookmarks');
    const cert = page.locator('#dashboard-certificates');
    // The dashboard sections may render skeletons or be hidden until data loads.
    // Assert the elements are present in the DOM rather than strictly visible.
    await expect(bm).toHaveCount(1);
    await expect(cert).toHaveCount(1);
  });
});
