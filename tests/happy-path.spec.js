// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Null and Void QA happy path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show auth fallback and navigate to a track, complete lesson, and verify progress', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth

    // Home page should render track cards and allow navigation
    // Wait for any track-card to appear; if not present, navigate to the tracks view.
    const hasTracks = await page.waitForFunction(() => document.querySelectorAll('.track-card').length > 0, { timeout: 5000 }).catch(() => null);
    if (!hasTracks) {
      await page.evaluate(() => window.navigate('tracks'));
      await page.waitForSelector('#view-tracks.active');
    }
    const firstTrackCard = page.locator('.track-card').first();
    await expect(firstTrackCard).toBeVisible();
    await firstTrackCard.click();

    // Track detail should show breadcrumb and lesson list
    await expect(page.locator('#track-breadcrumb')).toBeVisible();
    const firstLesson = page.locator('.lesson-item').first();
    await expect(firstLesson).toBeVisible();
    await firstLesson.click();

    // Lesson page should show complete button and bookmark button
    const completeButton = page.locator('#btn-complete');
    const bookmarkButton = page.locator('#btn-bookmark');
    await expect(completeButton).toBeVisible();
    await expect(bookmarkButton).toBeVisible();

    // Mark lesson as complete and confirm the lesson state updates
    await completeButton.click();
    await expect(completeButton).toHaveText(/Marcar como não concluída|Mark as incomplete/);
    await expect(page.locator('#toast')).toHaveClass(/show/);
    await expect(page.locator('#toast')).toContainText(/Aula concluída|Lesson completed|Conquista desbloqueada!|Achievement unlocked!/);

    // Navigate to dashboard and verify progress stats updated
    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#dashboard-stats')).toBeVisible();
    await expect(page.locator('#dashboard-stats')).toContainText(/1\/|1\//);
  });

  test('should complete starter quiz and preserve bookmark in dashboard', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth

    await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
    await page.waitForTimeout(1000);

    await expect(page.locator('#track-breadcrumb')).toBeVisible();
    const quizButton = page.locator('#btn-take-quiz');
    await expect(quizButton).toBeVisible();
    await quizButton.click();

    await expect(page.locator('.quiz-card')).toBeVisible();
    await expect(page.locator('.quiz-card h2')).toContainText(/Quiz — Testes Básicos|Quiz — Basic Testing/);

    await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
    await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
    await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
    await page.locator('#quiz-form button[type="submit"]').click();

    await expect(page.locator('#quiz-result')).toBeVisible();
    await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);

    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#dashboard-bookmarks')).toBeVisible();
    await expect(page.locator('#dashboard-bookmarks')).toContainText(/Nenhuma aula favoritada ainda.|No bookmarked lessons yet./);

    await page.evaluate(() => window.navigate('tracks'));
    await page.waitForTimeout(1000);
    await page.locator('.track-card', { hasText: 'Testes Básicos' }).first().click();
    await page.locator('.lesson-item').first().click();
    await expect(page.locator('#btn-bookmark')).toBeVisible();
    await page.locator('#btn-bookmark').click();
    await page.evaluate(() => window.navigate('dashboard'));
    await page.waitForTimeout(1000);
    await expect(page.locator('#dashboard-bookmarks')).toContainText(/Testes Básicos|Basic Testing/);
  });

  test('should expose the main homepage CTAs and reach the books library', async ({ page }) => {
    await expect(page.locator('.hero-title')).toContainText(/Formação QA/i);
    await expect(page.locator('.quick-card')).toHaveCount(2);

    await page.locator('.quick-card', { hasText: 'Resumos de livros' }).click();
    await expect(page).toHaveURL(/books\/index\.html$/);
    await expect(page.locator('.hero h1')).toContainText(/Biblioteca de Resumos/i);
  });
});
