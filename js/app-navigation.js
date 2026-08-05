/*
 * app-navigation.js
 *
 * Safe navigation helpers that read/write the shared `window.NVApp.state`
 * without assuming global helpers always exist. Handlers are guarded and
 * errors are caught to avoid crashing the app when a renderer is missing.
 */

function getState() {
  return (typeof window !== 'undefined' && window.NVApp && window.NVApp.state) ? window.NVApp.state : {};
}

function setStateProp(key, value) {
  if (typeof window !== 'undefined' && window.NVApp && window.NVApp.state) {
    try {
      window.NVApp.state[key] = value;
    } catch (e) {
      // ignore writes to read-only descriptors
    }
  }
}

const safeT = typeof window !== 'undefined' && typeof window.t === 'function' ? window.t : (k, f) => f || k;
const safeShowToast = typeof window !== 'undefined' && typeof window.showToast === 'function' ? window.showToast : () => {};
const NVViewHelpers = typeof window !== 'undefined' && window.NVViewHelpers ? window.NVViewHelpers : {};

async function navigate(view, params = {}) {
  const safeView = typeof view === 'string' && view ? view : 'home';
  const safeParams = params && typeof params === 'object' ? params : {};

  // ensure global NVApp structure exists without overwriting existing descriptors
  // Do not create or overwrite `window.NVApp` here; rely on bootstrap to expose it.
  // `setStateProp` will only write when `window.NVApp.state` exists.

  setStateProp('currentView', safeView);
  setStateProp('viewParams', safeParams);

  if (typeof NVViewHelpers.setActiveView === 'function') {
    try {
      NVViewHelpers.setActiveView(typeof document !== 'undefined' ? document : null, safeView, 'tracks');
    } catch (e) {
      // noop
    }
  }

  const handlers = {
    home: () => (typeof renderHome === 'function' ? renderHome() : undefined),
    tracks: () => (typeof renderTracksPage === 'function' ? renderTracksPage() : undefined),
    roadmap: () => (typeof renderRoadmap === 'function' ? renderRoadmap() : undefined),
    glossary: () => (typeof renderGlossary === 'function' ? renderGlossary() : undefined),
    labs: () => (typeof renderLabs === 'function' ? renderLabs() : undefined),
    sandbox: () => (typeof renderSandbox === 'function' ? renderSandbox() : undefined),
    track: () => (safeParams.trackId && typeof renderTrackDetail === 'function' ? renderTrackDetail(safeParams.trackId) : undefined),
    lesson: () => (safeParams.lessonId && typeof renderLesson === 'function' ? renderLesson(safeParams.lessonId) : undefined),
    quiz: () => (safeParams.trackId && typeof renderQuiz === 'function' ? renderQuiz(safeParams.trackId) : undefined),
    dashboard: () => (typeof renderDashboard === 'function' ? renderDashboard() : undefined),
  };

  let result;
  try {
    result = handlers[safeView]?.();
    if (result && typeof result.then === 'function') await result;
  } catch (err) {
    try { safeShowToast(safeT('navigation.error', 'Navigation failed')); } catch (e) { /* ignore */ }
    if (typeof console !== 'undefined' && typeof console.error === 'function') console.error('Navigation error:', err);
  }

  try {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      const scrollToFn = window.scrollTo;
      const fnSource = String(scrollToFn);
      if (!/notImplemented/i.test(fnSource) && !/Not implemented/i.test(fnSource)) {
        scrollToFn({ top: 0, behavior: 'auto' });
      }
    }
  } catch (e) {
    // noop
  }

  return result;
}

function refreshCurrentView() {
  if (typeof window === 'undefined') return;
  const state = getState();
  navigate(state.currentView || 'home', state.viewParams || {});
}

window.navigate = navigate;
window.refreshCurrentView = refreshCurrentView;
