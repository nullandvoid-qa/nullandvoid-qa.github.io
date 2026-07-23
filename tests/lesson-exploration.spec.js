// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lesson exploration coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('opens every lesson one by one, checks the content, and verifies the lesson actions', async ({ page }) => {
    // (guest sign-in removed) continue without local guest auth

    const lessons = await page.evaluate(() => {
      const normalizeTrack = (track, fallbackId) => ({
        id: track?.id || fallbackId,
        title: track?.title || fallbackId,
        courses: Array.isArray(track?.courses) ? track.courses : [],
      });

      const collected = [];
      const addTrack = (track, fallbackId) => {
        const normalized = normalizeTrack(track, fallbackId);
        normalized.courses.forEach((course) => {
          (course?.lessons || []).forEach((lesson) => {
            collected.push({
              trackId: normalized.id,
              trackTitle: normalized.title,
              courseId: course?.id || '',
              courseTitle: course?.title || '',
              lessonId: lesson?.id || '',
              lessonTitle: lesson?.title || '',
            });
          });
        });
      };

      const mainTracks = window.TG_QAWAY_TRACKS || [];
      mainTracks.forEach((track) => addTrack(track, 'track'));

      if (window.TG_PERFORMANCE_TRACK?.courses) {
        addTrack({
          id: 'performance',
          title: window.TG_PERFORMANCE_TRACK.title || 'Performance',
          courses: window.TG_PERFORMANCE_TRACK.courses,
        }, 'performance');
      }

      if (window.TG_MENTORSHIP?.courses) {
        addTrack({
          id: 'mentorship',
          title: window.TG_MENTORSHIP.title || 'Mentorship',
          courses: window.TG_MENTORSHIP.courses,
        }, 'mentorship');
      }

      if (Array.isArray(window.TG_MOBILE_LABS)) {
        window.TG_MOBILE_LABS.forEach((lab) => {
          addTrack({
            id: lab.id,
            title: lab.title || lab.name || lab.id,
            courses: lab.courses || [],
          }, lab.id);
        });
      }

      return collected;
    });

    expect(lessons.length).toBeGreaterThan(0);

    for (const lesson of lessons) {
      await page.evaluate((lessonId) => window.navigate('lesson', { lessonId }), lesson.lessonId);
      await page.waitForSelector('#lesson-detail', { timeout: 10000 });
      await expect(page.locator('#lesson-detail')).toContainText(lesson.lessonTitle);
      await expect(page.locator('#lesson-detail .lesson-body')).not.toBeEmpty();
      await expect(page.locator('#btn-bookmark')).toBeVisible();
      await expect(page.locator('#btn-complete')).toBeVisible();

      await page.locator('#btn-bookmark').click();
      await page.waitForTimeout(150);
      await expect(page.locator('.btn-bookmark.bookmarked')).toBeVisible();

      await page.locator('#btn-complete').click();
      await page.waitForTimeout(150);
      await expect(page.locator('#btn-complete')).toContainText(/não concluída|incomplete|unmark|unmarkComplete/i);
    }
  });
});
