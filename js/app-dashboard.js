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
      window.showToast(getState().lang === "en" ? "Certificate downloaded!" : "Certificado baixado!");
    } catch (error) {
      window.showToast(`Erro: ${error.message}`);
    }
  }

  function renderDashboard() {
    const state = getState();
    const helpers = getHelpers();
    const global = helpers.getGlobalProgress();
    const passedCount = Object.keys(state.quizzesPassed || {}).length;
    const statsEl = document.getElementById("dashboard-stats");

    if (statsEl && window.NVViewHelpers?.buildDashboardStatsHtml) {
      statsEl.innerHTML = window.NVViewHelpers.buildDashboardStatsHtml(
        { ...global, passedCount },
        helpers.t("price"),
        helpers.t,
        helpers.t,
      );
    }

    helpers.renderAchievements();

    const grid = document.getElementById("dashboard-tracks");
    if (grid) {
      grid.innerHTML = "";
      state.tracks.forEach((tr) => helpers.renderTrackCard(tr, "dashboard-tracks"));
    }

    const achievementsGrid = document.getElementById("achievements-grid");
    const bmSection = document.getElementById("dashboard-bookmarks");
    const certSection = document.getElementById("dashboard-certificates");
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
  };
  window.renderDashboard = renderDashboard;
})();
