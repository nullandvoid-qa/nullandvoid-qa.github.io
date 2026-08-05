describe('app-settings fallback behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="theme-toggle"></button>
      <button id="senior-mode-toggle"></button>
      <button id="lang-toggle"><span class="lang-flag"></span></button>
      <span id="lang-label"></span>
      <div id="nav-links"></div>
      <meta name="description" content="" />
    `;

    window.NVApp = { state: { lang: 'pt', theme: 'dark', seniorMode: false, currentView: 'home', viewParams: {} } };
    window.t = (key, fallback) => fallback || key;
    window.NVIcons = { get: jest.fn(() => '<svg></svg>') };
    window.showToast = jest.fn();
    window.navigate = jest.fn();
    window.refreshCurrentView = jest.fn();
    window.TG_NAV_ITEMS = [{ href: '/home', nav: 'home', i18n: 'nav.home', title: 'Home' }];

    jest.resetModules();
    require('../app-settings.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.t;
    delete window.NVIcons;
    delete window.showToast;
    delete window.navigate;
    delete window.refreshCurrentView;
    delete window.TG_NAV_ITEMS;
    delete window.NVAppSettings;
    delete window.applyTheme;
    delete window.toggleTheme;
    delete window.applySeniorMode;
    delete window.toggleSeniorMode;
    delete window.applyStaticI18n;
    delete window.updateLangToggle;
    delete window.renderNavLinks;
    delete window.bindNavLinks;
    delete window.setLang;
    delete window.toggleLang;
  });

  test('applyTheme uses fallback translator when window.t is present', () => {
    window.NVAppSettings.applyTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.getElementById('theme-toggle').innerHTML).toContain('<svg>');
  });

  test('setLang updates document title and triggers refreshCurrentView', () => {
    window.NVAppSettings.setLang('en');
    expect(document.documentElement.lang).toBe('en');
    expect(window.refreshCurrentView).toHaveBeenCalled();
  });
});
