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
    await page.waitForTimeout(250);

    const firstResult = page.locator('#search-results .search-result-item').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    await expect(page.locator('#view-lesson')).toHaveClass(/active/, { timeout: 10000 });
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
    await expect(completeButton).toBeVisible({ timeout: 10000 });
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

  test('supports keyboard access to dashboard certificate actions', async ({ page }) => {
    await page.addInitScript(() => {
      window.NVAuth = {
        isAuthenticated: true,
        user: { name: 'Test User' },
        getUserName: () => 'Test User',
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const starterTrack = (window.TG_QAWAY_TRACKS || []).find((track) => track.id === 'starter');
      if (!starterTrack) return;
      const progress = {};
      starterTrack.courses?.forEach((course) => {
        course.lessons?.forEach((lesson) => {
          if (lesson && lesson.id) {
            progress[lesson.id] = { completedAt: new Date().toISOString() };
          }
        });
      });
      localStorage.setItem('testers-guild-progress', JSON.stringify(progress));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#view-dashboard')).toHaveClass(/active/);

    const previewButton = page.locator('#btn-cert-preview');
    await expect(previewButton).toBeVisible();
    await previewButton.focus();
    await expect(previewButton).toBeFocused();
    await previewButton.press('Enter');

    await expect(page.locator('#cert-modal-root')).toBeVisible();
    await expect(page.locator('#cert-modal-close')).toBeVisible();
  });

  test('supports a search to lesson to certificate journey', async ({ page }) => {
    await page.addInitScript(() => {
      window.NVAuth = {
        isAuthenticated: true,
        user: { name: 'Test User' },
        getUserName: () => 'Test User',
      };
      window.TG_CERTIFICATES = {
        generateCertificate: async () => new Blob(['PDF content'], { type: 'application/pdf' }),
        downloadShareableCertificate: async () => new Blob(['PNG content'], { type: 'image/png' }),
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#global-search').fill('qa');
    await page.evaluate(() => {
      if (typeof window.handleSearch === 'function') {
        window.handleSearch('qa');
      }
    });
    await page.waitForTimeout(250);

    const firstResult = page.locator('#search-results .search-result-item').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    await expect(page.locator('#view-lesson')).toHaveClass(/active/, { timeout: 10000 });
    await expect(page.locator('#lesson-detail')).toBeVisible();
    await expect(page.locator('#btn-complete')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const starterTrack = (window.TG_QAWAY_TRACKS || []).find((track) => track.id === 'starter');
      if (!starterTrack) return;
      const currentLessonId = window.NVApp?.state?.viewParams?.lessonId;
      const progress = {};
      starterTrack.courses?.forEach((course) => {
        course.lessons?.forEach((lesson) => {
          if (lesson && lesson.id && lesson.id !== currentLessonId) {
            progress[lesson.id] = { completedAt: new Date().toISOString() };
          }
        });
      });
      window.NVApp.state.progress = progress;
      window.NVApp.helpers.saveProgress(progress);
    });

    const currentLessonId = await page.evaluate(() => window.NVApp?.state?.viewParams?.lessonId);
    await page.locator('#btn-complete').click();
    await page.waitForFunction((lessonId) => Boolean(window.NVApp?.state?.progress?.[lessonId]), currentLessonId, { timeout: 10000 });
    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#view-dashboard')).toHaveClass(/active/);
    await page.waitForFunction(() => Boolean(document.querySelector('#dashboard-certificates #btn-cert-preview')), null, { timeout: 10000 });
    await expect(page.locator('#btn-cert-preview')).toBeVisible();
    await page.locator('#btn-cert-preview').click();
    await expect(page.locator('#cert-modal-root')).toBeVisible();
  });
});
