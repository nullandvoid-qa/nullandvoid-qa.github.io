describe('app bootstrap registry', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app-bootstrap.js')];
    delete window.NVApp;
  });

  test('registers state accessors and helpers on window.NVApp', () => {
    const { initAppRegistry } = require('../app-bootstrap.js');
    let currentLang = 'pt';

    const app = initAppRegistry({
      stateAccessors: {
        get lang() {
          return currentLang;
        },
        set lang(value) {
          currentLang = value;
        },
      },
      helpers: {
        t: jest.fn(() => 'translated'),
      },
    });

    expect(app.state.lang).toBe('pt');
    app.state.lang = 'en';
    expect(app.state.lang).toBe('en');
    expect(app.helpers.t()).toBe('translated');
  });
});
