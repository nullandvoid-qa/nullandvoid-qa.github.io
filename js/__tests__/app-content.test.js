describe('app-content renderers', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="glossary-content"></div>
      <div id="labs-content"></div>
      <div id="sandbox-menu"></div>
      <div id="sandbox-example"></div>
      <div id="quiz-content"></div>
      <div id="quiz-breadcrumb"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
        tracks: [{ id: 'track-1', icon: 'icon' }],
        quizzesPassed: {},
      },
      helpers: {
        localizedTrack: (track) => track,
        getTrackIcon: () => 'icon',
        quizzes: {
          'track-1': {
            pt: {
              questions: [],
              passScore: 1,
            },
          },
        },
      },
    };

    window.NVViewHelpers = {
      buildGlossaryHtml: jest.fn(() => 'glossary-markup'),
      buildEmptyStateHtml: jest.fn(() => 'empty-state'),
      buildLabsHtml: jest.fn(() => 'labs-markup'),
      buildTrackQuizHtml: jest.fn(() => 'quiz-markup'),
      bindTrackQuizHandlers: jest.fn(),
    };

    window.NVIcons = {};
    window.escapeHtml = (value) => String(value);
    window.t = (key) => key;
    window.showToast = jest.fn();
    window.navigate = jest.fn();
    window.setStoredItem = jest.fn();
    window.TG_GLOSSARY = {
      pt: [{ term: 'Glossário', def: 'Definição' }],
    };
    window.TG_LABS = {
      pt: [{ id: 'lab-1', name: 'Lab 1' }],
    };
    window.TG_MOBILE_AUTOMATION_EXAMPLES = [{ name: 'Example', code: 'console.log(1)' }];

    jest.resetModules();
    require('../app-content.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.NVViewHelpers;
    delete window.NVIcons;
    delete window.escapeHtml;
    delete window.t;
    delete window.showToast;
    delete window.navigate;
    delete window.TG_GLOSSARY;
    delete window.TG_LABS;
    delete window.TG_MOBILE_AUTOMATION_EXAMPLES;
    delete window.NVAppContent;
    delete window.renderGlossary;
    delete window.renderLabs;
    delete window.renderSandbox;
    delete window.renderQuiz;
  });

  test('renderGlossary uses the shared view helper to render content', () => {
    window.NVAppContent.renderGlossary();

    expect(window.NVViewHelpers.buildGlossaryHtml).toHaveBeenCalled();
    expect(document.getElementById('glossary-content').innerHTML).toBe('glossary-markup');
  });

  test('renderQuiz builds the quiz shell and wires handlers', () => {
    window.NVAppContent.renderQuiz('track-1');

    expect(window.NVViewHelpers.buildTrackQuizHtml).toHaveBeenCalled();
    expect(window.NVViewHelpers.bindTrackQuizHandlers).toHaveBeenCalled();
    expect(document.getElementById('quiz-content').innerHTML).toBe('quiz-markup');
  });

  test('renderQuiz persists quiz state through helper storage when available', () => {
    let passedCallback;
    window.NVViewHelpers.bindTrackQuizHandlers = jest.fn((container, _quizData, icons, lang, t, onBack, onRetry, onPassed) => {
      passedCallback = onPassed;
    });

    window.NVAppContent.renderQuiz('track-1');
    expect(window.NVViewHelpers.bindTrackQuizHandlers).toHaveBeenCalled();

    passedCallback?.(1);

    expect(window.NVApp.state.quizzesPassed['track-1']).toBeDefined();
    expect(window.setStoredItem).toHaveBeenCalledWith(
      'testers-guild-quizzes',
      JSON.stringify(window.NVApp.state.quizzesPassed),
    );
    expect(window.showToast).toHaveBeenCalled();
  });
});
