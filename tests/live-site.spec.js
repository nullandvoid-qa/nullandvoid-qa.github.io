// @ts-check
const { test, expect } = require('@playwright/test');

const LIVE_URL = 'https://nullandvoid-qa.github.io';

async function waitForSiteReady(page) {
  await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Array.isArray(window.TG_QAWAY_TRACKS) && window.TG_QAWAY_TRACKS.length > 0, null, {
    timeout: 20000,
  });
}

async function navigateView(page, viewId) {
  await page.evaluate((viewId) => {
    if (typeof window.navigate === 'function') {
      window.navigate(viewId);
    }
  }, viewId);
  await page.waitForSelector(`#view-${viewId}.active`, { timeout: 15000 });
}

async function navigateTrack(page, trackId) {
  await page.evaluate((trackId) => {
    if (typeof window.navigate === 'function') {
      window.navigate('track', { trackId });
    }
  }, trackId);
  await page.waitForSelector('#view-track.active', { timeout: 15000 });
}

async function loadTrackMetadata(page, trackId) {
  return page.evaluate((trackId) => {
    const track = (window.TG_QAWAY_TRACKS || []).find((t) => t.id === trackId);
    const courses = Array.isArray(track?.courses) ? track.courses.map((course) => ({ id: course.id, title: course.title, lessons: (course.lessons || []).map((lesson) => lesson.id) })) : [];
    return { track, courses };
  }, trackId);
}

test.describe('Null and Void QA live website end-to-end', () => {
  test('homepage and main navigation are available on the live site', async ({ page }) => {
    await waitForSiteReady(page);

    await expect(page.locator('header .logo')).toBeVisible();
    await expect(page.locator('main .hero')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    await navigateView(page, 'tracks');
    await expect(page.locator('#view-tracks .track-card')).toHaveCount(await page.locator('#view-tracks .track-card').count());

    await navigateView(page, 'roadmap');
    await expect(page.locator('#view-roadmap .roadmap-card').first()).toBeVisible();

    await navigateView(page, 'glossary');
    await expect(page.locator('#view-glossary article').first()).toBeVisible();

    await navigateView(page, 'labs');
    await expect(page.locator('#view-labs .lab-card').first()).toBeVisible();

    await navigateView(page, 'dashboard');
    await expect(page.locator('#dashboard-stats')).toBeVisible();
  });

  test('all published tracks and modules load successfully', async ({ page }) => {
    await waitForSiteReady(page);

    const trackData = await page.evaluate(() => (window.TG_QAWAY_TRACKS || []).map((track) => ({ id: track.id, title: track.title })));
    expect(trackData.length).toBeGreaterThan(0);

    for (const track of trackData) {
      await navigateTrack(page, track.id);
      await expect(page.locator('#track-breadcrumb')).toContainText(track.title, { timeout: 15000 });

      const displayedTrackTitle = await page.locator('#track-breadcrumb').innerText();
      expect(displayedTrackTitle.toLowerCase()).toContain(track.title.toLowerCase().split(' ')[0]);

      const courseCards = page.locator('.course-card');
      await expect(courseCards).toHaveCount(await courseCards.count());
      expect(await courseCards.count()).toBeGreaterThan(0);

      const lessonItems = page.locator('.lesson-item');
      await expect(lessonItems).toHaveCount(await lessonItems.count());
      expect(await lessonItems.count()).toBeGreaterThan(0);

      const trackMeta = await loadTrackMetadata(page, track.id);
      expect(trackMeta.track).toBeTruthy();
      expect(trackMeta.courses.length).toBeGreaterThan(0);
      trackMeta.courses.forEach((course) => expect(course.lessons.length).toBeGreaterThan(0));
    }
  });

  test('certificate generation works for every published track', async ({ page }) => {
    await waitForSiteReady(page);

    const allTrackIds = await page.evaluate(() => (window.TG_QAWAY_TRACKS || []).map((track) => track.id));
    expect(allTrackIds.length).toBeGreaterThan(0);

    for (const trackId of allTrackIds) {
      const result = await page.evaluate(async (trackId) => {
        if (!window.TG_CERTIFICATES || typeof window.TG_CERTIFICATES.generateCertificate !== 'function') {
          return { error: 'certificate-api-missing' };
        }

        const payload = window.TG_CERTIFICATES.buildCertificatePayload(trackId, 'Live QA Tester', new Date('2026-07-23T10:00:00Z'));
        const blob = await window.TG_CERTIFICATES.generateCertificate(trackId, 'Live QA Tester', new Date('2026-07-23T10:00:00Z'));
        return {
          trackId,
          payloadExists: !!payload,
          courseName: payload?.course?.name || null,
          blobType: blob?.type || null,
          blobSize: blob?.size || (typeof blob === 'object' && blob !== null ? Object.keys(blob).length : 0),
          hasTextSignature: Array.isArray(window.lastPdf?.calls) ? window.lastPdf.calls.some((call) => call.text && call.text.includes('Live QA Tester')) : false,
        };
      }, trackId);

      expect(result.error).toBeUndefined();
      expect(result.payloadExists).toBe(true);
      expect(result.blobType).toBe('application/pdf');
      expect(result.blobSize).toBeGreaterThan(0);
      expect(result.hasTextSignature).toBe(true);
    }
  });
});
