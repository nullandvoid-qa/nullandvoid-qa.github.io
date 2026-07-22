(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.initAppRegistry = api.initAppRegistry;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
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
    }

    if (typeof window !== 'undefined') {
      window.NVApp = window.NVApp || {};
      window.NVApp.state = app.state;
      window.NVApp.helpers = app.helpers;
    }

    return app;
  }

  return { initAppRegistry };
});
