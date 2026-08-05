describe('app-home fallback rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="home-tracks-grid"></div>
      <div id="home-filter-bar"></div>
      <div id="continue-banner"></div>
      <div id="roadmap-content"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
        tracks: [],
        persona: null,
        homeFilter: 'all',
      },
      helpers: {
        sortTracksForPersona: jest.fn((tracks) => tracks),
      },
    };

    window.NVIcons = {};
    window.escapeHtml = (value) => String(value);

    jest.resetModules();
    require('../app-home.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.NVIcons;
    delete window.escapeHtml;
    delete window.NVAppHome;
    delete window.renderHome;
    delete window.renderTracksPage;
    delete window.renderRoadmap;
  });

  test('renderHome does not throw when view helpers are missing', async () => {
    await expect(window.NVAppHome.renderHome()).resolves.not.toThrow();
    expect(document.getElementById('home-tracks-grid').innerHTML).toContain('O conteúdo da home não está disponível no momento.');
  });

  test('renderTracksPage falls back to empty state when no tracks are available', async () => {
    await window.NVAppHome.renderTracksPage();
    expect(document.getElementById('tracks-grid')).toBeNull();
  });
});
