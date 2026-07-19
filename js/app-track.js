(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function renderTrackCard(track, containerId) {
    const state = getState();
    const helpers = getHelpers();
    const lt = helpers.localizedTrack(track);
    const prog = helpers.getTrackProgress(track);
    const container = document.getElementById(containerId);
    if (!container) return;
    const audience = helpers.TRACK_AUDIENCE[track.id] || "intermediate";
    const isComplete = prog.pct === 100;

    const iconName = helpers.getTrackIcon(track);
    const iconHtml = window.NVIcons
      ? window.NVIcons.get(iconName, "track-icon-svg", "28")
      : helpers.escapeHtml(track.icon || "");
    const title = helpers.normalizeTextLabel(lt.title);

    const cardMarkup = window.NVViewHelpers.buildTrackCardHtml(track, {
      prog: {
        pct: prog.pct,
        done: prog.done,
        total: prog.total,
      },
      audience,
      isComplete,
      title,
      iconHtml,
      lang: helpers.lang,
      icons: window.NVIcons,
      escapeHtml: helpers.escapeHtml,
      t: helpers.t,
      tierLabel: helpers.tierLabel,
    });

    const card = document.createElement("div");
    card.innerHTML = cardMarkup;
    const cardElement = card.firstElementChild;
    if (cardElement) {
      cardElement.style.setProperty("--track-color", track.color);
      const open = () => helpers.navigate("track", { trackId: track.id });
      window.NVViewHelpers.bindAccessibleAction(cardElement, open);
      container.appendChild(cardElement);
    }
  }

  function renderTrackDetail(trackId) {
    const state = getState();
    const helpers = getHelpers();
    const raw = helpers.findTrack(trackId);
    if (!raw) return;
    const track = helpers.localizedTrack(raw);
    const breadcrumb = document.getElementById("track-breadcrumb");
    if (breadcrumb) breadcrumb.textContent = track.title;
    const prog = helpers.getTrackProgress(raw);
    const hasQuiz = !!helpers.quizzes?.[trackId];

    const coursesHtml = window.NVViewHelpers.buildTrackCoursesHtml(
      raw,
      state.progress,
      helpers.getEnrichment,
      helpers.localizedLesson,
      helpers.localizedCourse,
      window.escapeHtml,
      helpers.t,
      window.NVIcons,
    );

    const container = document.getElementById("track-detail");
    if (!container) return;
    window.NVViewHelpers.renderTrackDetail(
      container,
      { ...track, icon: track.icon },
      coursesHtml,
      prog,
      {
        modules: helpers.getTrackModules(raw),
        hours: helpers.getTrackHours(raw),
        audience: helpers.TRACK_AUDIENCE[raw.id],
      },
      {
        icons: window.NVIcons,
        escapeHtml: window.escapeHtml,
        t: helpers.t,
        tierLabel: helpers.tierLabel,
        getTrackIcon: helpers.getTrackIcon,
      },
      helpers.navigate,
      hasQuiz,
    );
  }

  window.NVAppTrack = {
    renderTrackCard,
    renderTrackDetail,
  };
  window.renderTrackDetail = renderTrackDetail;
})();
