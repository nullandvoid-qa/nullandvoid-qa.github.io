describe('app-search fallback behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="search-results"></div>
    `;

    window.NVApp = {
      state: {
        lang: 'pt',
      },
      helpers: {},
    };

    window.NVIcons = {};
    window.escapeHtml = (value) => String(value);
    window.navigate = jest.fn();

    jest.resetModules();
    require('../app-search.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.NVIcons;
    delete window.escapeHtml;
    delete window.navigate;
    delete window.NVAppSearch;
    delete window.handleSearch;
  });

  test('handleSearch falls back when NVViewHelpers.searchAndRender is missing', () => {
    window.NVAppSearch.handleSearch('test');
    expect(document.getElementById('search-results').innerHTML).toContain('Search is unavailable.');
  });
});
