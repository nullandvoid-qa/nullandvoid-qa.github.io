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

  async function onCertDownload(trackId, completedTracks) {
    if (!window.TG_CERTIFICATES) return;
    const track = completedTracks.find((tr) => tr.id === trackId);
    if (!track) return;
    const t = getTranslator();
    try {
      const userName = window.NVAuth?.getUserName?.() || "";
      await window.TG_CERTIFICATES.downloadCertificate(track.id, userName, new Date());
      window.TG_CERTIFICATES.saveCertificate(track.id, userName, new Date());
      window.showToast(t("toast.certificateDownloaded", getState().lang === "en" ? "Certificate downloaded!" : "Certificado baixado!"));
    } catch (error) {
      const messagePrefix = t("toast.certificateDownloadError", "Error");
      window.showToast(`${messagePrefix}: ${error.message}`);
    }
  }

  function safeLoadJson(key, fallback, validator) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeLoadJson) {
      try { return window.NVAppStorage.safeLoadJson(key, fallback, validator); } catch (e) { return fallback; }
    }
    if (typeof window !== 'undefined' && typeof window.loadJson === 'function') {
      try { return window.loadJson(key, fallback, validator); } catch (e) { return fallback; }
    }
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        const data = JSON.parse(raw);
        if (validator && !validator(data)) return fallback;
        return data;
      }
    } catch (e) {
      // ignore
    }
    return fallback;
  }

  function getStoredAchievements() {
    const key = "testers-guild-unlocked-achievements";
    return safeLoadJson(key, [], (data) => Array.isArray(data));
  }

  function renderAchievements() {
    const state = getState();
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    const unlocked = getStoredAchievements();
    if (typeof window.NVViewHelpers?.buildAchievementsHtml === 'function') {
      grid.innerHTML = window.NVViewHelpers.buildAchievementsHtml(
        state.achievementsList || [],
        unlocked,
        state.lang,
        window.escapeHtml,
        window.NVIcons,
        getTranslator(),
      );
    } else {
      grid.innerHTML = "";
    }
  }

  async function renderDashboard() {
    const state = getState();
    const helpers = getHelpers();
    const t = getTranslator();
    const statsEl = document.getElementById("dashboard-stats");
    const grid = document.getElementById("dashboard-tracks");
    const achievementsGrid = document.getElementById("achievements-grid");
    const bmSection = document.getElementById("dashboard-bookmarks");
    const certSection = document.getElementById("dashboard-certificates");

    if (statsEl && window.NVViewHelpers?.buildDashboardSkeletonHtml) {
      statsEl.innerHTML = window.NVViewHelpers.buildDashboardSkeletonHtml();
    }

    if (window.NVViewHelpers?.buildDashboardSkeletonGridHtml) {
      const skeletonSections = [
        {
          element: grid,
          count: 4,
          className: "skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        },
        {
          element: achievementsGrid,
          count: 4,
          className: "achievement-card skeleton-card",
          lineClasses: ["skeleton-circle", "skeleton-line-sm", "skeleton-line-xs"],
        },
        {
          element: bmSection,
          count: 3,
          className: "skeleton-card skeleton-list-item",
          lineClasses: ["skeleton-line-sm", ""],
        },
        {
          element: certSection,
          count: 2,
          className: "skeleton-card cert-skeleton-card",
          lineClasses: ["skeleton-line-sm", ""],
        },
      ];

      skeletonSections.forEach((section) => {
        if (!section.element) return;

        const items = Array.from({ length: section.count }, () => ({
          className: section.className,
          lineClasses: section.lineClasses,
        }));

        section.element.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(items);
      });
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    const global = typeof helpers.getGlobalProgress === 'function'
      ? helpers.getGlobalProgress()
      : { done: 0, total: 0, pct: 0 };
    const passedCount = Object.keys(state.quizzesPassed || {}).length;

    if (statsEl && window.NVViewHelpers?.buildDashboardStatsHtml) {
      statsEl.innerHTML = window.NVViewHelpers.buildDashboardStatsHtml(
        { ...global, passedCount },
        t("price", "Price"),
        t,
        t,
      );
    }

    if (typeof helpers.renderAchievements === 'function') {
      helpers.renderAchievements();
    } else {
      renderAchievements();
    }

    if (grid) {
      grid.innerHTML = "";
      if (typeof helpers.renderTrackCard === 'function') {
        (Array.isArray(state.tracks) ? state.tracks : []).forEach((tr) => helpers.renderTrackCard(tr, "dashboard-tracks"));
      }
    }

    const completedTracks = Array.isArray(state.tracks)
      ? state.tracks.filter((tr) => {
          if (typeof helpers.getTrackProgress === 'function') {
            return helpers.getTrackProgress(tr).pct === 100;
          }
          return false;
        })
      : [];
    const getUserCertificates = window.TG_CERTIFICATES?.getUserCertificates?.bind(window.TG_CERTIFICATES);
    const unlocked = getStoredAchievements();

    if (window.NVViewHelpers?.renderDashboardSections) {
      window.NVViewHelpers.renderDashboardSections(
        {
          achievementsGrid,
          bookmarksSection: bmSection,
          certificatesSection: certSection,
        },
        {
          achievementsList: state.achievementsList,
          unlocked,
          bookmarks: state.bookmarks,
          findLesson: helpers.findLesson,
          icons: window.NVIcons,
          escapeHtml: window.escapeHtml,
          getTrackIcon: helpers.getTrackIcon,
          lang: state.lang,
          t,
          getUserCertificates,
          completedTracks,
          onCertDownload: (trackId) => onCertDownload(trackId, completedTracks),
          navigate: helpers.navigate,
        },
      );
    }

    const templatesSection = document.querySelector('[id$="templates"]');
    if (!templatesSection && global.pct >= 20 && typeof window.NVViewHelpers?.buildPortfolioTemplatesHtml === "function") {
      const templatesHtml = window.NVViewHelpers.buildPortfolioTemplatesHtml(state.lang);
      const dashboardContent = document.getElementById("dashboard-content") || document.getElementById("dashboard-stats")?.parentElement;
      if (dashboardContent) {
        dashboardContent.insertAdjacentHTML("beforeend", templatesHtml);
      }
    }
  }

  window.NVAppDashboard = {
    renderDashboard,
    renderAchievements,
  };
  window.renderDashboard = renderDashboard;
})();
