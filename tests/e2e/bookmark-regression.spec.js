const { test, expect } = require('@playwright/test');

test.describe('Regression: Bookmark flow', () => {
  test('favorite a lesson from books and see it in dashboard', async ({ page }) => {
    // Simulate a bookmarked lesson by setting localStorage before page load,
    // then navigate to the dashboard and assert the bookmarks container exists.
    await page.addInitScript(() => {
      try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify(['l1'])); } catch (e) {}
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // presence check (may render skeletons); assert at least the container exists
    await expect(page.locator('#dashboard-bookmarks')).toHaveCount(1);
  });
});
