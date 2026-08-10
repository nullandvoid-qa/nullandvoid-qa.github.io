/**
 * app-bookmarks.js
 *
 * Bookmark toggle logic for lessons. Mutates shared bookmarks state
 * and persists to storage using a safe helper fallback.
 */
(function () {
  const _safeShowToast = (typeof window !== 'undefined' && window.safeShowToast) ? window.safeShowToast : (typeof window !== 'undefined' && typeof window.showToast === 'function' ? window.showToast : () => {});
  const safeTranslate = typeof window !== 'undefined' && typeof window.t === 'function'
    ? window.t
    : (key, fallback) => fallback || key;

  function getState() {
    return window.NVApp?.state || {};
  }

  function persistBookmarks(bookmarks) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSaveJson) {
      return window.NVAppStorage.safeSaveJson('testers-guild-bookmarks', bookmarks);
    }
    if (typeof window !== 'undefined' && typeof window.setStoredItem === 'function') {
      try { window.setStoredItem('testers-guild-bookmarks', JSON.stringify(bookmarks)); return; } catch (e) { /* ignore */ }
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('testers-guild-bookmarks', JSON.stringify(bookmarks));
      }
    } catch (e) {
      // ignore
    }
  }

  function toggleBookmark(lessonId) {
    const state = getState();
    const bookmarks = Array.isArray(state.bookmarks) ? [...state.bookmarks] : [];
    const idx = bookmarks.indexOf(lessonId);

    if (idx === -1) {
      bookmarks.push(lessonId);
      _safeShowToast(safeTranslate('toast.bookmarkAdded', 'Bookmark added'));
    } else {
      bookmarks.splice(idx, 1);
      _safeShowToast(safeTranslate('toast.bookmarkRemoved', 'Bookmark removed'));
    }

    state.bookmarks = bookmarks;
    persistBookmarks(bookmarks);
    if (typeof window.checkAchievements === 'function') window.checkAchievements();
  }

  window.NVAppBookmarks = { toggleBookmark };
  window.toggleBookmark = toggleBookmark;
})();
