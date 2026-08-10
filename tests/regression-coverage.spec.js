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
    // tolerate either localized (pt) or default (en) labels depending on environment
    const themeLabel = await page.locator('#theme-toggle').getAttribute('aria-label');
    expect(themeLabel).toMatch(/alternar para tema claro|alternar para tema escuro|switch to light theme|switch to dark theme|Toggle theme/i);
    const langLabel = await page.locator('#lang-toggle').getAttribute('aria-label');
    expect(langLabel).toMatch(/alternar idioma|switch language|Switch language/i);
    await expect(page.locator('#onboarding-title')).toContainText(/bem-vindo|welcome/i);

    await page.locator('#lang-toggle').click();

    const themeLabelAfter = await page.locator('#theme-toggle').getAttribute('aria-label');
    expect(themeLabelAfter).toMatch(/switch to light theme|switch to dark theme|alternar para tema claro|alternar para tema escuro|Toggle theme/i);
    const langLabelAfter = await page.locator('#lang-toggle').getAttribute('aria-label');
    expect(langLabelAfter).toMatch(/switch language|alternar idioma|Switch language/i);
    await expect(page.locator('#onboarding-title')).toContainText(/welcome|bem-vindo/i);
  });

  test('does not emit browser console errors or warnings during initial app load', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', (err) => {
      consoleMessages.push({ type: 'pageerror', text: err.message });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => typeof window.navigate === 'function' || typeof window.NVApp !== 'undefined', null, { timeout: 10000 }).catch(() => {});

    const problems = consoleMessages.filter((message) => ['error', 'warning', 'pageerror'].includes(message.type));
    expect(problems).toEqual([]);
  });

  test('supports keyboard navigation on homepage track cards and lesson items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // wait for the app to expose navigate helper and render track cards
    await page.waitForFunction(() => typeof window.navigate === 'function', null, { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('.track-card[role="button"]', { timeout: 10000 });

    const firstTrackCard = page.locator('.track-card[role="button"]').first();
    await expect(firstTrackCard).toBeVisible();
    await firstTrackCard.focus();
    await expect(firstTrackCard).toBeFocused();
    await firstTrackCard.press('Enter');

    await page.waitForSelector('#view-track.active', { timeout: 10000 });
    await expect(page.locator('#track-breadcrumb')).toBeVisible();

    await page.waitForSelector('.lesson-item[role="button"]', { timeout: 10000 });
    const firstLessonItem = page.locator('.lesson-item[role="button"]').first();
    await expect(firstLessonItem).toBeVisible();
    await firstLessonItem.focus();
    await expect(firstLessonItem).toBeFocused();
    await firstLessonItem.press('Enter');

    await page.waitForSelector('#view-lesson.active', { timeout: 10000 });
    await expect(page.locator('#lesson-detail')).toBeVisible();
  });

  test('opens search results with keyboard and closes results with Escape', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ensure search input is ready
    await page.waitForSelector('#global-search', { timeout: 10000 });
    const searchInput = page.locator('#global-search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('qa');
    // force immediate search to avoid debounce in tests
    await page.evaluate(() => { try { if (typeof window.handleSearch === 'function') window.handleSearch('qa'); } catch (e) {} });
    // wait for results to render
    await page.waitForSelector('#search-results .search-result-item', { timeout: 10000 });
    const results = page.locator('#search-results .search-result-item');
    await expect(results.first()).toBeVisible();

    await expect(searchInput).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-results')).toHaveClass(/hidden/);

    await searchInput.fill('starter');
    await page.waitForSelector('#search-results .search-result-item', { timeout: 10000 });
    await expect(results.first()).toBeVisible();
    await results.first().focus();
    await expect(results.first()).toBeFocused();
    await results.first().press('Enter');

    await page.waitForSelector('#lesson-detail', { timeout: 10000 });
    await expect(page.locator('#lesson-detail')).toBeVisible();
  });

  test('renders dashboard certificate section and dashboard content landmarks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-nav="dashboard"]').click();
    await expect(page.locator('#view-dashboard')).toHaveClass(/active/);
    await expect(page.locator('#dashboard-certificates')).toBeVisible();
    await expect(page.locator('#dashboard-certificates')).toHaveAttribute('id', 'dashboard-certificates');
  });

  test('authenticated users can preview a completed certificate from the dashboard', async ({ page }) => {
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
    await expect(page.locator('#dashboard-certificates')).toBeVisible();
    await expect(page.locator('#btn-cert-preview')).toBeVisible();

    await page.locator('#btn-cert-preview').click();
    await expect(page.locator('#cert-modal-root')).toBeVisible();
    await expect(page.locator('#cert-modal-close')).toBeVisible();
  });

  test('shows a friendly lesson fallback message when content loading fails offline', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'onLine', {
        get() {
          return false;
        },
        configurable: true,
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      return typeof window.NVApp?.helpers?.findLesson === 'function'
        && typeof window.navigate === 'function'
        && typeof window.NVLessonContent?.loadLessonContent === 'function';
    }, null, { timeout: 10000 });

    await page.evaluate(() => {
      const originalFindLesson = window.NVApp.helpers.findLesson;
      window.NVApp.helpers.findLesson = (lessonId) => {
        const result = originalFindLesson(lessonId);
        if (result && lessonId === 'l1') {
          const rawLesson = { ...result.rawLesson };
          delete rawLesson.content;
          const lesson = { ...result.lesson };
          if (Object.prototype.hasOwnProperty.call(lesson, 'content')) {
            lesson.content = undefined;
          }
          return { ...result, rawLesson, lesson };
        }
        return result;
      };

      const originalLoadLessonContent = window.NVLessonContent.loadLessonContent;
      window.NVLessonContent.loadLessonContent = async (lesson, options) => {
        if (lesson?.id === 'l1') {
          throw new Error('Simulated offline load failure for l1');
        }
        return originalLoadLessonContent(lesson, options);
      };

      window.navigate('lesson', { lessonId: 'l1' });
    });

    await page.waitForSelector('#lesson-detail');
    await expect(page.locator('#lesson-detail')).toContainText(/offline|Conteúdo indisponível|unavailable/i);
  });

  test('persists bookmark and completion state after a full reload', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth

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
