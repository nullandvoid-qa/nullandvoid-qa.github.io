(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function renderHomeLessons() {
    // Recommendations are disabled, render nothing.
  }

  function renderContinueBanner() {
    const helpers = getHelpers();
    const banner = document.getElementById("continue-banner");
    if (!banner) return;
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
  }

  function renderHomeFilterBar() {
    const state = getState();
    const helpers = getHelpers();
    const bar = document.getElementById("home-filter-bar");
    if (!bar) return;
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
    const homeGrid = document.getElementById("home-tracks-grid");

    if (homeGrid && window.NVViewHelpers?.buildDashboardSkeletonGridHtml) {
      homeGrid.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(
        Array.from({ length: 4 }, () => ({
          className: "skeleton-card track-card skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        })),
      );
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    const global = helpers.getGlobalProgress();
    window.NVViewHelpers.renderHomeView(
      {
        global,
        tracks: state.tracks,
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
  }

  function renderFilterBar() {
    const state = getState();
    const helpers = getHelpers();
    const bar = document.getElementById("track-filter-bar");
    if (!bar) return;
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

    if (window.NVViewHelpers?.buildDashboardSkeletonGridHtml) {
      grid.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(
        Array.from({ length: 4 }, () => ({
          className: "skeleton-card track-card skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        })),
      );
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    grid.innerHTML = "";
    const filtered =
      state.trackFilter === "all"
        ? helpers.sortTracksForPersona(state.tracks)
        : state.tracks.filter((tr) => helpers.TRACK_AUDIENCE[tr.id] === state.trackFilter);
    filtered.forEach((tr) =>
      helpers.renderTrackCard(tr, "tracks-grid", { showRecommend: true }),
    );
  }

  function renderRoadmap() {
    const state = getState();
    const helpers = getHelpers();
    const container = document.getElementById("roadmap-content");
    if (!container) return;
    const roadmaps = window.TG_ROADMAPS || {};
    window.NVViewHelpers.renderRoadmap(container, roadmaps, state.lang, helpers.t, window.escapeHtml, helpers.navigate);
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
