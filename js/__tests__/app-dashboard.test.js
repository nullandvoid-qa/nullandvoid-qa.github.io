describe('app-dashboard fallback rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="dashboard-stats"></div>
      <div id="dashboard-tracks"></div>
      <div id="achievements-grid"></div>
      <div id="dashboard-bookmarks"></div>
      <div id="dashboard-certificates"></div>
      <div id="toast"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
        tracks: [{ id: 'web', title: 'Web Automation' }],
        achievementsList: [],
        bookmarks: [],
        quizzesPassed: {},
      },
      helpers: {
        getGlobalProgress: jest.fn(() => ({ done: 0, total: 0, pct: 0 })),
        renderTrackCard: jest.fn(),
        getTrackProgress: jest.fn(() => ({ pct: 0 })),
      },
    };

    window.loadJson = jest.fn(() => []);
    window.showToast = jest.fn();
    window.NVIcons = {};

    jest.resetModules();
    require('../app-dashboard.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.loadJson;
    delete window.showToast;
    delete window.NVIcons;
    delete window.NVAppDashboard;
    delete window.renderDashboard;
  });

  test('renderDashboard does not throw when view helpers are missing', async () => {
    await expect(window.NVAppDashboard.renderDashboard()).resolves.not.toThrow();
    expect(document.getElementById('dashboard-stats').innerHTML).toBe('');
    expect(window.NVApp.helpers.getGlobalProgress).toHaveBeenCalled();
  });

  test('renderAchievements falls back to empty html when helper markup is unavailable', () => {
    window.NVAppDashboard.renderAchievements();
    expect(document.getElementById('achievements-grid').innerHTML).toBe('');
  });
});
