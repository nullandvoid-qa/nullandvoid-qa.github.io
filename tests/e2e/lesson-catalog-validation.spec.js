// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Published lesson catalog', () => {
  test('renders every runtime lesson with a title and meaningful content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const lessonIds = await page.evaluate(() => {
      const tracks = [
        ...(Array.isArray(window.TG_QAWAY_TRACKS) ? window.TG_QAWAY_TRACKS : []),
        ...(window.TG_PERFORMANCE_TRACK ? [window.TG_PERFORMANCE_TRACK] : []),
      ];

      return [...new Set(
        tracks.flatMap((track) => (track.courses || [])
          .flatMap((course) => (course.lessons || []).map((lesson) => lesson.id))),
      )];
    });

    expect(lessonIds.length).toBeGreaterThanOrEqual(42);

    for (const lessonId of lessonIds) {
      await page.evaluate((id) => window.navigate('lesson', { lessonId: id }), lessonId);
      await expect(page.locator('#view-lesson')).toHaveClass(/active/);
      await expect(page.locator('#lesson-detail h1')).toBeVisible();
      await expect(page.locator('#lesson-detail')).not.toContainText('Esta lição não está disponível no momento.');
      await expect(page.locator('#lesson-detail')).toHaveText(/.{100}/s);
    }
  });
});