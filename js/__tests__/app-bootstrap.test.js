describe('app bootstrap registry', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../app-bootstrap.js')];
    delete window.NVApp;
    delete window.currentView;
    delete window.viewParams;
    delete window.lang;
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

  test('registerAppBindings exposes legacy window.currentView and window.viewParams accessors', () => {
    const { registerAppBindings } = require('../app-bootstrap.js');

    const app = registerAppBindings({
      state: {
        get currentView() {
          return this._currentView || 'home';
        },
        set currentView(value) {
          this._currentView = value;
        },
        get viewParams() {
          return this._viewParams || {};
        },
        set viewParams(value) {
          this._viewParams = value;
        },
      },
      helpers: {},
    });

    expect(window.NVApp.state).toBe(app.state);
    expect(window.currentView).toBe('home');
    expect(window.viewParams).toEqual({});
    expect(window.lang).toBeUndefined();

    window.currentView = 'lesson';
    window.viewParams = { lessonId: 'l1' };
    window.lang = 'en';

    expect(app.state.currentView).toBe('lesson');
    expect(app.state.viewParams).toEqual({ lessonId: 'l1' });
    expect(app.state.lang).toBe('en');
  });

  test('does not override an existing window.lang string', () => {
    window.lang = 'pt';
    const { registerAppBindings } = require('../app-bootstrap.js');

    const app = registerAppBindings({
      state: {
        get currentView() {
          return this._currentView || 'home';
        },
        set currentView(value) {
          this._currentView = value;
        },
        get viewParams() {
          return this._viewParams || {};
        },
        set viewParams(value) {
          this._viewParams = value;
        },
      },
      helpers: {},
    });

    expect(window.lang).toBe('pt');
    expect(app.state.lang).toBeUndefined();
    delete window.lang;
  });
});
