/**
 * app-search.js
 *
 * Global search handler that queries lessons and glossary items.
 */
(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function getLangKey() {
    return getState().lang === 'en' ? 'en' : 'pt';
  }

  function handleSearch(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    const helpers = getHelpers();
    const glossaryItems = window.TG_GLOSSARY?.[getLangKey()] || [];
    const allLessons = typeof helpers.getAllLessons === 'function' ? helpers.getAllLessons : () => [];
    const t = typeof helpers.t === 'function' ? helpers.t : (key, fallback) => fallback || key;
    const escape = typeof window.escapeHtml === 'function' ? window.escapeHtml : (value) => String(value == null ? '' : value);

    if (typeof window.NVViewHelpers?.searchAndRender === 'function') {
      window.NVViewHelpers.searchAndRender(
        resultsEl,
        query,
        allLessons,
        glossaryItems,
        window.NVIcons,
        escape,
        t,
        window.navigate,
      );
      return;
    }

    resultsEl.innerHTML = `<div class="search-empty">${escape(t('search.unavailable', 'Search is unavailable.'))}</div>`;
  }

  window.NVAppSearch = { handleSearch };
  window.handleSearch = handleSearch;
})();
