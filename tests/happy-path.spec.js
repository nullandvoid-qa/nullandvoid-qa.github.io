// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Null and Void QA happy path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show auth fallback and navigate to a track, complete lesson, and verify progress', async ({ page }) => {
    // Guest login fallback should be available locally
    const guestButton = page.locator('#auth-local-signin');
    await expect(guestButton).toBeVisible();
    await guestButton.click();

    // After guest login, auth profile should appear
    await expect(page.locator('#auth-user')).toBeVisible();
    await expect(page.locator('#auth-name')).toHaveText(/Convidado|Signed in as guest/);

    // Home page should render track cards and allow navigation
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
    const guestButton = page.locator('#auth-local-signin');
    await expect(guestButton).toBeVisible();
    await guestButton.click();
    await expect(page.locator('#auth-user')).toBeVisible();

    await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
    await page.waitForTimeout(1000);

    await expect(page.locator('#track-breadcrumb')).toBeVisible();
    const quizButton = page.locator('#btn-take-quiz');
    await expect(quizButton).toBeVisible();
    await quizButton.click();

    await expect(page.locator('.quiz-card')).toBeVisible();
    await expect(page.locator('.quiz-card h2')).toContainText(/Quiz — Iniciação da Guilda|Quiz — Guild Initiation/);

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
    await page.locator('.track-card', { hasText: 'Iniciação da Guilda' }).first().click();
    await page.locator('.lesson-item').first().click();
    await expect(page.locator('#btn-bookmark')).toBeVisible();
    await page.locator('#btn-bookmark').click();
    await page.evaluate(() => window.navigate('dashboard'));
    await page.waitForTimeout(1000);
    await expect(page.locator('#dashboard-bookmarks')).toContainText(/Iniciação da Guilda|Guild Initiation/);
  });
});
