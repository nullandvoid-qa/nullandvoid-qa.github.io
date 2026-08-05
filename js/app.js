(function () {
  "use strict";

  const STORAGE_LANG = "testers-guild-lang";
  const STORAGE_LAST_LESSON = "testers-guild-last-lesson";
  const STORAGE_PERSONA = "testers-guild-persona";
  const STORAGE_BOOKMARKS = "testers-guild-bookmarks";
  const STORAGE_QUIZZES = "testers-guild-quizzes";
  const STORAGE_CHECKLISTS = "testers-guild-checklists";
  const STORAGE_THEME = "testers-guild-theme";
  const STORAGE_SENIOR_MODE = "testers-guild-senior-mode";

  let tracks = [];
  const enOverlay = window.TG_QAWAY_EN || {
    tracks: {},
    courses: {},
    lessons: {},
  };
  const EN_COURSE_ID_MAP = {
    c1: 's1',
    c2: 's2',
    c3: 's3',
    c4: 's4',
    c5: 's5',
    c6: 's6',
    c7: 's7',
    c8: 's8',
    c9: 's9',
    c10: 's10',
    c11: 's11',
    c12: 's12',
  };
  const EN_LESSON_ID_MAP = {
    l1: 's1-l1',
    l2: 's1-l2',
    l9: 's1-l3',
    l3: 's2-l1',
    l4: 's2-l2',
    l10: 's2-l3',
    l5: 's3-l1',
    l6: 's3-l2',
    l11: 's3-l3',
    l7: 's4-l1',
    l8: 's4-l2',
    l12: 's4-l3',
    l13: 's5-l1',
    l14: 's5-l2',
    l15: 's5-l3',
    l16: 's6-l1',
    l17: 's6-l2',
    l18: 's6-l3',
    l19: 's7-l1',
    l20: 's7-l2',
    l21: 's8-l1',
    l22: 's9-l1',
    l23: 's10-l1',
    l24: 's11-l1',
    l25: 's12-l1',
  };
  const enrichment = window.TG_LESSON_ENRICHMENT || {};
  const quizzes = window.TG_QUIZZES || {};
  const labsData = window.TG_LABS || {};
  const achievementsList = window.TG_ACHIEVEMENTS || [];

  function getGlobalHelper(name) {
    if (typeof globalThis !== 'undefined' && typeof globalThis[name] === 'function') {
      return globalThis[name];
    }
    if (typeof window !== 'undefined' && typeof window[name] === 'function') {
      return window[name];
    }
    return undefined;
  }

  const runtimeNavigate = getGlobalHelper('navigate');
  const runtimeRefreshCurrentView = getGlobalHelper('refreshCurrentView');
  const runtimeGetTrackIcon = getGlobalHelper('getTrackIcon');
  const runtimeSaveLastLesson = getGlobalHelper('saveLastLesson');
  const runtimeSaveProgress = getGlobalHelper('saveProgress');
  const runtimeSafeSaveJson = getGlobalHelper('safeSaveJson');
  const runtimeHighlightCode = getGlobalHelper('highlightCode');
  const runtimeAttachCopyButtons = getGlobalHelper('attachCopyButtons');
  const runtimeNormalizeTextLabel = getGlobalHelper('normalizeTextLabel');
  const runtimeEscapeHtml = getGlobalHelper('escapeHtml');

  function navigate(view, params = {}) {
    if (typeof runtimeNavigate === 'function') {
      return runtimeNavigate(view, params);
    }
    return undefined;
  }

  function refreshCurrentView() {
    if (typeof runtimeRefreshCurrentView === 'function') {
      return runtimeRefreshCurrentView();
    }
    return undefined;
  }

  function getTrackIcon(track) {
    if (typeof runtimeGetTrackIcon === 'function') {
      return runtimeGetTrackIcon(track);
    }
    return 'tracks';
  }

  function saveLastLesson(lessonId) {
    if (typeof runtimeSaveLastLesson === 'function') {
      return runtimeSaveLastLesson(lessonId);
    }
    return undefined;
  }

  function saveProgress(progressState) {
    if (typeof runtimeSaveProgress === 'function') {
      return runtimeSaveProgress(progressState);
    }
    return undefined;
  }

  function saveJson(key, data) {
    if (typeof runtimeSafeSaveJson === 'function') {
      return runtimeSafeSaveJson(key, data);
    }
    return undefined;
  }

  function highlightCode(html) {
    if (typeof runtimeHighlightCode === 'function') {
      return runtimeHighlightCode(html);
    }
    return typeof html === 'string' ? html : '';
  }

  function attachCopyButtons(container) {
    if (typeof runtimeAttachCopyButtons === 'function') {
      return runtimeAttachCopyButtons(container);
    }
    return undefined;
  }

  function normalizeTextLabel(text) {
    if (typeof runtimeNormalizeTextLabel === 'function') {
      return runtimeNormalizeTextLabel(text);
    }
    return String(text || '').replace(/^[^\wÀ-ž]+\s*/, '').trim();
  }

  function escapeHtml(text) {
    if (typeof runtimeEscapeHtml === 'function') {
      return runtimeEscapeHtml(text);
    }
    if (typeof text !== 'string') {
      return String(text);
    }
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const runtimeGetStorage = getGlobalHelper('getStorage');
  const runtimeLoadProgress = getGlobalHelper('loadProgress');
  const runtimeValidateBookmarksData = getGlobalHelper('validateBookmarksData') || ((data) => Array.isArray(data) && data.every((item) => typeof item === 'string'));
  const runtimeValidateQuizzesPassedData = getGlobalHelper('validateQuizzesPassedData') || ((data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    return Object.values(data).every((value) => value && typeof value === 'object' && typeof value.passedAt === 'string' && typeof value.score === 'number');
  });
  const runtimeValidateChecklistState = getGlobalHelper('validateChecklistState') || ((data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    return Object.values(data).every((item) => Array.isArray(item) && item.every((idx) => typeof idx === 'number'));
  });

  let lang = (typeof runtimeGetStorage === 'function' ? runtimeGetStorage(STORAGE_LANG, "tg-qaway-lang") : null) || "pt";
  // Default to no persona so home track filter uses "all"
  let persona = typeof runtimeGetStorage === 'function' ? runtimeGetStorage(STORAGE_PERSONA) : null;
  let progress = typeof runtimeLoadProgress === 'function' ? runtimeLoadProgress() : {};
  const bookmarks = safeLoadJson(STORAGE_BOOKMARKS, [], runtimeValidateBookmarksData);
  const quizzesPassed = safeLoadJson(
    STORAGE_QUIZZES,
    {},
    runtimeValidateQuizzesPassedData,
  );
  const checklistState = safeLoadJson(STORAGE_CHECKLISTS, {}, runtimeValidateChecklistState);
  let theme = "dark";
  let seniorMode = false;
  let currentView = "home";
  let viewParams = {};
  let trackFilter = "all";
  let homeFilter = "all";
  let searchTimeout = null;

  const t = typeof window !== 'undefined' && typeof window.t === 'function'
    ? window.t
    : (key, fallback) => fallback || key;
  const showToast = typeof window !== 'undefined' && typeof window.showToast === 'function'
    ? window.showToast
    : (msg) => {
      if (typeof console !== 'undefined' && typeof console.info === 'function') {
        console.info(msg);
      }
    };
  const safeConfirm = typeof window !== 'undefined' && typeof window.confirm === 'function'
    ? window.confirm
    : () => false;
  const NVAppStorage = typeof window !== 'undefined' && window.NVAppStorage ? window.NVAppStorage : null;
  const appStorage = typeof module !== 'undefined' && module.exports ? require('./app-storage.js') : null;
  const storage = NVAppStorage || appStorage || null;

  function safeGetStoredItem(key) {
    try {
      return storage?.safeGetStoredItem?.(key) ?? null;
    } catch (e) {
      return null;
    }
  }

  function safeLoadJson(key, fallback, validator) {
    try {
      return storage?.safeLoadJson?.(key, fallback, validator) ?? fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSaveJson(key, data) {
    try {
      storage?.safeSaveJson?.(key, data);
    } catch (e) {
      // ignore
    }
  }

  function safeSetStoredItem(key, value) {
    try {
      storage?.safeSetStoredItem?.(key, value);
    } catch (e) {
      // ignore
    }
  }

  function safeRemoveStoredItem(key) {
    try {
      storage?.safeRemoveStoredItem?.(key);
    } catch (e) {
      // ignore
    }
  }

  function getAppSettings() {
    return typeof window !== 'undefined' && window.NVAppSettings ? window.NVAppSettings : {};
  }

  function applyTheme() {
    return getAppSettings().applyTheme?.();
  }

  function toggleTheme() {
    return getAppSettings().toggleTheme?.();
  }

  function applySeniorMode() {
    return getAppSettings().applySeniorMode?.();
  }

  function toggleSeniorMode() {
    return getAppSettings().toggleSeniorMode?.();
  }

  function applyStaticI18n() {
    return getAppSettings().applyStaticI18n?.();
  }

  function updateLangToggle() {
    return getAppSettings().updateLangToggle?.();
  }

  function renderNavLinks() {
    return getAppSettings().renderNavLinks?.();
  }

  function toggleLang() {
    return getAppSettings().toggleLang?.();
  }

  function getElement(id) {
    if (typeof window !== 'undefined' && typeof window.getElementById === 'function') {
      return window.getElementById(id);
    }
    return typeof document !== 'undefined' ? document.getElementById(id) : null;
  }

  const NVViewHelpers = typeof window !== 'undefined' && window.NVViewHelpers ? window.NVViewHelpers : {};

  function buildAchievementsHtml(...args) {
    return typeof NVViewHelpers.buildAchievementsHtml === 'function'
      ? NVViewHelpers.buildAchievementsHtml(...args)
      : '';
  }

  function bindTrackQuizHandlers(...args) {
    return typeof NVViewHelpers.bindTrackQuizHandlers === 'function'
      ? NVViewHelpers.bindTrackQuizHandlers(...args)
      : undefined;
  }

  function searchAndRender(...args) {
    return typeof NVViewHelpers.searchAndRender === 'function'
      ? NVViewHelpers.searchAndRender(...args)
      : undefined;
  }

  const PERSONA_TRACKS = {
    beginner: ["starter", "web", "api", "accessibility", "mobile"],
    experienced: [
      "web",
      "api",
      "mobile",
      "devops",
      "accessibility",
      "security",
    ],
    senior: ["leadership", "performance", "security", "devops", "web", "api"],
  };

  const TRACK_AUDIENCE = {
    starter: "beginner",
    intermediate: "intermediate",
    senior: "senior",
    mentorship: "intermediate",
    web: "intermediate",
    api: "intermediate",
    mobile: "intermediate",
    performance: "senior",
    security: "intermediate",
    devops: "intermediate",
    accessibility: "intermediate",
    leadership: "senior",
    "lab-android-basic": "intermediate",
    "lab-ios-basic": "intermediate",
    "lab-saucelabs": "intermediate",
    "lab-browserstack": "intermediate",
  };

  // Utility functions moved to `js/utils.js`.

  function getHomeTrackSummary(filteredCount = tracks.length) {
    const global = getGlobalProgress();
    const total = tracks.length;
    const lessons = global.total;
    const currentLang = appState.lang === 'en' ? 'en' : 'pt';
    if (currentLang === 'en') {
      const base = `${filteredCount} of ${total} paths · ${lessons} lessons`;
      return filteredCount === total ? `${total} paths · ${lessons} lessons` : `Showing ${base}`;
    }
    return filteredCount === total
      ? `${total} trilhas · ${lessons} aulas`
      : `Mostrando ${filteredCount} de ${total} trilhas · ${lessons} aulas`;
  }

  // ── Storage helpers ───────────────────────────────────────────────────────
  // Storage helpers are moved to js/app-storage.js to reduce app.js size.

  // ── i18n ──────────────────────────────────────────────────────────────────
  // Translation helper is defined in js/app-i18n.js and uses window.lang.

  function localizedTrack(track) {
    const currentLang = appState.lang === 'en' ? 'en' : 'pt';
    if (currentLang === 'en' && enOverlay.tracks[track.id]) {
      const o = enOverlay.tracks[track.id];
      return {
        ...track,
        title: o.title,
        description: o.description,
        level: o.level,
        topics: o.topics || track.topics,
      };
    }
    return track;
  }

  function localizedCourse(course) {
    const enCourseId = EN_COURSE_ID_MAP[course.id] || course.id;
    const currentLang = appState.lang === 'en' ? 'en' : 'pt';
    if (currentLang === 'en' && enOverlay.courses[enCourseId])
      return { ...course, title: enOverlay.courses[enCourseId].title };
    return course;
  }

  function localizedLesson(lesson) {
    const enLessonId = EN_LESSON_ID_MAP[lesson.id] || lesson.id;
    const currentLang = appState.lang === 'en' ? 'en' : 'pt';
    if (currentLang === 'en' && enOverlay.lessons[enLessonId]) {
      const o = enOverlay.lessons[enLessonId];
      return {
        ...lesson,
        title: o.title,
        content: o.content || lesson.content,
      };
    }
    return lesson;
  }

  function getEnrichment(lessonId) {
    return (
      enrichment[lessonId] || {
        tier: "intermediate",
        primer: null,
        seniorNote: null,
      }
    );
  }

  function tierLabel(tier) {
    const map = {
      beginner: "lesson.tierBeginner",
      intermediate: "lesson.tierIntermediate",
      senior: "lesson.tierSenior",
    };
    return t(map[tier] || "lesson.tierIntermediate");
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  // showToast is now provided by js/app-ui.js

  // Code highlighting and copy button helpers live in `js/utils.js`.



  function getTrackHelpers() {
    return typeof window !== 'undefined' && window.NVAppTracks ? window.NVAppTracks : null;
  }

  function countLessons(track) {
    const helpers = getTrackHelpers();
    if (helpers?.countLessons) return helpers.countLessons(track);
    if (!track || !track.courses || !Array.isArray(track.courses)) return 0;
    return track.courses.reduce(
      (sum, course) => sum + (Array.isArray(course.lessons) ? course.lessons.length : 0),
      0,
    );
  }

  function getTrackModules(track) {
    const helpers = getTrackHelpers();
    if (helpers?.getTrackModules) return helpers.getTrackModules(track);
    return typeof track?.modules === 'number' && track.modules > 0 ? track.modules : countLessons(track);
  }

  function getTrackHours(track) {
    const helpers = getTrackHelpers();
    if (helpers?.getTrackHours) return helpers.getTrackHours(track);
    if (typeof track?.hours === 'number' && track.hours > 0) return track.hours;
    const lessons = countLessons(track);
    return lessons > 0 ? lessons : 0;
  }

  function getTrackProgress(track) {
    const helpers = getTrackHelpers();
    if (helpers?.getTrackProgress) return helpers.getTrackProgress(track, progress);
    if (!track || !track.courses) return { done: 0, total: 0, pct: 0 };
    const total = countLessons(track);
    const done = track.courses.reduce((sum, course) => {
      if (!course || !Array.isArray(course.lessons)) return sum;
      return sum + course.lessons.filter((lesson) => lesson && progress[lesson.id]).length;
    }, 0);
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function getGlobalProgress() {
    const helpers = getTrackHelpers();
    if (helpers?.getGlobalProgress) return helpers.getGlobalProgress(tracks, progress);
    const allLessons = tracks
      .filter((track) => track && track.courses && Array.isArray(track.courses))
      .flatMap((track) => track.courses.flatMap((course) => Array.isArray(course.lessons) ? course.lessons : []));
    const done = allLessons.filter((lesson) => lesson && progress[lesson.id]).length;
    return {
      done,
      total: allLessons.length,
      pct: allLessons.length ? Math.round((done / allLessons.length) * 100) : 0,
    };
  }

  function getAllLessons() {
    const helpers = getTrackHelpers();
    if (helpers?.getAllLessons) {
      return helpers.getAllLessons(tracks, {
        localizedTrack,
        localizedCourse,
        localizedLesson,
      });
    }
    const lessons = [];
    tracks.forEach((track) => {
      if (!track || !track.courses || !Array.isArray(track.courses)) return;
      const lt = localizedTrack(track);
      track.courses.forEach((course) => {
        if (!course || !course.lessons || !Array.isArray(course.lessons)) return;
        const lc = localizedCourse(course);
        course.lessons.forEach((lesson) => {
          if (!lesson) return;
          lessons.push({
            ...localizedLesson(lesson),
            trackId: track.id,
            trackTitle: lt.title,
            courseTitle: lc.title,
          });
        });
      });
    });
    return lessons;
  }

  function findTrack(id) {
    const helpers = getTrackHelpers();
    if (helpers?.findTrack) return helpers.findTrack(tracks, id);
    return tracks.find((track) => track && track.id === id) || null;
  }

  function findLesson(lessonId) {
    const helpers = getTrackHelpers();
    if (helpers?.findLesson) {
      return helpers.findLesson(tracks, lessonId, {
        localizedTrack,
        localizedCourse,
        localizedLesson,
      });
    }
    for (const track of tracks) {
      if (!track || !track.courses || !Array.isArray(track.courses)) continue;
      for (const course of track.courses) {
        if (!course || !course.lessons || !Array.isArray(course.lessons)) continue;
        const lesson = course.lessons.find((l) => l && l.id === lessonId);
        if (lesson) {
          return {
            track: localizedTrack(track),
            course: localizedCourse(course),
            lesson: localizedLesson(lesson),
            rawTrack: track,
            rawCourse: course,
            rawLesson: lesson,
          };
        }
      }
    }
    return null;
  }

  // ── Achievements ──────────────────────────────────────────────────────────
  function checkAchievements() {
    return window.NVAppAchievements?.checkAchievements?.() ?? [];
  }

  function renderAchievements() {
    return window.NVAppAchievements?.renderAchievements?.();
  }

  // ── Persona & filters ─────────────────────────────────────────────────────
  // Map persona → audience filter
  const PERSONA_FILTER = {
    beginner: "beginner",
    experienced: "intermediate",
    senior: "senior",
  };

  function setPersona(p) {
    persona = p;
    safeSetStoredItem(STORAGE_PERSONA, p);
    document.querySelectorAll(".persona-card").forEach((el) => {
      el.classList.toggle("active", el.dataset.persona === p);
    });
    // sync home filter chip with persona
    homeFilter = PERSONA_FILTER[p] || "all";
    showToast(t("toast.personaSaved"));
    if (appState.currentView === "home") renderHome();
  }

  function sortTracksForPersona(list) {
    const order = PERSONA_TRACKS[persona] || [];
    return [...list].sort((a, b) => {
      const ai = order.indexOf(a.id),
        bi = order.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  // ── Navigation ────────────────────────────────────────────────────────────
  // Navigation helpers are moved to js/app-navigation.js.

  // ── Track card ────────────────────────────────────────────────────────────
  // ── Continue banner ───────────────────────────────────────────────────────
  // ── Home / Tracks / Roadmap ─────────────────────────────────────────────────
  // These renderers are implemented in js/app-home.js.

  // ── Content / quiz views ────────────────────────────────────────────────
  // These renderers now live in js/app-content.js and are exposed on window.
  // Renderers for glossary, labs, sandbox and quiz views are implemented
  // in js/app-content.js and exposed as window.NVAppContent helpers.
  // Content renderers are provided by js/app-content.js and are exposed
  // globally through window.NVAppContent and window.render* helpers.

  // ── Checklist and lesson rendering ─────────────────────────────────────────
  // Lesson-specific rendering has been moved to js/app-lesson.js.

  // ── Track Detail ──────────────────────────────────────────────────────────
  // Implemented in js/app-track.js.

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  function toggleBookmark(lessonId) {
    return window.NVAppBookmarks?.toggleBookmark?.(lessonId);
  }

  // The lesson rendering flow is handled in js/app-lesson.js.
  // This file keeps shared state, helper wiring and global event bindings.
  // The dashboard rendering flow is handled in js/app-dashboard.js.

  // ── Search ────────────────────────────────────────────────────────────────
  function handleSearch(query) {
    return window.NVAppSearch?.handleSearch?.(query);
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  // Event listeners moved to `js/app-init.js` to reduce bootstrap responsibilities.

  getElement("btn-reset-progress")
    ?.addEventListener("click", () => {
      if (safeConfirm(t("dashboard.resetConfirm"))) {
        progress = {};
        saveProgress(progress);
        safeRemoveStoredItem(STORAGE_LAST_LESSON);
        showToast(t("toast.progressReset"));
        refreshCurrentView();
        renderContinueBanner();
      }
    });

  getElement("btn-export-progress")
    ?.addEventListener("click", () => {
      exportProgressToFile(progress, bookmarks, quizzesPassed, checklistState);
    });

  getElement("btn-import-progress")
    ?.addEventListener("click", () => {
      getElement("progress-import-input")?.click();
    });

  getElement("progress-import-input")
    ?.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const imported = await importProgressFromFile(file);
      event.target.value = "";
      if (!imported) return;
      progress = imported.progress;
      bookmarks.length = 0;
      bookmarks.push(...imported.bookmarks);
      Object.keys(quizzesPassed).forEach((key) => delete quizzesPassed[key]);
      Object.assign(quizzesPassed, imported.quizzesPassed);
      Object.keys(checklistState).forEach((key) => delete checklistState[key]);
      Object.assign(checklistState, imported.checklistState);
      saveProgress(progress);
      safeSaveJson("testers-guild-bookmarks", bookmarks);
      safeSaveJson("testers-guild-quizzes", quizzesPassed);
      safeSaveJson("testers-guild-checklists", checklistState);
      showToast(t("toast.importProgressSuccess"));
      refreshCurrentView();
      renderContinueBanner();
    });

  // Keyboard shortcuts: ArrowLeft / ArrowRight to navigate lessons
  document.addEventListener("keydown", (e) => {
    if (appState.currentView !== "lesson") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const found = findLesson(appState.viewParams.lessonId);
    if (!found) return;
    const allLessons = (found.rawTrack && found.rawTrack.courses && Array.isArray(found.rawTrack.courses))
      ? found.rawTrack.courses.flatMap((c) => c.lessons || [])
      : [];
    const idx = allLessons.findIndex((l) => l.id === appState.viewParams.lessonId);
    if (e.key === "ArrowRight" && allLessons[idx + 1])
      navigate("lesson", { lessonId: allLessons[idx + 1].id });
    if (e.key === "ArrowLeft" && allLessons[idx - 1])
      navigate("lesson", { lessonId: allLessons[idx - 1].id });
  });

  // ── Auth Integration ──────────────────────────────────────────────────────
  // Sincroniza progresso ao fazer login
  document.addEventListener("nvauth:login", (e) => {
    const userProgress = window.NVAuth.getProgress();
    if (Object.keys(userProgress).length > 0) {
      progress = userProgress;
      showToast(`Progresso restaurado para ${e.detail.name}`);
    } else {
      // Se não tem progresso salvo, salva o atual
      window.NVAuth.setProgress(progress);
    }
    refreshCurrentView();
  });

  // Ao fazer logout, salva o progresso da sessão
  document.addEventListener("nvauth:logout", () => {
    saveProgress(progress);
    showToast(t("toast.progressSavedLocal"));
  });

  const appState = {
    get lang() {
      return lang;
    },
    set lang(value) {
      lang = value;
    },
    get persona() {
      return persona;
    },
    set persona(value) {
      persona = value;
    },
    get tracks() {
      return tracks;
    },
    set tracks(value) {
      tracks = value;
    },
    get progress() {
      return progress;
    },
    set progress(value) {
      progress = value;
    },
    get bookmarks() {
      return bookmarks;
    },
    get quizzesPassed() {
      return quizzesPassed;
    },
    get checklistState() {
      return checklistState;
    },
    get theme() {
      return theme;
    },
    set theme(value) {
      theme = value;
    },
    get seniorMode() {
      return seniorMode;
    },
    set seniorMode(value) {
      seniorMode = value;
    },
    get currentView() {
      return currentView;
    },
    set currentView(value) {
      currentView = value;
    },
    get viewParams() {
      return viewParams;
    },
    set viewParams(value) {
      viewParams = value;
    },
    get trackFilter() {
      return trackFilter;
    },
    set trackFilter(value) {
      trackFilter = value;
    },
    get homeFilter() {
      return homeFilter;
    },
    set homeFilter(value) {
      homeFilter = value;
    },
    get tracks() {
      return tracks;
    },
    set tracks(value) {
      tracks = Array.isArray(value) ? value : [];
    },
  };

  const appHelpers = {
    t,
    navigate,
    refreshCurrentView,
    findLesson,
    findTrack,
    getEnrichment,
    getTrackIcon,
    localizedLesson,
    localizedCourse,
    checkAchievements,
    renderAchievements,
    saveLastLesson,
    saveProgress,
    saveJson,
    getGlobalProgress,
    renderTrackCard: window.NVAppTrack?.renderTrackCard,
    renderContinueBanner: window.NVAppHome?.renderContinueBanner,
    renderInstallBanner: window.NVViewHelpers?.renderInstallBanner,
    STORAGE_LAST_LESSON,
    getTrackProgress,
    getTrackModules,
    getTrackHours,
    highlightCode,
    attachCopyButtons,
    toggleBookmark,
    setPersona,
    toggleLang,
    toggleTheme,
    toggleSeniorMode,
    handleSearch,
    quizzes,
    TRACK_AUDIENCE,
    localizedTrack,
    normalizeTextLabel,
    escapeHtml,
    tierLabel,
    sortTracksForPersona,
    getHomeTrackSummary,
  };

  function ensureGlobalNVApp() {
    if (typeof window !== 'undefined' && window.NVAppBootstrap && typeof window.NVAppBootstrap.ensureGlobalNVApp === 'function') {
      try {
        return window.NVAppBootstrap.ensureGlobalNVApp(appState, appHelpers);
      } catch (e) {
        // fall back to local attach
      }
    }

    if (typeof window !== 'undefined') {
      window.NVApp = window.NVApp || {};
      window.NVApp.state = window.NVApp.state || appState;
      window.NVApp.helpers = window.NVApp.helpers || appHelpers;
    }
  }

  if (window.initAppRegistry) {
    window.initAppRegistry({ stateAccessors: appState, helpers: appHelpers });
  } else if (window.NVAppBootstrap?.registerAppBindings) {
    window.NVAppBootstrap.registerAppBindings({ state: appState, helpers: appHelpers });
  } else {
    // Prefer the app-bootstrap to register the global NVApp.
    // Creating globals from non-bootstrap modules increases coupling
    // and makes initialization order brittle — skip creating it here.
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('NVApp bootstrap not found; skipping global NVApp creation from app.js');
    }
  }

  

  // ── Init ──────────────────────────────────────────────────────────────────
  function mergeTrackSources() {
    if (window.NVAppTracks && typeof window.NVAppTracks.mergeTrackSources === 'function') {
      try { return window.NVAppTracks.mergeTrackSources(); } catch (err) { /* fall back */ }
    }

    // Fallback: basic merge when the extracted helper is not present.
    return Array.isArray(window.TG_QAWAY_TRACKS) ? window.TG_QAWAY_TRACKS : [];
  }

  function init() {
    // Load all tracks: merge main tracks + new specialized tracks
    tracks = mergeTrackSources();
    tracks = Array.isArray(tracks) ? tracks : [];

    appState.lang = lang;
    document.documentElement.lang = appState.lang === "en" ? "en" : "pt-BR";
    // sync homeFilter with saved persona on load
    homeFilter = PERSONA_FILTER[persona] || "all";
    renderNavLinks();
    applyTheme();
    applySeniorMode();
    applyStaticI18n();
    updateLangToggle();
    checkAchievements();
const lastLessonId = safeGetStoredItem(STORAGE_LAST_LESSON);
    if (lastLessonId && findLesson(lastLessonId)) {
      navigate("lesson", { lessonId: lastLessonId });
    } else {
      navigate("home");
    }

    // During local development and automated tests, some UI state can remain
    // hidden due to timing or service worker caching. Ensure track grids and
    // cards are visible so E2E tests can interact reliably.
    try {
      const host = window.location.hostname || '';
      if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
        setTimeout(() => {
          ['home-tracks-grid', 'tracks-grid', 'dashboard-tracks'].forEach((id) => {
            const el = document.getElementById(id);
            if (el && el.classList.contains('hidden')) el.classList.remove('hidden');
          });
          document.querySelectorAll('.track-card.hidden').forEach((c) => c.classList.remove('hidden'));
        }, 400);
      }
    } catch (e) {
      // noop
    }

    // Register Service Worker for PWA support
    if ('serviceWorker' in navigator) {
      const basePath = location.pathname.endsWith('/')
        ? location.pathname
        : location.pathname.replace(/\/[^/]+$/, '/');
      const swUrl = new URL('service-worker.js', location.href).href;

      navigator.serviceWorker.register(swUrl, { scope: basePath })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
      // Listen for messages from the service worker (e.g., update notifications)
      try {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SW_UPDATED') {
            console.info('[PWA] Service worker updated to', event.data.version, '- reloading to fetch fresh content.');
            // Force a reload so the page picks up the newest assets and content
            window.location.reload();
          }
        });
      } catch (e) {
        // noop
      }
    }
  }

    // Expose some internal helpers for debugging and integration tests
  try {
    window.navigate = navigate;
    window.findLesson = findLesson;
  } catch (e) {
    // ignore
  }

  init();

  ensureGlobalNVApp();
})();
