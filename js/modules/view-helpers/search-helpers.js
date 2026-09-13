/**
 * Search Helper Functions
 * Search UI, results rendering, and search operations
 */

const { buildSearchSkeletonHtml, buildSearchEmptyStateHtml } = require('./state-helpers');

function buildSearchResultsHtml(lessonMatches, glossaryMatches, icons, escapeHtml) {
  const lessonHtml = lessonMatches
    .slice(0, 8)
    .map(
      (l) => {
        const label = `${l.title} — ${l.trackTitle} · ${l.courseTitle}`;
        return `
    <button type="button" class="search-result-item" data-lesson="${l.id}" aria-label="${escapeHtml(label)}">
      <span class="search-result-icon">${icons ? icons.get('book','search-result-icon','16') : ''}</span>
      <span class="search-result-title">${escapeHtml(l.title)}</span>
      <span class="search-result-meta">${escapeHtml(l.trackTitle)} · ${escapeHtml(l.courseTitle)}</span>
    </button>`;
      },
    )
    .join("");

  const glossaryHtml = glossaryMatches
    .slice(0, 3)
    .map(
      (g) => {
        const label = `${g.term}: ${g.def.substring(0, 80)}`;
        return `
    <button type="button" class="search-result-item search-glossary-item" data-glossary="1" aria-label="${escapeHtml(label)}">
      <span class="search-result-icon">${icons ? icons.get('book', 'search-result-icon', '16') : ''}</span>
      <span class="search-result-title">${escapeHtml(g.term)}</span>
      <span class="search-result-meta">${escapeHtml(g.def.substring(0, 80))}…</span>
    </button>`;
      },
    )
    .join("");

  return lessonHtml + glossaryHtml;
}

function renderSearchResults(container, lessonMatches, glossaryMatches, icons, escapeHtml, t, onLessonOpen, onGlossaryOpen) {
  if (!container) return;

  if ((!lessonMatches || lessonMatches.length === 0) && (!glossaryMatches || glossaryMatches.length === 0)) {
    container.innerHTML = buildSearchEmptyStateHtml(t("dashboard.noResults"), escapeHtml);
    container.classList.remove("hidden");
    return;
  }

  container.innerHTML = buildSearchResultsHtml(lessonMatches, glossaryMatches, icons, escapeHtml);
  container.classList.remove("hidden");

  container.querySelectorAll(".search-result-item[data-lesson]").forEach((btn) => {
    btn.addEventListener("click", () => onLessonOpen(btn.dataset.lesson));
  });

  container.querySelectorAll(".search-glossary-item").forEach((btn) => {
    btn.addEventListener("click", () => onGlossaryOpen());
  });
}

function searchAndRender(container, query, getAllLessonsFn, glossaryItems, icons, escapeHtml, t, navigate) {
  if (!container) return;
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    container.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = buildSearchSkeletonHtml();

  const allLessons = typeof getAllLessonsFn === 'function' ? getAllLessonsFn() : [];
  const lessonMatches = allLessons.filter(
    (l) =>
      (String(l.title || '').toLowerCase().includes(q)) ||
      (String(l.trackTitle || '').toLowerCase().includes(q)) ||
      (String(l.courseTitle || '').toLowerCase().includes(q)) ||
      (String(l.id || '').toLowerCase().includes(q)) ||
      (String(l.trackId || '').toLowerCase().includes(q)),
  );

  const glossaryMatches = (Array.isArray(glossaryItems) ? glossaryItems : []).filter(
    (g) => (String(g.term || '').toLowerCase().includes(q)) || (String(g.def || '').toLowerCase().includes(q)),
  );

  renderSearchResults(
    container,
    lessonMatches,
    glossaryMatches,
    icons,
    escapeHtml,
    t,
    (lessonId) => {
      const input = document.getElementById('global-search');
      if (input) input.value = '';
      container.classList.add('hidden');
      if (typeof navigate === 'function') navigate('lesson', { lessonId });
    },
    () => {
      const input = document.getElementById('global-search');
      if (input) input.value = '';
      container.classList.add('hidden');
      if (typeof navigate === 'function') navigate('glossary');
    },
  );
}

module.exports = {
  buildSearchResultsHtml,
  buildSearchSkeletonHtml: require('./state-helpers').buildSearchSkeletonHtml,
  renderSearchResults,
  searchAndRender,
};
