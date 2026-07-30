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
    window.NVViewHelpers.searchAndRender(
      resultsEl,
      query,
      helpers.getAllLessons || (() => []),
      glossaryItems,
      window.NVIcons,
      window.escapeHtml,
      window.t,
      window.navigate,
    );
  }

  window.NVAppSearch = { handleSearch };
  window.handleSearch = handleSearch;
})();
