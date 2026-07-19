// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Best-practice UX sections', () => {
  test('homepage and books page expose guided sections and clear navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#home-guidance')).toBeVisible();
    await expect(page.locator('#home-guidance h2')).toContainText(/como começar|guia rápido/i);

    await page.goto('/books/index.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#books-guidance')).toBeVisible();
    await expect(page.locator('#books-guidance h2')).toContainText(/como usar|guia rápido/i);
    await expect(page.locator('.breadcrumb')).toBeVisible();
  });
});
