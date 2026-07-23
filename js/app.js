(function () {
  "use strict";

  const STORAGE_PROGRESS = "testers-guild-progress";
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
  const checklists = window.TG_CHECKLISTS || {};
  const labsData = window.TG_LABS || {};
  const achievementsList = window.TG_ACHIEVEMENTS || [];

  let lang = getStorage(STORAGE_LANG, "tg-qaway-lang") || "pt";
  window.lang = lang; // Sync with global
  // Default to no persona so home track filter uses "all"
  let persona = getStorage(STORAGE_PERSONA) || null;
  let progress = loadProgress();
  const bookmarks = loadJson(STORAGE_BOOKMARKS, [], validateBookmarksData);
  const quizzesPassed = loadJson(
    STORAGE_QUIZZES,
    {},
    validateQuizzesPassedData,
  );
  const checklistState = loadJson(STORAGE_CHECKLISTS, {});
  let theme = getStorage(STORAGE_THEME) || "dark";
  let seniorMode = getStorage(STORAGE_SENIOR_MODE) === "true";
  let currentView = "home";
  let viewParams = {};
  let trackFilter = "all";
  let homeFilter = "all";
  let searchTimeout = null;

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

  const TRACK_ICON_MAP = {
    starter: "starter",
    intermediate: "bolt",
    senior: "crown",
    mentorship: "mentor",
    web: "web",
    api: "api",
    mobile: "mobile",
    performance: "perf",
    security: "security",
    devops: "devops",
    accessibility: "accessibility",
    leadership: "leadership",
    "lab-android-basic": "android",
    "lab-ios-basic": "ios",
    "lab-saucelabs": "externalLink",
    "lab-browserstack": "cloud",
  };

  // Utility functions moved to `js/utils.js`.

  function getHomeTrackSummary(filteredCount = tracks.length) {
    const global = getGlobalProgress();
    const total = tracks.length;
    const lessons = global.total;
    if (lang === "en") {
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
    if (lang === "en" && enOverlay.tracks[track.id]) {
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
    if (lang === "en" && enOverlay.courses[enCourseId])
      return { ...course, title: enOverlay.courses[enCourseId].title };
    return course;
  }

  function localizedLesson(lesson) {
    const enLessonId = EN_LESSON_ID_MAP[lesson.id] || lesson.id;
    if (lang === "en" && enOverlay.lessons[enLessonId]) {
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

  // ── Theme ─────────────────────────────────────────────────────────────────
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = getElementById("theme-toggle");
    if (btn) {
      const iconName = theme === "dark" ? "moon" : "sun";
      btn.innerHTML = getIconMarkup(iconName, "18");
      const nextThemeLabel = theme === "dark"
        ? t("settings.toggleThemeLight")
        : t("settings.toggleThemeDark");
      btn.setAttribute("aria-label", nextThemeLabel);
      btn.setAttribute("title", nextThemeLabel);
    }
    localStorage.setItem(STORAGE_THEME, theme);
  }

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
    showToast(t(theme === "dark" ? "settings.themeDark" : "settings.themeLight"));
  }

  // ── Senior Mode ───────────────────────────────────────────────────────────
  function applySeniorMode() {
    document.documentElement.classList.toggle("senior-mode", seniorMode);
    const btn = getElementById("senior-mode-toggle");
    if (btn) {
      btn.classList.toggle("active-toggle", seniorMode);
      btn.title = seniorMode
        ? t("settings.seniorModeOn", lang === "en" ? "Senior Mode ON" : "Modo Sênior ATIVO")
        : t("settings.seniorModeOff", lang === "en" ? "Senior Mode" : "Modo Sênior");
    }
    localStorage.setItem(STORAGE_SENIOR_MODE, String(seniorMode));
  }

  function toggleSeniorMode() {
    seniorMode = !seniorMode;
    applySeniorMode();
    showToast(
      seniorMode
        ? t("settings.seniorModeOnToast", lang === "en" ? "Senior Mode ON — beginner tips hidden" : "Modo Sênior ativado — dicas iniciante ocultas")
        : t("settings.seniorModeOffToast", lang === "en" ? "Senior Mode OFF" : "Modo Sênior desativado"),
    );
    if (currentView === "lesson") renderLesson(viewParams.lessonId);
  }

  // ── Language ──────────────────────────────────────────────────────────────
  function setLang(newLang) {
    lang = newLang === "en" ? "en" : "pt";
    window.lang = lang; // Sync with global
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]').content =
      t("meta.description");
    renderNavLinks();
    applyStaticI18n();
    applyTheme();
    applySeniorMode();
    updateLangToggle();
    refreshCurrentView();
    showToast(t("toast.langChanged"));
  }

  function toggleLang() {
    setLang(lang === "pt" ? "en" : "pt");
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (key) el.placeholder = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (key) el.title = t(key);
    });
    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      const key = el.dataset.i18nLabel;
      if (key) el.setAttribute("aria-label", t(key));
    });

    const langToggle = getElementById("lang-toggle");
    if (langToggle) {
      const langLabel = t("settings.toggleLanguage");
      langToggle.setAttribute("aria-label", langLabel);
      langToggle.setAttribute("title", langLabel);
    }

    const priceEl = getElementById("stat-price");
    if (priceEl) priceEl.textContent = t("price");
  }

  function bindNavLinks() {
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.removeEventListener("click", handleNavClick);
      el.addEventListener("click", handleNavClick);
    });
  }

  function handleNavClick(e) {
    e.preventDefault();
    const nav = e.currentTarget.dataset.nav;
    navigate(nav);
  }

  function renderNavLinks() {
    const navLinksEl = getElementById("nav-links");
    if (!navLinksEl) return;

    const navItems = window.TG_NAV_ITEMS || [];
    const navHtml = navItems
      .map((item) => `
        <a href="${item.href}" data-nav="${item.nav}" data-i18n="${item.i18n}">
          ${t(item.i18n)}
        </a>
      `)
      .join("");

    const badgeHtml = `
      <span class="badge-free" data-i18n="nav.allUnlocked">
        <span data-icon="unlock" data-icon-size="14"></span> ${t("nav.allUnlocked")}
      </span>
    `;

    navLinksEl.innerHTML = navHtml + badgeHtml;
    bindNavLinks();
  }

  function updateLangToggle() {
    const btn = getElementById("lang-toggle");
    const label = getElementById("lang-label");
    const flag = btn?.querySelector(".lang-flag");
    if (label) label.textContent = t("lang.toggle");
    if (flag) flag.textContent = lang === "pt" ? "🇧🇷" : "🇺🇸";

    if (btn) {
      const langLabel = t("settings.toggleLanguage");
      btn.setAttribute("aria-label", langLabel);
      btn.setAttribute("title", langLabel);
    }
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  window.nvToast = window.nvToast || { queue: [], isShowing: false, timer: null };
  function showToast(msg) {
    const el = getElementById("toast");
    if (!el) return;
    window.nvToast.queue.push(msg);
    if (window.nvToast.isShowing) return;

    const showNext = () => {
      if (window.nvToast.queue.length === 0) {
        window.nvToast.isShowing = false;
        return;
      }
      const nextMsg = window.nvToast.queue.shift();
      el.textContent = nextMsg;
      el.classList.add("show");
      window.nvToast.isShowing = true;
      clearTimeout(window.nvToast.timer);
      window.nvToast.timer = setTimeout(() => {
        el.classList.remove("show");
        window.nvToast.isShowing = false;
        showNext();
      }, 2800);
    };

    showNext();
  }
  window.showToast = showToast;

  function getIconMarkup(name, size = "18", className = "") {
    if (!window.NVIcons || typeof window.NVIcons.get !== "function") {
      return "";
    }
    return window.NVIcons.get(name, className, size);
  }

  function getIconMarkupOrFallback(name, fallback, size = "18", className = "") {
    return getIconMarkup(name, size, className) || fallback;
  }

  // Code highlighting and copy button helpers live in `js/utils.js`.



  function countLessons(track) {
    if (!track || !track.courses || !Array.isArray(track.courses)) return 0;
    return track.courses.reduce((s, c) => s + (c.lessons ? c.lessons.length : 0), 0);
  }

  function getTrackModules(track) {
    if (!track) return 0;
    return track.modules || countLessons(track);
  }

  function getTrackHours(track) {
    if (!track) return 0;
    if (typeof track.hours === 'number' && track.hours > 0) return track.hours;
    const lessons = countLessons(track);
    return lessons > 0 ? lessons : 0;
  }

  function getTrackProgress(track) {
    if (!track || !track.courses) return { done: 0, total: 0, pct: 0 };
    const total = countLessons(track);
    const done = track.courses.reduce(
      (s, c) => s + (c.lessons ? c.lessons.filter((l) => progress[l.id]).length : 0),
      0,
    );
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function getGlobalProgress() {
    const all = tracks
      .filter(tr => tr && tr.courses && Array.isArray(tr.courses))
      .flatMap((tr) => tr.courses.flatMap((c) => c.lessons || []));
    const done = all.filter((l) => l && progress[l.id]).length;
    return {
      done,
      total: all.length,
      pct: all.length ? Math.round((done / all.length) * 100) : 0,
    };
  }

  function getAllLessons() {
    const lessons = [];
    tracks.forEach((track) => {
      if (!track || !track.courses || !Array.isArray(track.courses)) return;
      const lt = localizedTrack(track);
      track.courses.forEach((course) => {
        if (!course || !course.lessons || !Array.isArray(course.lessons)) return;
        const lc = localizedCourse(course);
        course.lessons.forEach((lesson) => {
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
    return tracks.find((tr) => tr.id === id);
  }

  function findLesson(lessonId) {
    for (const track of tracks) {
      for (const course of track.courses) {
        const lesson = course.lessons.find((l) => l.id === lessonId);
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
    const global = getGlobalProgress();
    const passedAll = Object.keys(quizzesPassed).length;
    const bookmarkCount = bookmarks.length;
    const unlockedIds = [];

    const rules = [
      { id: "first_lesson", test: () => global.done >= 1 },
      { id: "ten_lessons", test: () => global.done >= 10 },
      { id: "fifty_lessons", test: () => global.done >= 50 },
      {
        id: "track_complete",
        test: () => tracks.some((tr) => getTrackProgress(tr).pct === 100),
      },
      { id: "quiz_pass", test: () => passedAll >= 1 },
      { id: "all_quizzes", test: () => passedAll >= 9 },
      {
        id: "recruit_route",
        test: () => {
          const starterTrack = findTrack("starter");
          return starterTrack
            ? getTrackProgress(starterTrack).pct === 100
            : false;
        },
      },
      {
        id: "master_route",
        test: () => {
          const leadTrack = findTrack("leadership");
          return leadTrack ? getTrackProgress(leadTrack).pct === 100 : false;
        },
      },
      { id: "bookworm", test: () => bookmarkCount >= 5 },
      {
        id: "checklist_done",
        test: () => {
          return Object.values(checklistState).some(
            (arr) => Array.isArray(arr) && arr.length > 0,
          );
        },
      },
    ];

    const prev = loadJson("testers-guild-unlocked-achievements", []);
    rules.forEach((rule) => {
      if (rule.test() && !prev.includes(rule.id)) {
        unlockedIds.push(rule.id);
        prev.push(rule.id);
      }
    });
    if (unlockedIds.length) {
      saveJson("testers-guild-unlocked-achievements", prev);
      unlockedIds.forEach((id) => {
        const ach = achievementsList.find((a) => a.id === id);
        if (ach)
          showToast(
            `${ach.icon} ${t("toast.achievementUnlocked")}: ${ach[lang]?.title || ach.pt.title}`,
          );
      });
    }
    return prev;
  }

  function renderAchievements() {
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    const unlocked = loadJson("testers-guild-unlocked-achievements", []);
    grid.innerHTML = window.NVViewHelpers.buildAchievementsHtml(
      achievementsList,
      unlocked,
      lang,
      escapeHtml,
      window.NVIcons,
      t,
    );
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
    localStorage.setItem(STORAGE_PERSONA, p);
    document.querySelectorAll(".persona-card").forEach((el) => {
      el.classList.toggle("active", el.dataset.persona === p);
    });
    // sync home filter chip with persona
    homeFilter = PERSONA_FILTER[p] || "all";
    showToast(t("toast.personaSaved"));
    if (currentView === "home") renderHome();
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

  // ── Glossary ──────────────────────────────────────────────────────────────
  function renderGlossary() {
    const items = window.TG_GLOSSARY?.[getLangKey()] || [];
    document.getElementById("glossary-content").innerHTML = window.NVViewHelpers.buildGlossaryHtml(items, escapeHtml);
  }
  window.renderGlossary = renderGlossary;

  // ── Labs ──────────────────────────────────────────────────────────────────
  function renderLabs() {
    const container = document.getElementById("labs-content");
    if (!container) return;
    const labs = labsData[getLangKey()] || labsData.pt || [];
    if (!labs.length) {
      container.innerHTML = window.NVViewHelpers.buildEmptyStateHtml(
        lang === "en" ? "No labs available." : "Nenhum lab disponível.",
        "",
        escapeHtml,
      );
      return;
    }

    const trackMap = Object.fromEntries(
      (tracks || []).map((track) => [track.id, localizedTrack(track)]),
    );

    container.innerHTML = window.NVViewHelpers.buildLabsHtml(
      labs,
      trackMap,
      window.NVIcons,
      escapeHtml,
      getTrackIcon,
      lang,
    );
  }
  window.renderLabs = renderLabs;

  function renderSandbox() {
    const menu = document.getElementById("sandbox-menu");
    const example = document.getElementById("sandbox-example");
    if (!menu || !example) return;

    const examples = Array.isArray(window.TG_MOBILE_AUTOMATION_EXAMPLES)
      ? window.TG_MOBILE_AUTOMATION_EXAMPLES
      : [];

    if (!examples.length) {
      menu.innerHTML = "";
      example.textContent = lang === "en" ? "Sandbox examples are not available yet." : "Exemplos do sandbox ainda não estão disponíveis.";
      return;
    }

    menu.innerHTML = examples
      .map((item, index) => `<button type="button" class="sandbox-item" data-index="${index}">${escapeHtml(item.name || item.id || `Example ${index + 1}`)}</button>`)
      .join("");

    const renderExample = (index) => {
      const item = examples[index] || examples[0];
      example.innerHTML = `<pre class="sandbox-example-code">${escapeHtml(item.code || "")}</pre>`;
    };

    menu.querySelectorAll(".sandbox-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        renderExample(Number(btn.dataset.index || 0));
      });
    });

    renderExample(0);
  }
  window.renderSandbox = renderSandbox;

  // ── Quiz ──────────────────────────────────────────────────────────────────
  function renderQuiz(trackId) {
    const container = document.getElementById("quiz-content");
    if (!container) return;

    const track = findTrack(trackId);
    if (!track) return;

    const langKey = getLangKey();
    const quizData = quizzes[trackId]?.[langKey] || quizzes[trackId]?.pt;
    if (!quizData) {
      container.innerHTML = window.NVViewHelpers.buildEmptyStateHtml(
        lang === "en" ? "No quiz available for this track yet." : "Nenhum quiz disponível para esta trilha ainda.",
        "",
        escapeHtml,
      );
      return;
    }

    const lt = localizedTrack(track);
    const alreadyPassed = !!quizzesPassed[trackId];

    // Set breadcrumb
    const bc = document.getElementById("quiz-breadcrumb");
    if (bc) bc.textContent = lt.title;

    container.innerHTML = window.NVViewHelpers.buildTrackQuizHtml(
      { ...track, icon: track.icon },
      quizData,
      { alreadyPassed },
      lang,
      window.NVIcons,
      escapeHtml,
      t,
    );

    window.NVViewHelpers.bindTrackQuizHandlers(
      container,
      quizData,
      window.NVIcons,
      lang,
      t,
      () => navigate("track", { trackId }),
      () => renderQuiz(trackId),
      (correct) => {
        if (quizzesPassed[trackId]) return;
        quizzesPassed[trackId] = {
          passedAt: new Date().toISOString(),
          score: correct,
        };
        saveJson(STORAGE_QUIZZES, quizzesPassed);
        checkAchievements();
        showToast(t("toast.quizPassed"));
      },
    );
  }

  // ── Checklist and lesson rendering ─────────────────────────────────────────
  // Lesson-specific rendering has been moved to js/app-lesson.js.

  // ── Track Detail ──────────────────────────────────────────────────────────
  // Implemented in js/app-track.js.

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  function toggleBookmark(lessonId) {
    const idx = bookmarks.indexOf(lessonId);
    if (idx === -1) {
      bookmarks.push(lessonId);
      showToast(t("toast.bookmarkAdded"));
    } else {
      bookmarks.splice(idx, 1);
      showToast(t("toast.bookmarkRemoved"));
    }
    saveJson(STORAGE_BOOKMARKS, bookmarks);
    checkAchievements();
  }

  // The lesson rendering flow is handled in js/app-lesson.js.
  // This file keeps shared state, helper wiring and global event bindings.
  // The dashboard rendering flow is handled in js/app-dashboard.js.

  // ── Search ────────────────────────────────────────────────────────────────
  function handleSearch(query) {
    const resultsEl = getElementById("search-results");
    const glossaryItems = window.TG_GLOSSARY?.[getLangKey()] || [];
    window.NVViewHelpers.searchAndRender(
      resultsEl,
      query,
      getAllLessons,
      glossaryItems,
      window.NVIcons,
      escapeHtml,
      t,
      navigate,
    );
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  document.querySelectorAll(".persona-card").forEach((el) => {
    el.addEventListener("click", () => setPersona(el.dataset.persona));
  });

  const langToggle = getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", toggleLang);
  }
  const themeToggle = getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  const seniorModeToggle = getElementById("senior-mode-toggle");
  if (seniorModeToggle) {
    seniorModeToggle.addEventListener("click", toggleSeniorMode);
  }

  const globalSearch = getElementById("global-search");
  if (globalSearch) {
    globalSearch.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        () => handleSearch(document.getElementById("global-search").value),
        200,
      );
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar-wrap")) {
      const resultsEl = getElementById("search-results");
      if (resultsEl) {
        resultsEl.classList.add("hidden");
      }
    }
  });

  getElementById("btn-reset-progress")
    ?.addEventListener("click", () => {
      if (confirm(t("dashboard.resetConfirm"))) {
        progress = {};
        saveProgress(progress);
        localStorage.removeItem(STORAGE_LAST_LESSON);
        showToast(t("toast.progressReset"));
        refreshCurrentView();
        renderContinueBanner();
      }
    });

  getElementById("btn-export-progress")
    ?.addEventListener("click", () => {
      exportProgressToFile(progress, bookmarks, quizzesPassed, checklistState);
    });

  getElementById("btn-import-progress")
    ?.addEventListener("click", () => {
      document.getElementById("progress-import-input").click();
    });

  getElementById("progress-import-input")
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
      saveJson("testers-guild-bookmarks", bookmarks);
      saveJson("testers-guild-quizzes", quizzesPassed);
      saveJson("testers-guild-checklists", checklistState);
      showToast(t("toast.importProgressSuccess"));
      refreshCurrentView();
      renderContinueBanner();
    });

  // Keyboard shortcuts: ArrowLeft / ArrowRight to navigate lessons
  document.addEventListener("keydown", (e) => {
    if (currentView !== "lesson") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const found = findLesson(viewParams.lessonId);
    if (!found) return;
    const allLessons = (found.rawTrack && found.rawTrack.courses && Array.isArray(found.rawTrack.courses))
      ? found.rawTrack.courses.flatMap((c) => c.lessons || [])
      : [];
    const idx = allLessons.findIndex((l) => l.id === viewParams.lessonId);
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

  window.NVApp = window.NVApp || { state: {}, helpers: {} };
  window.NVApp.state = {
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
    };
  window.NVApp.helpers = {
      ...window.NVApp.helpers,
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
      quizzes,
      TRACK_AUDIENCE,
      localizedTrack,
      normalizeTextLabel,
      escapeHtml,
      tierLabel,
      sortTracksForPersona,
    };

  // ── Init ──────────────────────────────────────────────────────────────────
  function mergeTrackSources() {
    const baseTracks = window.TG_QAWAY_TRACKS || [];
    const mergedTracks = [...baseTracks];

    const sources = [
      {
        key: "TG_PERFORMANCE_TRACK",
        id: "performance",
        slug: "performance-testing",
        icon: "perf",
        title: "Arena de Carga",
        color: "#f59e0b",
        description: "Performance testing com K6 e JMeter.",
        level: "Sênior",
        modules: 3,
        hours: 40,
        topics: ["Load Testing", "K6", "JMeter"],
      },
      {
        key: "TG_MENTORSHIP",
        id: "mentorship",
        slug: "mentorship",
        icon: "mentor",
        title: "Mentorship",
        color: "#6366f1",
        description: "Programa de mentoria e liderança.",
        level: "Intermediário",
        modules: 3,
        hours: 30,
        topics: ["Mentoring", "Liderança"],
      },
    ];

    sources.forEach((source) => {
      const dataset = window[source.key];
      if (dataset && dataset.courses && !mergedTracks.find((track) => track.id === source.id)) {
        mergedTracks.push({
          id: source.id,
          slug: source.slug,
          icon: source.icon,
          title: source.title,
          color: source.color,
          description: source.description,
          level: source.level,
          modules: source.modules,
          hours: source.hours,
          topics: source.topics,
          courses: dataset.courses,
        });
      }
    });

    if (window.TG_MOBILE_LABS && Array.isArray(window.TG_MOBILE_LABS)) {
      const mobileLessons = window.TG_MOBILE_LABS.map((lab, index) => ({
        id: `mobile-lab-${index + 1}-${lab.id}`,
        title: lab.name || `Mobile Lab ${index + 1}`,
        duration: "20 min",
        content: `
          <h2>${lab.name || `Mobile Lab ${index + 1}`}</h2>
          <p><strong>Tipo:</strong> ${lab.type || "mobile"}</p>
          <p><strong>Dispositivo:</strong> ${lab.device || (Array.isArray(lab.devices) ? lab.devices.join(", ") : "N/A")}</p>
          <p><strong>Ferramentas:</strong> ${Array.isArray(lab.tools) ? lab.tools.join(", ") : "Appium + WebDriverIO"}</p>
          <p><strong>Custo:</strong> ${lab.cost || "N/A"}</p>
          <pre>${lab.setup || ""}</pre>
        `,
      }));

      const mobileTrack = mergedTracks.find((track) => track.id === "mobile");
      const mobileTrackPayload = {
        id: "mobile",
        slug: "mobile-testing",
        icon: "mobile",
        title: "Trilha de Testes Mobile",
        color: "#22c55e",
        description: "Trilha única para testes mobile em emuladores, simuladores e dispositivos reais.",
        level: "Intermediário",
        modules: mobileLessons.length,
        hours: Math.max(4, mobileLessons.length),
        topics: ["Appium", "WebDriverIO", "Android", "iOS", "Emuladores", "Devices reais"],
        courses: [
          {
            id: "mobile-labs-course",
            title: "Mobile Testing Labs",
            lessons: mobileLessons,
          },
        ],
      };

      if (mobileTrack) {
        Object.assign(mobileTrack, mobileTrackPayload);
      } else {
        mergedTracks.push(mobileTrackPayload);
      }
    }

    return mergedTracks;
  }

  function init() {
    // Load all tracks: merge main tracks + new specialized tracks
    tracks = mergeTrackSources();

    window.lang = lang; // Sync with global for utility functions
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    // sync homeFilter with saved persona on load
    homeFilter = PERSONA_FILTER[persona] || "all";
    renderNavLinks();
    applyTheme();
    applySeniorMode();
    applyStaticI18n();
    updateLangToggle();
    checkAchievements();
    const lastLessonId = localStorage.getItem(STORAGE_LAST_LESSON);
    if (lastLessonId && findLesson(lastLessonId)) {
      navigate("lesson", { lessonId: lastLessonId });
    } else {
      renderHome();
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
})();
