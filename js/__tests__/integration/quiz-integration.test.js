beforeEach(() => {
  // Clean environment
  jest.resetModules();
  localStorage.clear();
  document.body.innerHTML = '<div id="quiz-breadcrumb"></div><div id="quiz-content"></div>';
  if (typeof window === 'undefined') global.window = {};
  window.NVApp = window.NVApp || {};
  window.NVApp.state = { lang: 'pt', tracks: [{ id: 'track-1', title: 'Track 1', icon: '' }], quizzesPassed: {} };
  window.NVApp.helpers = window.NVApp.helpers || {};
  window.NVApp.helpers.localizedTrack = (track) => ({ title: track.title });

  // Minimal quiz fixture
  const quizData = {
    questions: [
      { title: 'Q1', options: ['A', 'B'], answer: 0 }
    ],
    passScore: 1
  };

  window.NVApp.helpers.quizzes = { 'track-1': { pt: quizData } };

  // Stub NVViewHelpers.buildTrackQuizHtml and bindTrackQuizHandlers
  window.NVViewHelpers = {
    buildTrackQuizHtml: (track, quizData) => {
      // render a simple submit button and radio inputs
      return `<form id="quiz-form"><div class="quiz-question" data-qi="0"><label><input type="radio" name="q0" value="0" checked> A</label><label><input type="radio" name="q0" value="1"> B</label></div><button type="button" id="quiz-submit">Submit</button></form>`;
    },
    bindTrackQuizHandlers: (container, quizData, icons, lang, t, onBack, onRetry, onPassed) => {
      const submit = container.querySelector('#quiz-submit');
      if (submit) {
        submit.addEventListener('click', () => {
          // simulate calculating score equal to passScore
          onPassed(quizData.passScore);
        });
      }
    }
  };

  // stub utilities
  window.NVIcons = { get: () => '' };
  window.t = (k) => k;
  window.escapeHtml = (s) => s;
  window.showToast = () => {};
  window.checkAchievements = () => {};
});

test('renderQuiz persists quiz pass to localStorage and state', () => {
  // load app-content which defines renderQuiz
  require('../../app-content.js');

  // call renderQuiz
  window.renderQuiz('track-1');

  // simulate user submit
  const submit = document.getElementById('quiz-submit');
  expect(submit).not.toBeNull();
  submit.click();

  // assert localStorage and state updated
  const stored = JSON.parse(localStorage.getItem('testers-guild-quizzes') || '{}');
  expect(stored['track-1']).toBeDefined();
  expect(window.NVApp.state.quizzesPassed['track-1']).toBeDefined();
});
