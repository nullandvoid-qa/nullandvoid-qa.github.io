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

  function safeEscapeHtml(value) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(value);
    return String(value == null ? '' : value);
  }

  function bindFallbackAction(element, onActivate) {
    if (!element || typeof onActivate !== 'function') return;

    const isActivationKey = (key) => key === 'Enter' || key === ' ' || key === 'Spacebar';

    if (typeof window.NVViewHelpers?.bindAccessibleAction === 'function') {
      window.NVViewHelpers.bindAccessibleAction(element, onActivate);
      return;
    }

    element.addEventListener('click', () => onActivate());
    element.addEventListener('keydown', (event) => {
      if (isActivationKey(event.key)) {
        event.preventDefault();
        onActivate();
      }
    });
  }

  function buildEmptyState(message, className = 'track-empty-state') {
    const text = message == null ? '' : String(message);
    if (typeof window.NVViewHelpers?.buildEmptyStateHtml === 'function') {
      return window.NVViewHelpers.buildEmptyStateHtml(text, className, safeEscapeHtml);
    }
    const classes = ['empty-state', className].filter(Boolean);
    return `<div class="${classes.join(' ')}" role="status" aria-live="polite"><p>${safeEscapeHtml(text)}</p></div>`;
  }

  function renderTrackCard(track, containerId) {
    const helpers = getHelpers();
    const localizedTrackData = (typeof helpers.localizedTrack === 'function' ? helpers.localizedTrack(track) : track) || track;
    const prog = typeof helpers.getTrackProgress === 'function'
      ? helpers.getTrackProgress(track)
      : { pct: 0, done: 0, total: 0 };
    const container = document.getElementById(containerId);
    if (!container) return;
    const audience = helpers.TRACK_AUDIENCE?.[track.id] || "intermediate";
    const isComplete = prog.pct === 100;

    const iconName = typeof helpers.getTrackIcon === 'function'
      ? helpers.getTrackIcon(localizedTrackData)
      : localizedTrackData.icon;
    const iconHtml = window.NVIcons?.get
      ? window.NVIcons.get(iconName, "track-icon-svg", "28")
      : safeEscapeHtml(localizedTrackData.icon || "");
    const title = typeof helpers.normalizeTextLabel === 'function'
      ? helpers.normalizeTextLabel(localizedTrackData.title)
      : safeEscapeHtml(localizedTrackData.title || localizedTrackData.id || '');

    if (typeof window.NVViewHelpers?.buildTrackCardHtml !== 'function') {
      const fallbackCard = document.createElement('div');
      fallbackCard.className = 'track-card fallback-card';
      fallbackCard.setAttribute('role', 'button');
      fallbackCard.setAttribute('tabindex', '0');
      fallbackCard.setAttribute('aria-label', title || getTranslator()("track.untitled", "Untitled track"));
      fallbackCard.textContent = title || getTranslator()("track.untitled", "Untitled track");
      const open = () => typeof helpers.navigate === 'function' && helpers.navigate("track", { trackId: track.id });
      bindFallbackAction(fallbackCard, open);
      container.appendChild(fallbackCard);
      return;
    }

    const cardMarkup = window.NVViewHelpers.buildTrackCardHtml(localizedTrackData, {
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
      escapeHtml: helpers.escapeHtml || safeEscapeHtml,
      t: helpers.t,
      tierLabel: helpers.tierLabel,
    });

    const card = document.createElement("div");
    card.innerHTML = cardMarkup;
    const cardElement = card.firstElementChild;
    if (cardElement) {
      cardElement.style.setProperty("--track-color", localizedTrackData.color || track.color);
      const open = () => typeof helpers.navigate === 'function' && helpers.navigate("track", { trackId: track.id });
      if (typeof window.NVViewHelpers?.bindAccessibleAction === 'function') {
        window.NVViewHelpers.bindAccessibleAction(cardElement, open);
      }
      container.appendChild(cardElement);
    }
  }

  async function renderTrackDetail(trackId) {
    const state = getState();
    const helpers = getHelpers();
    const t = getTranslator();
    const raw = typeof helpers.findTrack === 'function' ? helpers.findTrack(trackId) : null;
    const container = document.getElementById("track-detail");

    if (!raw) {
      if (container) {
        container.innerHTML = buildEmptyState(
          (helpers.t?.("track.notFound", "Trilha indisponível no momento.") || "Trilha indisponível no momento."),
          "track-empty-state",
        );
      }
      return;
    }

    if (container && typeof window.NVViewHelpers?.buildDashboardSkeletonGridHtml === 'function') {
      container.innerHTML = window.NVViewHelpers.buildDashboardSkeletonGridHtml(
        Array.from({ length: 3 }, () => ({
          className: "skeleton-card track-card skeleton-card",
          lineClasses: ["skeleton-line-sm", "", "skeleton-line-xs"],
        })),
      );
    }

    const frameWait = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? new Promise((resolve) => window.requestAnimationFrame(resolve))
      : Promise.resolve();

    await frameWait;

    const track = typeof helpers.localizedTrack === 'function' ? helpers.localizedTrack(raw) : raw;
    const breadcrumb = document.getElementById("track-breadcrumb");
    if (breadcrumb) breadcrumb.textContent = track?.title || raw?.title || t("track.titleMissing", "Track");
    const prog = typeof helpers.getTrackProgress === 'function'
      ? helpers.getTrackProgress(raw)
      : { pct: 0, done: 0, total: 0 };
    const hasQuiz = !!helpers.quizzes?.[trackId];

    const coursesHtml = typeof window.NVViewHelpers?.buildTrackCoursesHtml === 'function'
      ? window.NVViewHelpers.buildTrackCoursesHtml(
          raw,
          state.progress,
          helpers.getEnrichment,
          helpers.localizedLesson,
          helpers.localizedCourse,
          window.escapeHtml,
          helpers.t,
          window.NVIcons,
        )
      : buildEmptyState(t("track.coursesUnavailable", "Course content is unavailable."), "track-courses-empty");

    if (!container) return;
    if (typeof window.NVViewHelpers?.renderTrackDetail === 'function') {
      window.NVViewHelpers.renderTrackDetail(
        container,
        { ...track, icon: track.icon },
        coursesHtml,
        prog,
        {
          modules: typeof helpers.getTrackModules === 'function' ? helpers.getTrackModules(raw) : [],
          hours: typeof helpers.getTrackHours === 'function' ? helpers.getTrackHours(raw) : 0,
          audience: helpers.TRACK_AUDIENCE?.[raw.id],
        },
        {
          icons: window.NVIcons,
          escapeHtml: window.escapeHtml,
          t: helpers.t,
          tierLabel: helpers.tierLabel,
          getTrackIcon: helpers.getTrackIcon,
        },
        typeof helpers.navigate === 'function' ? helpers.navigate : () => {},
        hasQuiz,
      );
      return;
    }

    container.innerHTML = buildEmptyState(
      t("track.detailUnavailable", "Detalhes da trilha indisponíveis."),
      "track-detail-empty",
    );
  }

  window.NVAppTrack = {
    renderTrackCard,
    renderTrackDetail,
  };
  window.renderTrackDetail = renderTrackDetail;
})();
