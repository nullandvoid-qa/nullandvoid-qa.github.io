// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile responsive experience', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('keeps the lesson content inside the viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.navigate('lesson', { lessonId: 'l1' }));
    await page.waitForSelector('#btn-bookmark');

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      lessonWidth: document.querySelector('.lesson-content')?.getBoundingClientRect().width || 0,
      sidebarWidth: document.querySelector('.lesson-sidebar')?.getBoundingClientRect().width || 0,
    }));

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.lessonWidth).toBeLessThanOrEqual(dimensions.viewportWidth - 48);
    expect(dimensions.sidebarWidth).toBeLessThanOrEqual(dimensions.viewportWidth - 48);
    await expect(page.locator('#btn-bookmark')).toBeVisible();
    await expect(page.locator('#btn-complete')).toBeVisible();
  });
});