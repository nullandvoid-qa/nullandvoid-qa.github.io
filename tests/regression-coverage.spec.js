// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Regression coverage for core UX flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('exposes a keyboard-friendly skip link and accessible toggle labels', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    await skipLink.focus();
    await expect(skipLink).toBeVisible();

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', /tema|theme/i);
    await expect(page.locator('#lang-toggle')).toHaveAttribute('aria-label', /idioma|language/i);
  });

  test('uses localized onboarding copy and toggle labels', async ({ page }) => {
    await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', /alternar para tema claro|alternar para tema escuro/i);
    await expect(page.locator('#lang-toggle')).toHaveAttribute('aria-label', /alternar idioma/i);
    await expect(page.locator('#onboarding-title')).toContainText(/bem-vindo|welcome/i);

    await page.locator('#lang-toggle').click();

    await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', /switch to light theme|switch to dark theme/i);
    await expect(page.locator('#lang-toggle')).toHaveAttribute('aria-label', /switch language/i);
    await expect(page.locator('#onboarding-title')).toContainText(/welcome/i);
  });

  test('persists bookmark and completion state after a full reload', async ({ page }) => {
    await page.locator('#auth-local-signin').click();
    await expect(page.locator('#auth-user')).toBeVisible();

    await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
    await page.waitForSelector('#view-track.active', { timeout: 10000 });
    await page.locator('.lesson-item').first().click();
    await page.waitForSelector('#btn-bookmark', { timeout: 10000 });

    await page.locator('#btn-bookmark').click();
    await page.locator('#btn-complete').click();
    await page.waitForTimeout(250);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#btn-bookmark')).toBeVisible();
    await expect(page.locator('#btn-complete')).toBeVisible();
    await expect(page.locator('#btn-bookmark')).toHaveClass(/bookmarked/);
    await expect(page.locator('#btn-complete')).toContainText(/não concluída|incomplete|unmark|unmarkComplete/i);
  });
});
