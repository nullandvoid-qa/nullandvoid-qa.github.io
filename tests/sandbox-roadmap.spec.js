// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Sandbox and Roadmap details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('sandbox menu loads and example renders', async ({ page }) => {
    await page.waitForFunction(() => typeof window.navigate === 'function');
    await page.evaluate(() => window.navigate('sandbox'));
    await page.waitForFunction(() => {
      const el = document.getElementById('view-sandbox');
      return !!el && el.classList.contains('active');
    });

    const menuCount = await page.locator('#sandbox-menu .sandbox-item').count();
    expect(menuCount).toBeGreaterThan(0);

    await page.evaluate(() => document.querySelector('#sandbox-menu .sandbox-item')?.click());
    await page.waitForTimeout(200);
    const exampleText = await page.locator('#sandbox-example').innerText();
    expect(exampleText.length).toBeGreaterThan(0);
  });

  test('roadmap start buttons navigate to track or lesson', async ({ page }) => {
    await page.waitForFunction(() => typeof window.navigate === 'function');
    await page.evaluate(() => window.navigate('roadmap'));
    await page.waitForSelector('#view-roadmap.active');

    const btnCount = await page.locator('.roadmap-card .roadmap-go').count();
    expect(btnCount).toBeGreaterThan(0);

    await page.locator('.roadmap-card .roadmap-go').first().click();
    await page.waitForSelector('#view-track.active, #view-lesson.active', { timeout: 2000 });

    const trackActive = await page.locator('#view-track').first().evaluate((el) => el.classList.contains('active'));
    const lessonActive = await page.locator('#view-lesson').first().evaluate((el) => el.classList.contains('active'));
    expect(trackActive || lessonActive).toBeTruthy();
  });
});
