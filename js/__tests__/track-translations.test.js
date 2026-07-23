/**
 * Tests for track translation coverage.
 */

describe('Track translation coverage', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../data/tracks.js')];
    delete require.cache[require.resolve('../../data/translations-en.js')];
    require('../../data/tracks.js');
    require('../../data/translations-en.js');
  });

  test('all top-level track IDs have English translations', () => {
    const trackIds = Array.isArray(window.TG_QAWAY_TRACKS)
      ? window.TG_QAWAY_TRACKS.map((track) => track.id)
      : [];
    const translationIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.tracks
      ? Object.keys(window.TG_QAWAY_EN.tracks)
      : [];

    expect(trackIds).not.toHaveLength(0);
    trackIds.forEach((id) => {
      expect(translationIds).toContain(id);
    });
  });

  test('all English track IDs have Portuguese translation stubs', () => {
    const trackIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.tracks
      ? Object.keys(window.TG_QAWAY_EN.tracks)
      : [];
    const ptTranslations = require('../../data/translations-pt.json');
    const ptKeys = Object.keys(ptTranslations).filter((key) => key.startsWith('track.'));
    const ptTrackIds = [...new Set(ptKeys.map((key) => key.replace(/^track\./, '').replace(/\.(title|description)$/, '')))]

    expect(trackIds).not.toHaveLength(0);
    trackIds.forEach((id) => {
      expect(ptTrackIds).toContain(id);
    });
  });

  test('all English course IDs have Portuguese translation stubs', () => {
    const courseIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.courses
      ? Object.keys(window.TG_QAWAY_EN.courses)
      : [];
    const ptTranslations = require('../../data/translations-pt.json');
    const ptKeys = Object.keys(ptTranslations).filter((key) => key.startsWith('course.'));
    const ptCourseIds = [...new Set(ptKeys.map((key) => key.replace(/^course\./, '').replace(/\.title$/, '')))]

    expect(courseIds).not.toHaveLength(0);
    courseIds.forEach((id) => {
      expect(ptCourseIds).toContain(id);
    });
  });

  test('all extracted lesson IDs have Portuguese translation stubs', () => {
    const lessonIds = (window.TG_QAWAY_TRACKS || []).flatMap((track) =>
      (track.courses || []).flatMap((course) => (course.lessons || []).map((lesson) => lesson.id))
    );
    const ptTranslations = require('../../data/translations-pt.json');
    const ptKeys = Object.keys(ptTranslations).filter((key) => key.startsWith('lesson.'));
    const ptLessonIds = [...new Set(ptKeys.map((key) => key.replace(/^lesson\./, '').replace(/\.title$/, '')))]

    expect(lessonIds).not.toHaveLength(0);
    lessonIds.forEach((id) => {
      expect(ptLessonIds).toContain(id);
    });
  });
});
