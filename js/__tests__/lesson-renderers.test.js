describe('lesson renderers', () => {
  test('buildLessonBodyHtml preserves prebuilt primer and senior markup', () => {
    const { buildLessonBodyHtml } = require('../lesson-renderers.js');

    const html = buildLessonBodyHtml({
      lesson: { title: 'Lesson', duration: '5 min', content: '<p>Body</p>' },
      processedContent: '<p>Body</p>',
      primerHtml: '<aside class="lesson-box lesson-box-beginner"><h3>Primer</h3></aside>',
      seniorHtml: '<aside class="lesson-box lesson-box-senior"><h3>Senior note</h3></aside>',
      rawLesson: { id: 'lesson-1', resources: [] },
      rawTrack: {},
      rawCourse: {},
      done: false,
      isBookmarked: false,
      prev: null,
      next: null,
      lang: 'pt',
      t: (key) => key,
      tierLabel: (tier) => tier,
      escapeHtml: (value) => String(value),
      icons: null,
      getTrackIcon: () => 'book',
      getEnrichment: () => ({}),
    });

    expect(html).toContain('lesson-box-beginner');
    expect(html).toContain('lesson-box-senior');
    expect(html).toContain('lesson-body');
  });

  test('buildLessonFeedbackHtml renders the feedback form shell', () => {
    const { buildLessonFeedbackHtml } = require('../lesson-renderers.js');

    const html = buildLessonFeedbackHtml('pt', null, (key) => key);

    expect(html).toContain('lesson-feedback-form');
    expect(html).toContain('feedback-rating');
    expect(html).toContain('feedback-text');
  });
});
