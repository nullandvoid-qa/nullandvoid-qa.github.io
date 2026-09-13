/**
 * State Helper Functions
 * Empty states, loading states, and skeleton loaders
 */

function buildEmptyStateHtml(message, className, escapeHtml) {
  const safeEscapeHtml = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value);
  const safeMessage = message == null ? '' : String(message);
  const classes = ["empty-state"];
  if (className) classes.push(className);
  return `<div class="${classes.join(" ")}" role="status" aria-live="polite"><p>${safeEscapeHtml(safeMessage)}</p></div>`;
}

function buildLoadingStateHtml(message, className, escapeHtml) {
  const safeEscapeHtml = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value);
  const safeMessage = message == null ? 'Loading…' : String(message);
  const classes = ["loading-state"];
  if (className) classes.push(className);
  return `<div class="${classes.join(" ")}" role="status" aria-live="polite"><p>${safeEscapeHtml(safeMessage)}</p></div>`;
}

function buildDashboardEmptyStateHtml(message, escapeHtml) {
  return buildEmptyStateHtml(message, "dashboard-empty-state", escapeHtml);
}

function buildSearchEmptyStateHtml(message, escapeHtml) {
  const safeEscapeHtml = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value);
  return `<div class="search-empty" role="status" aria-live="polite">${safeEscapeHtml(message == null ? '' : String(message))}</div>`;
}

function buildDashboardSkeletonHtml() {
  return `
    <div class="dashboard-skeleton-grid">
      <div class="dash-card skeleton-card"><div class="skeleton skeleton-line skeleton-line-sm"></div><div class="skeleton skeleton-line"></div></div>
      <div class="dash-card skeleton-card"><div class="skeleton skeleton-line skeleton-line-sm"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line skeleton-line-xs"></div></div>
      <div class="dash-card skeleton-card"><div class="skeleton skeleton-line skeleton-line-sm"></div><div class="skeleton skeleton-line"></div></div>
      <div class="dash-card skeleton-card"><div class="skeleton skeleton-line skeleton-line-sm"></div><div class="skeleton skeleton-line"></div></div>
    </div>`;
}

function buildDashboardSkeletonCardHtml(className, lineClasses) {
  const safeClasses = Array.isArray(lineClasses) ? lineClasses : [];
  const lineMarkup = safeClasses
    .map((lineClass) => `<div class="skeleton skeleton-line ${lineClass}"></div>`)
    .join("");

  return `<div class="${className || "skeleton-card"}">${lineMarkup}</div>`;
}

function buildDashboardSkeletonGridHtml(items) {
  if (!Array.isArray(items) || !items.length) return "";

  return `
    <div class="dashboard-skeleton-grid">
      ${items.map((item) => buildDashboardSkeletonCardHtml(item.className, item.lineClasses)).join("")}
    </div>`;
}

function buildLessonSkeletonHtml() {
  return `
    <div class="lesson-skeleton-shell">
      <div class="lesson-skeleton-sidebar">
        <div class="skeleton-card">
          <div class="skeleton skeleton-line skeleton-line-sm"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line skeleton-line-xs"></div>
        </div>
      </div>
      <div class="lesson-skeleton-content">
        <div class="skeleton-card">
          <div class="skeleton skeleton-line skeleton-line-sm"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line skeleton-line-xs"></div>
        </div>
        <div class="skeleton-card">
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line skeleton-line-sm"></div>
        </div>
      </div>
    </div>`;
}

function buildSearchSkeletonHtml() {
  return `
    <div class="search-skeleton-group">
      <div class="skeleton-card search-skeleton-item">
        <div class="skeleton skeleton-line skeleton-line-sm"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-line-xs"></div>
      </div>
      <div class="skeleton-card search-skeleton-item">
        <div class="skeleton skeleton-line skeleton-line-sm"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line skeleton-line-xs"></div>
      </div>
      <div class="skeleton-card search-skeleton-item">
        <div class="skeleton skeleton-line skeleton-line-sm"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    </div>`;
}

module.exports = {
  buildEmptyStateHtml,
  buildLoadingStateHtml,
  buildDashboardEmptyStateHtml,
  buildSearchEmptyStateHtml,
  buildDashboardSkeletonHtml,
  buildDashboardSkeletonCardHtml,
  buildDashboardSkeletonGridHtml,
  buildLessonSkeletonHtml,
  buildSearchSkeletonHtml,
};
