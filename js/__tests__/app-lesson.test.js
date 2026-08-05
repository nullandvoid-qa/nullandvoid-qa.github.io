describe('app-lesson fallback renderers', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="lesson-detail"></div>
      <div id="lesson-checklist-zone"></div>
      <div id="lesson-quiz-zone"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
        bookmarks: [],
        progress: {},
        checklistState: {},
        seniorMode: false,
      },
      helpers: {
        findLesson: () => null,
        getEnrichment: jest.fn(() => ({})),
        getTrackIcon: jest.fn(),
        navigate: jest.fn(),
        saveLastLesson: jest.fn(),
        toggleBookmark: jest.fn(),
        saveProgress: jest.fn(),
        checkAchievements: jest.fn(),
      },
    };

    window.TG_CHECKLISTS = {};
    window.TG_LESSON_QUIZZES = {};
    window.saveJson = jest.fn();
    window.NVViewHelpers = {
      buildChecklistHtml: jest.fn(() => ''),
      bindChecklistHandlers: jest.fn(),
    };

    jest.resetModules();
    require('../app-lesson.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.TG_CHECKLISTS;
    delete window.TG_LESSON_QUIZZES;
    delete window.saveJson;
    delete window.NVAppLesson;
    delete window.renderLesson;
  });

  test('renderLesson renders empty state when lesson is not found', async () => {
    await window.NVAppLesson.renderLesson('missing-lesson');
    expect(document.getElementById('lesson-detail').innerHTML).toContain('Esta lição não está disponível no momento.');
  });

  test('renderChecklist does not throw when checklist helpers are missing', () => {
    expect(() => window.NVAppLesson.renderChecklist('track-1', document.getElementById('lesson-checklist-zone'))).not.toThrow();
    expect(document.getElementById('lesson-checklist-zone').innerHTML).toBe('');
  });

  test('renderChecklist saves checklist state with a safe fallback when the handler uses the callback', () => {
    const htmlContainer = document.getElementById('lesson-checklist-zone');
    window.TG_CHECKLISTS = {
      'track-1': {
        pt: [{ id: 'item1', title: 'Item 1' }],
      },
    };
    window.NVViewHelpers.buildChecklistHtml = jest.fn(() => '<div>checklist</div>');
    window.NVViewHelpers.bindChecklistHandlers = jest.fn((container, trackId, data, state, t, onSave) => {
      if (typeof onSave === 'function') {
        onSave({ completed: ['item1'] });
      }
    });

    window.NVAppLesson.renderChecklist('track-1', htmlContainer);

    expect(window.saveJson).toHaveBeenCalledWith('testers-guild-checklists', { completed: ['item1'] });
    expect(htmlContainer.innerHTML).toContain('checklist');
  });
});
