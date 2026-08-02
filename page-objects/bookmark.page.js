module.exports = {
  init() {
    if (typeof window === 'undefined') global.window = {};
    window.NVApp = window.NVApp || {};
    window.NVApp.state = window.NVApp.state || { bookmarks: [] };
  },

  goto() {
    // no-op: non-UI integration test
  },

  favorite(lessonId) {
    this.init();
    if (typeof window.toggleBookmark === 'function') {
      window.toggleBookmark(lessonId);
    } else {
      const bookmarks = window.NVApp.state.bookmarks || [];
      if (!bookmarks.includes(lessonId)) bookmarks.push(lessonId);
      try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify(bookmarks)); } catch (e) {}
    }
  },

  isFavorited(lessonId) {
    this.init();
    return (window.NVApp.state.bookmarks || []).includes(lessonId);
  },

  clear() {
    this.init();
    window.NVApp.state.bookmarks = [];
    try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify([])); } catch (e) {}
  }
};
