/**
 * View Helpers Module - Barrel Export
 * Centralizes all view-related helper functions
 * Maintains backward compatibility with original API
 */

// UI Helpers
const {
  createFilterChipMarkup,
  createIconHtml,
  getAvatarState,
  wireFilterBar,
  bindAccessibleAction,
  setActiveView,
  cleanInlineBackgrounds,
  notifyUser,
} = require('./ui-helpers');

// Banner Renderers
const {
  renderContinueBanner,
  renderInstallBanner,
} = require('./banner-renderers');

// State Helpers
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
} = require('./state-helpers');

// Search Helpers
const {
  buildSearchResultsHtml,
  renderSearchResults,
  searchAndRender,
} = require('./search-helpers');

// Card Builders
const {
  buildCertificateCard,
  buildPortfolioTemplatesHtml,
  buildTrackCardHtml,
  buildTrackDetailHtml,
  buildDashboardStatsHtml,
  buildBookmarksHtml,
  buildGlossaryHtml,
  buildLabsHtml,
} = require('./card-builders');

// Quiz Helpers
const {
  buildQuizResultHtml,
  buildLessonQuizResultHtml,
  buildTrackQuizHtml,
  bindTrackQuizHandlers,
  buildLessonQuizHtml,
  bindLessonQuizHandlers,
  renderLessonQuiz,
} = require('./quiz-helpers');

// Checklist Helpers
const {
  buildChecklistHtml,
  bindChecklistHandlers,
} = require('./checklist-helpers');

// Roadmap Helpers
const {
  buildRoadmapHtml,
  renderRoadmap,
} = require('./roadmap-helpers');

// Lesson Helpers
const {
  setupLessonHeader,
  toggleLessonComplete,
  submitLessonFeedback,
  bindLessonPageActions,
  buildTrackCoursesHtml,
} = require('./lesson-helpers');

// Track Helpers
const {
  renderTrackDetail,
} = require('./track-helpers');

// Dashboard Helpers
const {
  buildDashboardBookmarksSectionHtml,
  buildDashboardCertificatesSectionHtml,
  buildAchievementsHtml,
  bindDashboardBookmarkHandlers,
  bindDashboardCertificateHandlers,
  renderDashboardSections,
} = require('./dashboard-helpers');

// Certificate Helpers
const {
  showCertificateModal,
} = require('./certificate-helpers');

// View Renderers
const {
  renderHomeView,
} = require('./view-renderers');

// Export unified API maintaining backward compatibility
const api = {
  // UI Helpers
  createFilterChipMarkup,
  getAvatarState,
  wireFilterBar,
  bindAccessibleAction,
  setActiveView,
  cleanInlineBackgrounds,
  notifyUser,
  
  // Banner Renderers
  renderContinueBanner,
  renderInstallBanner,
  
  // Card Builders
  buildCertificateCard,
  buildPortfolioTemplatesHtml,
  buildSearchResultsHtml,
  buildTrackCardHtml,
  buildTrackDetailHtml,
  buildDashboardStatsHtml,
  buildBookmarksHtml,
  buildGlossaryHtml,
  buildLabsHtml,
  
  // Quiz Helpers
  buildQuizResultHtml,
  buildLessonQuizResultHtml,
  buildTrackQuizHtml,
  bindTrackQuizHandlers,
  bindChecklistHandlers,
  bindLessonQuizHandlers,
  renderLessonQuiz,
  
  // Lesson Helpers
  bindLessonPageActions,
  setupLessonHeader,
  
  // Search & Navigation
  searchAndRender,
  toggleLessonComplete,
  submitLessonFeedback,
  
  // Achievements & Sections
  buildAchievementsHtml,
  bindDashboardBookmarkHandlers,
  bindDashboardCertificateHandlers,
  
  // Utilities
  cleanInlineBackgrounds,
  buildChecklistHtml,
  buildTrackCoursesHtml,
  buildLessonQuizHtml,
  buildRoadmapHtml,
  renderRoadmap,
  renderTrackDetail,
  
  // State Management
  buildEmptyStateHtml,
  buildLoadingStateHtml,
  buildDashboardEmptyStateHtml,
  buildSearchEmptyStateHtml,
  buildSearchSkeletonHtml,
  renderSearchResults,
  
  // Dashboard Sections
  buildDashboardBookmarksSectionHtml,
  buildDashboardCertificatesSectionHtml,
  buildDashboardSkeletonHtml,
  buildDashboardSkeletonCardHtml,
  buildDashboardSkeletonGridHtml,
  buildLessonSkeletonHtml,
  renderDashboardSections,
  
  // Home View
  renderHomeView,
  
  // Certificate Modal
  showCertificateModal,
};

module.exports = api;
