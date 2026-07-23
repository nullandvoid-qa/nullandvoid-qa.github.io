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

  test('all actual track IDs have English translations', () => {
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

  test('all actual course IDs have English translation entries via legacy mapping', () => {
    const actualCourseIds = (window.TG_QAWAY_TRACKS || []).flatMap((track) =>
      (track.courses || []).map((course) => course.id)
    );
    const translationIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.courses
      ? Object.keys(window.TG_QAWAY_EN.courses)
      : [];

    expect(actualCourseIds).not.toHaveLength(0);
    actualCourseIds.forEach((courseId) => {
      const expectedId = `s${courseId.replace(/^c/, '')}`;
      expect(translationIds).toContain(expectedId);
    });
  });

  test('all actual lesson IDs have enough English lesson entries for their course', () => {
    const courseLessons = (window.TG_QAWAY_TRACKS || []).flatMap((track) =>
      (track.courses || []).map((course) => ({
        courseId: course.id,
        lessonCount: (course.lessons || []).length,
      }))
    );
    const translationIds = window.TG_QAWAY_EN && window.TG_QAWAY_EN.lessons
      ? Object.keys(window.TG_QAWAY_EN.lessons)
      : [];

    expect(courseLessons).not.toHaveLength(0);
    courseLessons.forEach(({ courseId, lessonCount }) => {
      const suffix = courseId.replace(/^c/, 's');
      for (let index = 1; index <= lessonCount; index += 1) {
        expect(translationIds).toContain(`${suffix}-l${index}`);
      }
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

  // The EN overlay still uses legacy course and lesson IDs (s1, s1-l1, etc.).
  // The app runtime maps current IDs to these legacy English entries for compatibility.

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
