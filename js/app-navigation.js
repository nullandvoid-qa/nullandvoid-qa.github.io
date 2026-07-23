async function navigate(view, params = {}) {
  const safeView = typeof view === "string" && view ? view : "home";
  const safeParams = params && typeof params === "object" ? params : {};

  if (typeof window !== "undefined") {
    window.currentView = safeView;
    window.viewParams = safeParams;
  }

  if (window.NVViewHelpers && typeof window.NVViewHelpers.setActiveView === "function") {
    window.NVViewHelpers.setActiveView(document, safeView, "tracks");
  }

  const handlers = {
    home: () => typeof renderHome === "function" && renderHome(),
    tracks: () => typeof renderTracksPage === "function" && renderTracksPage(),
    roadmap: () => typeof renderRoadmap === "function" && renderRoadmap(),
    glossary: () => typeof renderGlossary === "function" && renderGlossary(),
    labs: () => typeof renderLabs === "function" && renderLabs(),
    sandbox: () => typeof renderSandbox === "function" && renderSandbox(),
    track: () => safeParams.trackId && typeof renderTrackDetail === "function" && renderTrackDetail(safeParams.trackId),
    lesson: () => safeParams.lessonId && typeof renderLesson === "function" && renderLesson(safeParams.lessonId),
    quiz: () => safeParams.trackId && typeof renderQuiz === "function" && renderQuiz(safeParams.trackId),
    dashboard: () => typeof renderDashboard === "function" && renderDashboard(),
  };

  const result = handlers[safeView]?.();
  if (result && typeof result.then === "function") {
    await result;
  }

  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return result;
}

function refreshCurrentView() {
  if (typeof window === "undefined") return;
  navigate(window.currentView || "home", window.viewParams || {});
}

window.navigate = navigate;
window.refreshCurrentView = refreshCurrentView;
