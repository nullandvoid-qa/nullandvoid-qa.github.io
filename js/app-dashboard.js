(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  async function onCertDownload(trackId, completedTracks) {
    if (!window.TG_CERTIFICATES) return;
    const track = completedTracks.find((tr) => tr.id === trackId);
    if (!track) return;
    try {
      const userName = window.NVAuth?.getUserName?.() || "";
      await window.TG_CERTIFICATES.downloadCertificate(track.id, userName, new Date());
      window.TG_CERTIFICATES.saveCertificate(track.id, userName, new Date());
      window.showToast(getHelpers().t ? getHelpers().t("toast.certificateDownloaded", getState().lang === "en" ? "Certificate downloaded!" : "Certificado baixado!") : (getState().lang === "en" ? "Certificate downloaded!" : "Certificado baixado!"));
    } catch (error) {
      const messagePrefix = getHelpers().t ? getHelpers().t("toast.certificateDownloadError", "Error") : "Erro";
      window.showToast(`${messagePrefix}: ${error.message}`);
    }
  }

  function renderAchievements() {
    const state = getState();
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    const unlocked = window.loadJson("testers-guild-unlocked-achievements", []);
    grid.innerHTML = window.NVViewHelpers.buildAchievementsHtml(
      state.achievementsList || [],
      unlocked,
      state.lang,
      window.escapeHtml,
      window.NVIcons,
      getHelpers().t,
    );
  }

  async function renderDashboard() {
    const state = getState();
    const helpers = getHelpers();
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
          className: "skeleton-card track-card skeleton-card",
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

    const global = helpers.getGlobalProgress();
    const passedCount = Object.keys(state.quizzesPassed || {}).length;

    if (statsEl && window.NVViewHelpers?.buildDashboardStatsHtml) {
      statsEl.innerHTML = window.NVViewHelpers.buildDashboardStatsHtml(
        { ...global, passedCount },
        helpers.t("price"),
        helpers.t,
        helpers.t,
      );
    }

    helpers.renderAchievements();

    if (grid) {
      grid.innerHTML = "";
      state.tracks.forEach((tr) => helpers.renderTrackCard(tr, "dashboard-tracks"));
    }

    const completedTracks = state.tracks.filter((tr) => helpers.getTrackProgress(tr).pct === 100);
    const getUserCertificates = window.TG_CERTIFICATES?.getUserCertificates?.bind(window.TG_CERTIFICATES);
    const unlocked = window.loadJson("testers-guild-unlocked-achievements", []);

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
          t: helpers.t,
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
