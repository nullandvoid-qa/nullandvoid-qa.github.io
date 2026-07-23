// @ts-check
const { test, expect } = require('@playwright/test');

const navButton = async (page, dataNav) => {
  const button = page.locator(`button[data-nav="${dataNav}"]:visible, a[data-nav="${dataNav}"]:visible`);
  await button.first().click();
};

test.describe('Null and Void QA full site coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('navigate all main pages and verify static content', async ({ page }) => {
    await expect(page.locator('header .logo')).toBeVisible();
    await expect(page.locator('main .hero')).toBeVisible();

    await navButton(page, 'tracks', 'Explorar trilhas');
    await expect(page.locator('#view-tracks')).toHaveClass(/active/);
    const tracksCount = await page.locator('#view-tracks .track-card').count();
    expect(tracksCount).toBeGreaterThan(0);

    await navButton(page, 'roadmap', 'Ver rotas');
    await expect(page.locator('#view-roadmap')).toHaveClass(/active/);
    await expect(page.locator('.roadmap-card').first()).toBeVisible();

    await navButton(page, 'glossary', 'Glossário');
    await expect(page.locator('#view-glossary')).toHaveClass(/active/);
    await expect(page.locator('#glossary-content article').first()).toBeVisible();

    await navButton(page, 'labs', 'Labs');
    await expect(page.locator('#view-labs')).toHaveClass(/active/);
    await expect(page.locator('#labs-content .lab-card').first()).toBeVisible();

    await navButton(page, 'dashboard', 'Progresso');
    await expect(page.locator('#view-dashboard')).toHaveClass(/active/);
    await expect(page.locator('#dashboard-stats')).toBeVisible();
  });

  test('complete a quiz, toggle language, and verify dashboard updates', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth
    // (guest sign-in removed)

    await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
    await page.waitForTimeout(1000);
    await expect(page.locator('#track-breadcrumb')).toContainText('Testes Básicos');

    await page.locator('#btn-take-quiz').click();
    await expect(page.locator('.quiz-card')).toBeVisible();

    await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
    await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
    await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
    await page.locator('#quiz-form button[type="submit"]').click();

    await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);

    await expect(page.locator('#lang-toggle')).toBeVisible();
    await page.locator('#lang-toggle').click();
    await expect(page.locator('#lang-label')).not.toBeEmpty();

    await page.evaluate(() => window.navigate('dashboard'));
    await page.waitForTimeout(1000);
    await expect(page.locator('#dashboard-stats')).toContainText(/1\/9/);
  });

  test('bookmark a lesson and verify it appears in dashboard bookmarks', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth
    // (guest sign-in removed)

    await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
    await page.waitForTimeout(1000);
    await page.locator('.lesson-item').first().click();
    await expect(page.locator('#btn-bookmark')).toBeVisible();
    await page.locator('#btn-bookmark').click();

    await page.evaluate(() => window.navigate('dashboard'));
    await page.waitForTimeout(1000);
    await expect(page.locator('#dashboard-bookmarks')).toContainText(/Testes Básicos|Basic Testing/);
  });
});
