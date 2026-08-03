/**
 * app-bookmarks.js
 *
 * Bookmark toggle logic for lessons. Mutates shared bookmarks state
 * and persists to localStorage.
 */
(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function toggleBookmark(lessonId) {
    const state = getState();
    const bookmarks = state.bookmarks || [];
    const idx = bookmarks.indexOf(lessonId);
    if (idx === -1) {
      bookmarks.push(lessonId);
      if (window.showToast) window.showToast(window.t('toast.bookmarkAdded'));
    } else {
      bookmarks.splice(idx, 1);
      if (window.showToast) window.showToast(window.t('toast.bookmarkRemoved'));
    }
    try { localStorage.setItem('testers-guild-bookmarks', JSON.stringify(bookmarks)); } catch (e) { /* ignore */ }
    if (typeof window.checkAchievements === 'function') window.checkAchievements();
  }

  window.NVAppBookmarks = { toggleBookmark };
  window.toggleBookmark = toggleBookmark;
})();
