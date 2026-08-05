module.exports = (function () {
  let fallbackState = { bookmarks: [] };

  function ensureWindow() {
    if (typeof window === 'undefined') global.window = {};
  }

  function getState() {
    return (typeof window !== 'undefined' && window.NVApp && window.NVApp.state) ? window.NVApp.state : fallbackState;
  }

  return {
    init() {
      ensureWindow();
      // For tests, ensure a minimal NVApp.state exists so modules that attach
      // to `window.NVApp.state` can operate. This only creates the global in tests.
      if (!window.NVApp) window.NVApp = {};
      if (!window.NVApp.state) window.NVApp.state = { bookmarks: [] };
    },

    goto() {
      // no-op: non-UI integration test
    },

    favorite(lessonId) {
      this.init();
      if (typeof window !== 'undefined' && typeof window.toggleBookmark === 'function') {
        window.toggleBookmark(lessonId);
        return;
      }
      const state = getState();
      state.bookmarks = Array.isArray(state.bookmarks) ? state.bookmarks : [];
      if (!state.bookmarks.includes(lessonId)) state.bookmarks.push(lessonId);
      try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify(state.bookmarks)); } catch (e) {}
    },

    isFavorited(lessonId) {
      this.init();
      const state = getState();
      return (Array.isArray(state.bookmarks) ? state.bookmarks : []).includes(lessonId);
    },

    clear() {
      this.init();
      const state = getState();
      state.bookmarks = [];
      try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify([])); } catch (e) {}
    },
  };
})();
