(function (global) {
  "use strict";

  // Determine environment
  const isNodeEnv = typeof module !== "undefined" && module.exports;

  // Load modules based on environment
  let modules = {};

  if (isNodeEnv) {
    // Node.js/CommonJS environment
    modules = {
      uiHelpers: require('./modules/view-helpers/ui-helpers'),
      bannerRenderers: require('./modules/view-helpers/banner-renderers'),
      stateHelpers: require('./modules/view-helpers/state-helpers'),
      searchHelpers: require('./modules/view-helpers/search-helpers'),
      cardBuilders: require('./modules/view-helpers/card-builders'),
      quizHelpers: require('./modules/view-helpers/quiz-helpers'),
      checklistHelpers: require('./modules/view-helpers/checklist-helpers'),
      roadmapHelpers: require('./modules/view-helpers/roadmap-helpers'),
      lessonHelpers: require('./modules/view-helpers/lesson-helpers'),
      trackHelpers: require('./modules/view-helpers/track-helpers'),
      dashboardHelpers: require('./modules/view-helpers/dashboard-helpers'),
      certificateHelpers: require('./modules/view-helpers/certificate-helpers'),
      viewRenderers: require('./modules/view-helpers/view-renderers'),
    };
  }

  // Destructure and merge all exports
  const {
    createFilterChipMarkup,
    createIconHtml,
    getAvatarState,
    wireFilterBar,
    bindAccessibleAction,
    setActiveView,
    cleanInlineBackgrounds,
    notifyUser,
  } = modules.uiHelpers || {};

  const {
    renderContinueBanner,
    renderInstallBanner,
  } = modules.bannerRenderers || {};

  const {
    buildEmptyStateHtml,
    buildLoadingStateHtml,
    buildDashboardEmptyStateHtml,
    buildSearchEmptyStateHtml,
    buildDashboardSkeletonHtml,
    buildDashboardSkeletonCardHtml,
    buildDashboardSkeletonGridHtml,
    buildLessonSkeletonHtml,
    buildSearchSkeletonHtml,
  } = modules.stateHelpers || {};

  const {
    buildSearchResultsHtml,
    renderSearchResults,
    searchAndRender,
  } = modules.searchHelpers || {};

  const {
    buildCertificateCard,
    buildPortfolioTemplatesHtml,
    buildTrackCardHtml,
    buildTrackDetailHtml,
    buildDashboardStatsHtml,
    buildBookmarksHtml,
    buildGlossaryHtml,
    buildLabsHtml,
  } = modules.cardBuilders || {};

  const {
    buildQuizResultHtml,
    buildLessonQuizResultHtml,
    buildTrackQuizHtml,
    bindTrackQuizHandlers,
    buildLessonQuizHtml,
    bindLessonQuizHandlers,
    renderLessonQuiz,
  } = modules.quizHelpers || {};

  const {
    buildChecklistHtml,
    bindChecklistHandlers,
  } = modules.checklistHelpers || {};

  const {
    buildRoadmapHtml,
    renderRoadmap,
  } = modules.roadmapHelpers || {};

  const {
    setupLessonHeader,
    toggleLessonComplete,
    submitLessonFeedback,
    bindLessonPageActions,
    buildTrackCoursesHtml,
  } = modules.lessonHelpers || {};

  const {
    renderTrackDetail,
  } = modules.trackHelpers || {};

  const {
    buildDashboardBookmarksSectionHtml,
    buildDashboardCertificatesSectionHtml,
    buildAchievementsHtml,
    bindDashboardBookmarkHandlers,
    bindDashboardCertificateHandlers,
    renderDashboardSections,
  } = modules.dashboardHelpers || {};

  const {
    showCertificateModal,
  } = modules.certificateHelpers || {};

  const {
    renderHomeView,
  } = modules.viewRenderers || {};

  // Unified API - maintains 100% backward compatibility
  const api = {
    createFilterChipMarkup,
    getAvatarState,
    wireFilterBar,
    bindAccessibleAction,
    setActiveView,
    renderContinueBanner,
    renderInstallBanner,
    renderHomeView,
    buildCertificateCard,
    buildPortfolioTemplatesHtml,
    buildSearchResultsHtml,
    buildTrackCardHtml,
    buildTrackDetailHtml,
    buildDashboardStatsHtml,
    buildBookmarksHtml,
    buildGlossaryHtml,
    buildLabsHtml,
    buildQuizResultHtml,
    buildLessonQuizResultHtml,
    buildTrackQuizHtml,
    bindTrackQuizHandlers,
    bindChecklistHandlers,
    bindLessonQuizHandlers,
    renderLessonQuiz,
    bindLessonPageActions,
    setupLessonHeader,
    searchAndRender,
    toggleLessonComplete,
    submitLessonFeedback,
    buildAchievementsHtml,
    bindDashboardBookmarkHandlers,
    bindDashboardCertificateHandlers,
    cleanInlineBackgrounds,
    buildChecklistHtml,
    buildTrackCoursesHtml,
    buildLessonQuizHtml,
    buildRoadmapHtml,
    renderRoadmap,
    renderTrackDetail,
    buildEmptyStateHtml,
    buildLoadingStateHtml,
    buildDashboardEmptyStateHtml,
    buildSearchEmptyStateHtml,
    buildSearchSkeletonHtml,
    renderSearchResults,
    buildDashboardBookmarksSectionHtml,
    buildDashboardCertificatesSectionHtml,
    buildDashboardSkeletonHtml,
    buildDashboardSkeletonCardHtml,
    buildDashboardSkeletonGridHtml,
    buildLessonSkeletonHtml,
    renderDashboardSections,
    showCertificateModal,
  };

  // Expose API to window for browser
  if (typeof window !== "undefined") {
    global.NVViewHelpers = api;
  }

  // Export for Node.js/CommonJS (for tests)
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

})(typeof window !== "undefined" ? window : global);
