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

  test('renderLesson displays load error content when content fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    window.NVApp.helpers.findLesson = () => ({
      track: { title: 'Track 1', icon: 'web' },
      course: { title: 'Course 1', id: 'course-1' },
      lesson: { title: 'Lesson 1', duration: '10 min' },
      rawTrack: { id: 'track-1', courses: [{ lessons: [{ id: 'lesson-1' }] }] },
      rawCourse: { id: 'course-1', title: 'Course 1' },
      rawLesson: { id: 'lesson-1', title: 'Lesson 1', duration: '10 min' },
    });
    window.NVLessonContent = {
      loadLessonContent: jest.fn(() => Promise.reject(new Error('Network failure'))),
    };
    window.NVApp.helpers.attachCopyButtons = jest.fn();

    await window.NVAppLesson.renderLesson('lesson-1');

    expect(document.getElementById('lesson-detail').innerHTML).toContain('Conteúdo indisponível no momento. Tente novamente mais tarde.');
    expect(window.NVLessonContent.loadLessonContent).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test('renderLesson shows offline state when browser is offline and content loading fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const offlineSpy = jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);

    window.NVApp.helpers.findLesson = () => ({
      track: { title: 'Track 1', icon: 'web' },
      course: { title: 'Course 1', id: 'course-1' },
      lesson: { title: 'Lesson 1', duration: '10 min' },
      rawTrack: { id: 'track-1', courses: [{ lessons: [{ id: 'lesson-1' }] }] },
      rawCourse: { id: 'course-1', title: 'Course 1' },
      rawLesson: { id: 'lesson-1', title: 'Lesson 1', duration: '10 min' },
    });
    window.NVLessonContent = {
      loadLessonContent: jest.fn(() => Promise.reject(new Error('Network failure'))),
    };
    window.NVApp.helpers.attachCopyButtons = jest.fn();

    await window.NVAppLesson.renderLesson('lesson-1');

    expect(document.getElementById('lesson-detail').innerHTML).toContain('Você está offline. Conecte-se à internet para carregar esta lição ou tente novamente mais tarde.');
    expect(window.NVLessonContent.loadLessonContent).toHaveBeenCalled();

    offlineSpy.mockRestore();
    consoleErrorSpy.mockRestore();
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
