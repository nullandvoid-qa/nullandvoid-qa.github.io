(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function getTranslator() {
    const helpers = getHelpers();
    return typeof helpers.t === 'function'
      ? helpers.t
      : (key, fallback) => fallback || key;
  }

  function safeEscapeHtml(value) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(value);
    return String(value == null ? '' : value);
  }

  function buildEmptyState(message, className = 'home-empty-state') {
    const text = message == null ? '' : String(message);
    if (typeof window.NVViewHelpers?.buildEmptyStateHtml === 'function') {
      return window.NVViewHelpers.buildEmptyStateHtml(text, className, safeEscapeHtml);
    }
    const classes = ['empty-state', className].filter(Boolean);
    return `<div class="${classes.join(' ')}" role="status" aria-live="polite"><p>${safeEscapeHtml(text)}</p></div>`;
  }

  function renderHomeLessons() {
    // Recommendations are disabled, render nothing.
  }

  function renderContinueBanner() {
    const helpers = getHelpers();
    const banner = document.getElementById("continue-banner");
    if (!banner) return;
    if (typeof window.NVViewHelpers?.renderContinueBanner === 'function') {
      window.NVViewHelpers.renderContinueBanner(
        banner,
        null,
        helpers.findLesson,
        helpers.getTrackIcon,
        window.escapeHtml,
        helpers.t,
        helpers.navigate,
        window.NVIcons,
        helpers.STORAGE_LAST_LESSON,
      );
      return;
    }
    banner.innerHTML = buildEmptyState(
      getTranslator()("banner.unavailable", "Continue banner is unavailable."),
      "continue-banner-empty",
    );
  }

  function renderHomeFilterBar() {
    const state = getState();
    const helpers = getHelpers();
    const bar = document.getElementById("home-filter-bar");
    if (!bar) return;
    if (typeof window.NVViewHelpers?.wireFilterBar !== 'function') return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    window.NVViewHelpers.wireFilterBar(
      bar,
      filters,
      state.homeFilter,
      helpers.t,
      (nextFilter) => {
        state.homeFilter = nextFilter;
        renderHome();
      },
    );
  }

  async function renderHome() {
    const state = getState();
    const helpers = getHelpers();
    const t = getTranslator();
    const homeGrid = document.getElementById("home-tracks-grid");

    if (homeGrid && typeof window.NVViewHelpers?.buildDashboardSkeletonGridHtml === 'function') {
      homeGrid.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(
        Array.from({ length: 4 }, () => ({
          className: "skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        })),
      );
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    const global = typeof helpers.getGlobalProgress === 'function'
      ? helpers.getGlobalProgress()
      : { done: 0, total: 0, pct: 0 };

    if (typeof window.NVViewHelpers?.renderHomeView === 'function') {
      window.NVViewHelpers.renderHomeView(
        {
          global,
          tracks: Array.isArray(state.tracks) ? state.tracks : [],
          persona: state.persona,
          homeFilter: state.homeFilter,
          lang: state.lang,
          avatarIcons: window.NVIcons,
          getTrackIcon: helpers.getTrackIcon,
          escapeHtml: window.escapeHtml,
          t: helpers.t,
          renderTrackCard: helpers.renderTrackCard,
          renderHomeFilterBar,
          renderContinueBanner,
          renderHomeLessons,
          renderInstallBanner: helpers.renderInstallBanner,
          sortTracksForPersona: helpers.sortTracksForPersona,
          trackAudience: helpers.TRACK_AUDIENCE,
          getHomeTrackSummary: helpers.getHomeTrackSummary,
        },
      );
      return;
    }

    if (homeGrid) {
      homeGrid.innerHTML = buildEmptyState(
        t("home.unavailable", "O conteúdo da home não está disponível no momento."),
        "home-unavailable",
      );
    }
  }

  function renderFilterBar() {
    const state = getState();
    const helpers = getHelpers();
    const bar = document.getElementById("track-filter-bar");
    if (!bar || typeof window.NVViewHelpers?.wireFilterBar !== 'function') return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    window.NVViewHelpers.wireFilterBar(
      bar,
      filters,
      state.trackFilter,
      helpers.t,
      (nextFilter) => {
        state.trackFilter = nextFilter;
        renderTracksPage();
      },
    );
  }

  async function renderTracksPage() {
    const state = getState();
    const helpers = getHelpers();
    renderFilterBar();
    const grid = document.getElementById("tracks-grid");
    if (!grid) return;

    if (typeof window.NVViewHelpers?.buildDashboardSkeletonGridHtml === 'function') {
      grid.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(
        Array.from({ length: 4 }, () => ({
          className: "skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        })),
      );
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    grid.innerHTML = "";
    const tracks = Array.isArray(state.tracks) ? state.tracks : [];
    const filtered = state.trackFilter === "all"
      ? (typeof helpers.sortTracksForPersona === 'function' ? helpers.sortTracksForPersona(tracks) : tracks)
      : tracks.filter((tr) => helpers.TRACK_AUDIENCE?.[tr.id] === state.trackFilter);

    if (filtered.length === 0) {
      grid.innerHTML = buildEmptyState(
        getTranslator()("tracks.empty", "Nenhuma trilha encontrada."),
        "tracks-empty-state",
      );
      return;
    }

    if (typeof helpers.renderTrackCard === 'function') {
      filtered.forEach((tr) => helpers.renderTrackCard(tr, "tracks-grid", { showRecommend: true }));
    }
  }

  function renderRoadmap() {
    const state = getState();
    const helpers = getHelpers();
    const container = document.getElementById("roadmap-content");
    if (!container) return;
    const roadmaps = window.TG_ROADMAPS || {};
    if (typeof window.NVViewHelpers?.renderRoadmap === 'function') {
      window.NVViewHelpers.renderRoadmap(container, roadmaps, state.lang, helpers.t, window.escapeHtml, helpers.navigate);
      return;
    }
    container.innerHTML = buildEmptyState(
      getTranslator()("roadmap.unavailable", "Roadmap unavailable."),
      "roadmap-empty-state",
    );
  }

  window.NVAppHome = {
    renderHome,
    renderTracksPage,
    renderRoadmap,
    renderContinueBanner,
  };
  window.renderHome = renderHome;
  window.renderTracksPage = renderTracksPage;
  window.renderRoadmap = renderRoadmap;
})();
