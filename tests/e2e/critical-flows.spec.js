// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('E2E Critical User Flows', () => {
  test('searches content, opens a lesson, bookmarks it, and verifies dashboard state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('#global-search');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('qa');
    await page.evaluate(() => {
      if (typeof window.handleSearch === 'function') {
        window.handleSearch('qa');
      }
    });

    const firstResult = page.locator('#search-results .search-result-item').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    await expect(page.locator('#lesson-detail')).toBeVisible();
    await expect(page.locator('#lesson-detail')).toContainText(/QA|qa|Testes Básicos|Basic Testing/i);

    const bookmarkButton = page.locator('#btn-bookmark');
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    await page.waitForFunction(() => {
      const lessonId = window.NVApp?.state?.viewParams?.lessonId;
      return Array.isArray(window.NVApp?.state?.bookmarks) && window.NVApp.state.bookmarks.includes(lessonId);
    }, null, { timeout: 10000 });

    const completeButton = page.locator('#btn-complete');
    await expect(completeButton).toBeVisible();
    await completeButton.click();
    await page.waitForFunction(() => {
      const lessonId = window.NVApp?.state?.viewParams?.lessonId;
      return Boolean(window.NVApp?.state?.progress?.[lessonId]);
    }, null, { timeout: 10000 });
    await expect(completeButton).toContainText(/Marcar como não concluída|Mark as incomplete/i);

    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#view-dashboard')).toHaveClass(/active/);

    await expect(page.locator('#dashboard-bookmarks')).toBeVisible();
    await expect(page.locator('#dashboard-bookmarks')).toContainText(/Testes Básicos|Basic Testing|qa/i);
    await expect(page.locator('#dashboard-certificates')).toBeVisible();
    await expect(page.locator('#dashboard-certificates')).toHaveAttribute('id', 'dashboard-certificates');
  });
});
