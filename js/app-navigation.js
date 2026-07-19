function navigate(view, params = {}) {
  window.currentView = view;
  window.viewParams = params;
  window.NVViewHelpers?.setActiveView(document, view, "tracks");

  if (view === "home") renderHome();
  else if (view === "tracks") renderTracksPage();
  else if (view === "roadmap") renderRoadmap();
  else if (view === "glossary") renderGlossary();
  else if (view === "labs") renderLabs();
  else if (view === "track" && params.trackId) renderTrackDetail(params.trackId);
  else if (view === "lesson" && params.lessonId) renderLesson(params.lessonId);
  else if (view === "quiz" && params.trackId) renderQuiz(params.trackId);
  else if (view === "dashboard") renderDashboard();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function refreshCurrentView() {
  navigate(window.currentView, window.viewParams);
}

window.navigate = navigate;
window.refreshCurrentView = refreshCurrentView;
