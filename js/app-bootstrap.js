(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.initAppRegistry = api.initAppRegistry;
  root.NVAppBootstrap = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function defineLegacyAppStateAccessors() {
    if (typeof window === 'undefined') return;

    if (typeof window.currentView === 'undefined') {
      Object.defineProperty(window, 'currentView', {
        configurable: true,
        enumerable: true,
        get() {
          return window.NVApp?.state?.currentView;
        },
        set(value) {
          if (window.NVApp?.state) window.NVApp.state.currentView = value;
        },
      });
    }

    if (typeof window.viewParams === 'undefined') {
      Object.defineProperty(window, 'viewParams', {
        configurable: true,
        enumerable: true,
        get() {
          return window.NVApp?.state?.viewParams;
        },
        set(value) {
          if (window.NVApp?.state) window.NVApp.state.viewParams = value;
        },
      });
    }

    if (typeof window.lang === 'undefined') {
      Object.defineProperty(window, 'lang', {
        configurable: true,
        enumerable: true,
        get() {
          return window.NVApp?.state?.lang;
        },
        set(value) {
          if (window.NVApp?.state) window.NVApp.state.lang = value;
        },
      });
    }
  }

  function initAppRegistry({ stateAccessors = {}, helpers = {} } = {}) {
    const appState = {};
    const appHelpers = { ...helpers };

    const descriptors = Object.getOwnPropertyNames(stateAccessors).reduce((acc, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(stateAccessors, key);
      if (descriptor) {
        acc[key] = descriptor;
      }
      return acc;
    }, {});

    Object.defineProperties(appState, descriptors);

    const app = {
      state: appState,
      helpers: appHelpers,
    };

    if (typeof window !== 'undefined') {
      window.resolveLangKey = window.resolveLangKey || ((value) => (value === 'en' ? 'en' : 'pt'));
      window.NVApp = window.NVApp || {};
      window.NVApp.state = app.state;
      window.NVApp.helpers = app.helpers;
      defineLegacyAppStateAccessors();
    }

    return app;
  }

  function registerAppBindings({ state = {}, helpers = {}, mergeWithExisting = true } = {}) {
    const app = initAppRegistry({
      stateAccessors: state,
      helpers: mergeWithExisting && typeof window !== 'undefined' && window.NVApp?.helpers
        ? { ...window.NVApp.helpers, ...helpers }
        : helpers,
    });

    if (typeof window !== 'undefined' && mergeWithExisting) {
      window.NVApp = window.NVApp || {};
      window.NVApp.state = app.state;
      window.NVApp.helpers = app.helpers;
      defineLegacyAppStateAccessors();
    }

    return app;
  }

  return { initAppRegistry, registerAppBindings };
});
