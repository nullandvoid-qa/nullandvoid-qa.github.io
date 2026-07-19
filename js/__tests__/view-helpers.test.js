describe('view helpers', () => {
  test('wireFilterBar attaches a callback for each filter selection', () => {
    const { wireFilterBar } = require('../view-helpers.js');

    const buttonListeners = {};
    const buttons = ['all', 'beginner', 'senior'].map((filter) => ({
      dataset: { filter },
      addEventListener: jest.fn((event, callback) => {
        buttonListeners[filter] = callback;
      }),
    }));

    const container = {
      innerHTML: '',
      querySelectorAll: jest.fn(() => buttons),
    };

    const selected = [];
    wireFilterBar(container, ['all', 'beginner', 'senior'], 'all', () => {}, (next) => {
      selected.push(next);
    });

    buttonListeners.beginner({});

    expect(selected).toEqual(['beginner']);
    expect(container.innerHTML).toContain('filter-chip');
  });

  test('bindAccessibleAction wires click and keyboard activation', () => {
    const { bindAccessibleAction } = require('../view-helpers.js');

    const listeners = {};
    const element = {
      addEventListener: jest.fn((event, callback) => {
        listeners[event] = callback;
      }),
    };

    const calls = [];
    bindAccessibleAction(element, () => calls.push('open'));

    const keyEvent = { type: 'keydown', key: 'Enter', preventDefault: jest.fn() };
    listeners.click({ type: 'click' });
    listeners.keydown(keyEvent);

    expect(calls).toEqual(['open', 'open']);
    expect(keyEvent.preventDefault).toHaveBeenCalled();
  });

  test('setActiveView toggles the active view and nav state', () => {
    const { setActiveView } = require('../view-helpers.js');

    const viewEl = { classList: { add: jest.fn(), remove: jest.fn() } };
    const navEl = { dataset: { nav: 'tracks' }, classList: { toggle: jest.fn() } };
    const views = [{ classList: { add: jest.fn(), remove: jest.fn() } }, viewEl];
    const documentStub = {
      querySelectorAll: jest.fn((selector) => {
        if (selector === '.view') return views;
        if (selector === '.nav-links a[data-nav]') return [navEl];
        return [];
      }),
      getElementById: jest.fn((id) => (id === 'view-home' ? viewEl : null)),
    };

    setActiveView(documentStub, 'home', 'tracks');

    expect(viewEl.classList.add).toHaveBeenCalledWith('active');
    expect(navEl.classList.toggle).toHaveBeenCalled();
  });

  test('buildTrackCardHtml includes progress, title and topic tags', () => {
    const { buildTrackCardHtml } = require('../view-helpers.js');

    const html = buildTrackCardHtml(
      {
        id: 'web',
        title: 'Web',
        description: 'Test description',
        color: '#123456',
        icon: 'web',
        topics: ['API', 'UI'],
      },
      {
        prog: { pct: 50, done: 2, total: 4 },
        audience: 'intermediate',
        isComplete: false,
        title: 'Web',
        iconHtml: '<span>icon</span>',
        lang: 'pt',
        icons: { get: () => '' },
        escapeHtml: (value) => String(value),
        t: (key) => key,
        tierLabel: (value) => value,
      },
    );

    expect(html).toContain('track-card');
    expect(html).toContain('Web');
    expect(html).toContain('API');
    expect(html).toContain('50');
  });

  test('buildTrackDetailHtml includes hero markup and course list', () => {
    const { buildTrackDetailHtml } = require('../view-helpers.js');

    const html = buildTrackDetailHtml(
      { id: 'web', title: 'Web', description: 'Desc', color: '#123456', icon: 'web' },
      '<div class="course-list"><div class="course-block">Course</div></div>',
      '<button id="btn-take-quiz">Quiz</button>',
      { pct: 50, done: 2, total: 4 },
      { modules: 3, hours: 4, audience: 'intermediate' },
      { icons: { get: () => '' }, escapeHtml: (value) => String(value), t: (key) => key, tierLabel: (value) => value, getTrackIcon: () => 'web' },
    );

    expect(html).toContain('track-hero');
    expect(html).toContain('course-list');
    expect(html).toContain('btn-take-quiz');
  });

  test('buildDashboardStatsHtml and buildBookmarksHtml render dashboard content', () => {
    const { buildDashboardStatsHtml, buildBookmarksHtml } = require('../view-helpers.js');

    const stats = buildDashboardStatsHtml({ done: 3, total: 6, pct: 50, passedCount: 2 }, { price: '$10' }, () => 'label', (key) => key);
    const bookmarks = buildBookmarksHtml([
      { lessonId: 'lesson-1', title: 'Intro', trackTitle: 'Web' },
    ], { get: () => '' }, (value) => String(value), 'web');

    expect(stats).toContain('dash-card');
    expect(bookmarks).toContain('search-result-item');
    expect(bookmarks).toContain('Intro');
  });

  test('renderContinueBanner renders a richer resume card with a primary action', () => {
    const { renderContinueBanner } = require('../view-helpers.js');

    localStorage.setItem('resume-test', 'lesson-1');
    const banner = { classList: { add: jest.fn(), remove: jest.fn() }, innerHTML: '' };
    const navigate = jest.fn();
    const findLesson = jest.fn(() => ({
      lesson: { title: 'Introdução ao QA' },
      track: { title: 'Fundamentos', icon: 'web' },
    }));

    renderContinueBanner(
      banner,
      { id: 'lesson-1' },
      findLesson,
      () => 'web',
      (value) => String(value),
      (key) => key,
      navigate,
      { get: () => '' },
      'resume-test',
    );

    expect(banner.classList.remove).toHaveBeenCalledWith('hidden');
    expect(banner.innerHTML).toContain('continue-card');
    expect(banner.innerHTML).toContain('continue-actions');
    expect(banner.innerHTML).toContain('btn-continue');
  });

  test('buildGlossaryHtml and buildLabsHtml render their sections', () => {
    const { buildGlossaryHtml, buildLabsHtml } = require('../view-helpers.js');

    const glossary = buildGlossaryHtml([
      { term: 'API', def: 'Application Programming Interface' },
    ], (value) => String(value));
    const labs = buildLabsHtml([
      { name: 'Lab one', desc: 'Example', type: 'Web', url: 'https://example.com', tracks: ['web'] },
    ], { web: { title: 'Web', icon: 'web' } }, { get: () => '' }, (value) => String(value), () => 'web', 'pt');

    expect(glossary).toContain('glossary-card');
    expect(glossary).toContain('API');
    expect(labs).toContain('lab-card');
    expect(labs).toContain('Lab one');
  });

  test('buildQuizResultHtml renders pass and fail states', () => {
    const { buildQuizResultHtml, buildLessonQuizResultHtml } = require('../view-helpers.js');

    const quizResult = buildQuizResultHtml(true, 2, 2, { get: () => '' }, (key) => key, 'pt');
    const lessonResult = buildLessonQuizResultHtml(true, 2, 2, { get: () => '' }, (key) => key, 'pt');

    expect(quizResult).toContain('quiz-result-title');
    expect(lessonResult).toContain('lesson-quiz-result');
  });

  test('buildRoadmapHtml renders roadmap cards and actions', () => {
    const { buildRoadmapHtml } = require('../view-helpers.js');

    const html = buildRoadmapHtml(
      {
        beginner: {
          pt: {
            title: 'Comece aqui',
            desc: 'Descrição',
            steps: [{ label: 'Primeiro passo', why: 'Porque sim', trackId: 'web' }],
          },
        },
      },
      'pt',
      (key) => key,
      (value) => String(value),
    );

    expect(html).toContain('roadmap-card');
    expect(html).toContain('roadmap-go');
    expect(html).toContain('Primeiro passo');
  });

  test('buildEmptyStateHtml renders a message with the empty-state class', () => {
    const { buildEmptyStateHtml } = require('../view-helpers.js');

    const html = buildEmptyStateHtml('No labs available.', 'compact', (value) => String(value));

    expect(html).toContain('empty-state');
    expect(html).toContain('compact');
    expect(html).toContain('No labs available.');
  });

  test('buildDashboardEmptyStateHtml and buildSearchEmptyStateHtml render their sections', () => {
    const { buildDashboardEmptyStateHtml, buildSearchEmptyStateHtml } = require('../view-helpers.js');

    const dashboard = buildDashboardEmptyStateHtml('No bookmarks yet.', (value) => String(value));
    const search = buildSearchEmptyStateHtml('No results', (value) => String(value));

    expect(dashboard).toContain('empty-state');
    expect(dashboard).toContain('No bookmarks yet.');
    expect(search).toContain('search-empty');
    expect(search).toContain('No results');
  });

  test('bindTrackQuizHandlers wires quiz submission, result rendering and retry', () => {
    const { bindTrackQuizHandlers } = require('../view-helpers.js');
    const quizData = {
      questions: [
        { q: 'Q1', options: ['A', 'B'], correct: 1, explain: 'Explain', passScore: 1 },
      ],
      passScore: 1,
    };

    let changeHandler;
    let submitHandler;
    const resultEl = { className: '', innerHTML: '', classList: { remove: jest.fn(), add: jest.fn() } };
    const radio = {
      name: 'q0',
      value: '1',
      addEventListener: jest.fn((event, cb) => {
        if (event === 'change') changeHandler = cb;
      }),
      closest: jest.fn(() => ({ dataset: { qi: '0' } })),
    };
    const quizOption = { dataset: { oi: '1' }, classList: { add: jest.fn() } };
    const form = {
      addEventListener: jest.fn((event, cb) => {
        if (event === 'submit') submitHandler = cb;
      }),
      querySelectorAll: jest.fn((selector) => (selector === 'input[type=radio]' ? [radio] : [])),
    };

    const container = {
      querySelector: jest.fn((selector) => {
        if (selector === '#quiz-form') return form;
        if (selector === '#btn-quiz-back') return { addEventListener: jest.fn() };
        if (selector === '#quiz-result') return resultEl;
        if (selector === '.quiz-question[data-qi="0"]') return { querySelectorAll: jest.fn(() => [quizOption]) };
        return null;
      }),
      querySelectorAll: jest.fn(() => [radio]),
    };

    const passedCallback = jest.fn();
    const retryCallback = jest.fn();

    bindTrackQuizHandlers(
      container,
      quizData,
      { get: () => '' },
      'pt',
      (key) => key,
      () => {},
      retryCallback,
      passedCallback,
    );

    changeHandler();
    submitHandler({ preventDefault: jest.fn() });

    expect(resultEl.innerHTML).toContain('quiz-result');
    expect(passedCallback).toHaveBeenCalledWith(1);
  });

  test('bindLessonPageActions wires lesson buttons and feedback submit', () => {
    const { bindLessonPageActions } = require('../view-helpers.js');
    const lessonId = 'lesson-1';
    const rawLesson = { id: lessonId };
    const onBookmarkToggle = jest.fn();
    const onCompleteToggle = jest.fn();
    const onReRender = jest.fn();
    const onFeedbackSubmit = jest.fn();

    document.body.innerHTML = `
      <button id="btn-bookmark"></button>
      <button id="btn-complete"></button>
      <button id="btn-prev"></button>
      <button id="btn-next"></button>
      <button id="btn-feedback"></button>
      <div id="lesson-feedback-form" style="display:none"></div>
      <button id="btn-feedback-submit"></button>
      <button id="btn-feedback-cancel"></button>
      <input name="feedback-rating" type="radio" value="5" checked />
      <textarea id="feedback-text">Great</textarea>
      <div class="sidebar-lesson" data-lesson="lesson-2"></div>
    `;

    bindLessonPageActions({
      lessonId,
      rawLesson,
      prevLessonId: 'lesson-0',
      nextLessonId: 'lesson-2',
      navigate: jest.fn(),
      onBookmarkToggle,
      onCompleteToggle,
      onReRender,
      onFeedbackSubmit,
      t: (key) => key,
    });

    document.getElementById('btn-bookmark').click();
    document.getElementById('btn-complete').click();
    document.getElementById('btn-feedback').click();
    document.getElementById('btn-feedback-submit').click();
    document.getElementById('btn-feedback-cancel').click();

    expect(onBookmarkToggle).toHaveBeenCalledWith(lessonId);
    expect(onCompleteToggle).toHaveBeenCalledWith(lessonId);
    expect(onReRender).toHaveBeenCalledWith(lessonId);
    expect(onFeedbackSubmit).toHaveBeenCalledWith({ lessonId, rating: '5', text: 'Great' });
  });

  test('buildDashboardBookmarksSectionHtml renders empty state when no bookmarks exist', () => {
    const { buildDashboardBookmarksSectionHtml } = require('../view-helpers.js');

    const html = buildDashboardBookmarksSectionHtml(
      [],
      () => null,
      { get: () => '' },
      (value) => String(value),
      () => 'bookmark',
      'Nenhuma aula favoritada ainda.',
    );

    expect(html).toContain('Nenhuma aula favoritada ainda.');
    expect(html).toContain('dashboard-empty-state');
  });

  test('buildDashboardBookmarksSectionHtml renders bookmark buttons when lessons exist', () => {
    const { buildDashboardBookmarksSectionHtml } = require('../view-helpers.js');

    const html = buildDashboardBookmarksSectionHtml(
      ['lesson-1'],
      (_lessonId) => ({ lesson: { title: 'Intro' }, track: { title: 'Web' } }),
      { get: () => '' },
      (value) => String(value),
      () => 'bookmark',
      'Nenhuma aula favoritada ainda.',
    );

    expect(html).toContain('data-lesson="lesson-1"');
    expect(html).toContain('Intro');
    expect(html).toContain('Web');
  });

  test('buildDashboardCertificatesSectionHtml renders a certificate preview example', () => {
    const { buildDashboardCertificatesSectionHtml } = require('../view-helpers.js');

    const html = buildDashboardCertificatesSectionHtml(
      [],
      [],
      (track) => track,
      { get: () => '' },
      'pt',
      (value) => String(value),
      'Conclua uma trilha para ganhar um certificado.',
    );

    expect(html).toContain('cert-preview');
    expect(html).toContain('Exemplo');
    expect(html).toContain('CERTIFICATE OF COMPLETION');
  });

  test('buildDashboardCertificatesSectionHtml renders empty state when no completed tracks exist', () => {
    const { buildDashboardCertificatesSectionHtml } = require('../view-helpers.js');

    const html = buildDashboardCertificatesSectionHtml(
      [],
      [],
      (track) => track,
      { get: () => '' },
      'pt',
      (value) => String(value),
      'Conclua uma trilha para ganhar um certificado.',
    );

    expect(html).toContain('Conclua uma trilha para ganhar um certificado.');
    expect(html).toContain('dashboard-empty-state');
  });

  test('buildDashboardCertificatesSectionHtml renders certificate cards when tracks exist', () => {
    const { buildDashboardCertificatesSectionHtml } = require('../view-helpers.js');

    const html = buildDashboardCertificatesSectionHtml(
      [{ id: 'web', title: 'Web', icon: 'web' }],
      [{ trackId: 'web', generatedAt: '2025-01-01' }],
      (track) => track,
      { get: () => '' },
      'pt',
      (value) => String(value),
      'Conclua uma trilha para ganhar um certificado.',
    );

    expect(html).toContain('cert-card');
    expect(html).toContain('Web');
    expect(html).toContain('Baixar');
  });

  test('buildAchievementsHtml renders unlocked and locked achievements', () => {
    const { buildAchievementsHtml } = require('../view-helpers.js');

    const achievementsList = [
      { id: 'first', pt: { title: 'Primeiro', desc: 'Desc' }, en: { title: 'First', desc: 'Desc' }, icon: '★' },
      { id: 'second', pt: { title: 'Segundo', desc: 'Desc2' }, en: { title: 'Second', desc: 'Desc2' }, icon: '☆' },
    ];

    const html = buildAchievementsHtml(
      achievementsList,
      ['first'],
      'pt',
      (value) => String(value),
      { get: () => '' },
      (key) => key,
    );

    expect(html).toContain('achievement-card unlocked');
    expect(html).toContain('achievement-card locked');
    expect(html).toContain('Primeiro');
    expect(html).toContain('???');
  });

  test('bindDashboardBookmarkHandlers attaches lesson navigation callbacks', () => {
    const { bindDashboardBookmarkHandlers } = require('../view-helpers.js');
    const navigate = jest.fn();

    document.body.innerHTML = `
      <button data-lesson="lesson-1"></button>
      <button data-lesson="lesson-2"></button>
    `;

    const container = document.body;
    bindDashboardBookmarkHandlers(container, navigate);

    container.querySelectorAll('[data-lesson]').forEach((btn) => btn.click());

    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalledWith('lesson', { lessonId: 'lesson-1' });
    expect(navigate).toHaveBeenCalledWith('lesson', { lessonId: 'lesson-2' });
  });

  test('bindDashboardCertificateHandlers calls onDownload with track ids', () => {
    const { bindDashboardCertificateHandlers } = require('../view-helpers.js');
    const onDownload = jest.fn();

    window.NVAuth = {
      isAuthenticated: true,
      getUserName: () => 'Test User',
    };

    document.body.innerHTML = `
      <button id="btn-cert-a" data-track="a"></button>
      <button id="btn-cert-b" data-track="b"></button>
    `;

    const container = document.body;
    bindDashboardCertificateHandlers(container, onDownload);

    container.querySelector('#btn-cert-a').click();
    container.querySelector('#btn-cert-b').click();

    expect(onDownload).toHaveBeenCalledTimes(2);
    expect(onDownload).toHaveBeenCalledWith('a');
    expect(onDownload).toHaveBeenCalledWith('b');
  });

  test('buildTrackCoursesHtml renders lesson lists and course sections', () => {
    const { buildTrackCoursesHtml } = require('../view-helpers.js');

    const html = buildTrackCoursesHtml(
      {
        courses: [
          {
            id: 'c1',
            title: 'Course One',
            lessons: [{ id: 'l1', title: 'Intro', duration: '5 min' }],
          },
        ],
      },
      { l1: true },
      () => ({ tier: 'intermediate' }),
      (lesson) => lesson,
      (course) => course,
      (value) => value,
      (key) => key,
      { get: () => '' },
      (value) => String(value),
    );

    expect(html).toContain('course-block');
    expect(html).toContain('lesson-list');
    expect(html).toContain('Intro');
  });
});
