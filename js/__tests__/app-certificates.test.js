/**
 * Tests for certificate download integration with user name fallback.
 */

describe('Certificate download integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div id="dashboard-stats"></div>
      <div id="dashboard-tracks"></div>
      <div id="achievements-grid"></div>
      <div id="dashboard-bookmarks"></div>
      <div id="dashboard-certificates"></div>
      <div id="toast"></div>
    `;

    window.showToast = jest.fn();
    window.TG_CERTIFICATES = {
      downloadCertificate: jest.fn().mockResolvedValue(true),
      saveCertificate: jest.fn(),
      getUserCertificates: jest.fn().mockReturnValue([]),
    };

    window.NVAuth = {
      user: null,
      isAuthenticated: false,
      getUserName: () => null,
    };

    window.NVApp = {
      state: {
        lang: 'pt',
        tracks: [{ id: 'web', title: 'Web Automation' }],
        achievementsList: [],
        bookmarks: [],
        quizzesPassed: {},
      },
      helpers: {
        getGlobalProgress: () => ({ done: 0, total: 0, pct: 100 }),
        renderAchievements: jest.fn(),
        renderTrackCard: jest.fn(),
        getTrackProgress: () => ({ pct: 100 }),
        findLesson: jest.fn(),
        getTrackIcon: jest.fn(),
        navigate: jest.fn(),
        t: (key) => key,
      },
    };

    window.loadJson = jest.fn(() => []);
    window.NVViewHelpers = {
      buildDashboardStatsHtml: jest.fn(() => ''),
      renderDashboardSections: jest.fn((targets, opts) => {
        opts.onCertDownload('web');
      }),
      buildPortfolioTemplatesHtml: jest.fn(() => ''),
    };

    delete require.cache[require.resolve('../app-dashboard.js')];
    require('../app-dashboard.js');
  });

  test('downloadCertificate is called with blank name when user is not logged in', async () => {
    await window.NVAppDashboard.renderDashboard();

    expect(window.TG_CERTIFICATES.downloadCertificate).toHaveBeenCalledWith('web', '', expect.any(Date));
    expect(window.TG_CERTIFICATES.saveCertificate).toHaveBeenCalledWith('web', '', expect.any(Date));
  });

  test('downloadCertificate is called with user name when user is logged in', async () => {
    window.NVAuth.user = { name: 'Google User' };
    window.NVAuth.isAuthenticated = true;
    window.NVAuth.getUserName = () => 'Google User';

    await window.NVAppDashboard.renderDashboard();

    expect(window.TG_CERTIFICATES.downloadCertificate).toHaveBeenCalledWith('web', 'Google User', expect.any(Date));
    expect(window.TG_CERTIFICATES.saveCertificate).toHaveBeenCalledWith('web', 'Google User', expect.any(Date));
  });
});
