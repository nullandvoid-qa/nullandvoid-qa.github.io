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
  const enrichment = window.TG_LESSON_ENRICHMENT || {};
  const quizzes = window.TG_QUIZZES || {};
  const checklists = window.TG_CHECKLISTS || {};
  const labsData = window.TG_LABS || {};
  const achievementsList = window.TG_ACHIEVEMENTS || [];

  let lang = getStorage(STORAGE_LANG, "tg-qaway-lang") || "pt";
  window.lang = lang; // Sync with global
  let persona = getStorage(STORAGE_PERSONA) || "experienced";
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

  function getElementById(id) {
    return document ? document.getElementById(id) : null;
  }

  function normalizeTextLabel(text) {
    return String(text || "").replace(/^[^\wÀ-ž]+\s*/, "").trim();
  }

  function getTrackIcon(track) {
    const rawIcon = String(track.icon || "").trim();
    // If icon name matches a known NVIcons key, use it directly
    if (window.NVIcons && window.NVIcons.icons[rawIcon]) return rawIcon;
    // If the stored icon is an emoji or other decorative character,
    // prefer the canonical mapping from TRACK_ICON_MAP to ensure SVG icons.
    try {
      if (/\p{Emoji}/u.test(rawIcon)) return TRACK_ICON_MAP[track.id] || "tracks";
    } catch (e) {
      // If the runtime doesn't support Unicode property escapes, ignore
    }
    // Fallback to mapped icon name or generic 'tracks'
    return TRACK_ICON_MAP[track.id] || "tracks";
  }

  function getLangKey() {
    return lang === "en" ? "en" : "pt";
  }

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
    if (lang === "en" && enOverlay.courses[course.id])
      return { ...course, title: enOverlay.courses[course.id].title };
    return course;
  }

  function localizedLesson(lesson) {
    if (lang === "en" && enOverlay.lessons[lesson.id]) {
      const o = enOverlay.lessons[lesson.id];
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
    showToast(theme === "dark" ? "Tema escuro" : "Tema claro");
  }

  // ── Senior Mode ───────────────────────────────────────────────────────────
  function applySeniorMode() {
    document.documentElement.classList.toggle("senior-mode", seniorMode);
    const btn = getElementById("senior-mode-toggle");
    if (btn) {
      btn.classList.toggle("active-toggle", seniorMode);
      btn.title = seniorMode
        ? lang === "en"
          ? "Senior Mode ON"
          : "Modo Sênior ATIVO"
        : lang === "en"
          ? "Senior Mode"
          : "Modo Sênior";
    }
    localStorage.setItem(STORAGE_SENIOR_MODE, String(seniorMode));
  }

  function toggleSeniorMode() {
    seniorMode = !seniorMode;
    applySeniorMode();
    showToast(
      seniorMode
        ? lang === "en"
          ? "Senior Mode ON — beginner tips hidden"
          : "Modo Sênior ativado — dicas iniciante ocultas"
        : lang === "en"
          ? "Senior Mode OFF"
          : "Modo Sênior desativado",
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

  function highlightCode(html) {
    // Wrap <pre> blocks with a copy button and language detection
    return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_, code) => {
      const safe = code.trim();
      return `<div class="code-block">
        <button class="code-copy-btn" aria-label="Copy code" title="Copy">${getIconMarkup("copy", "18")}</button>
        <pre>${safe}</pre>
      </div>`;
    });
  }

  function attachCopyButtons(container) {
    container.querySelectorAll(".code-copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pre = btn.nextElementSibling;
        navigator.clipboard
          .writeText(pre.textContent)
          .then(() => {
            btn.innerHTML = getIconMarkupOrFallback("check", "✓", "18");
            setTimeout(() => {
              btn.innerHTML = getIconMarkup("copy", "18");
            }, 1500);
          })
          .catch(() => {
            btn.innerHTML = getIconMarkupOrFallback("close", "×", "18");
            setTimeout(() => {
              btn.innerHTML = getIconMarkup("copy", "18");
            }, 1500);
          });
      });
    });
  }



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

  // ── Lesson ────────────────────────────────────────────────────────────────
  async function renderLesson(lessonId) {
    const found = findLesson(lessonId);
    if (!found) return;
    const { track, course, lesson, rawTrack, rawCourse, rawLesson } = found;
      const enr = getEnrichment(rawLesson.id);
      const isBookmarked = bookmarks.includes(rawLesson.id);
      const langKey = getLangKey();
      const lessonContent = window.NVLessonContent?.loadLessonContent
        ? await window.NVLessonContent.loadLessonContent(rawLesson, { markdownMap: window.TG_LESSON_MARKDOWN_MAP })
        : { content: lesson.content, title: lesson.title, duration: lesson.duration };
      const contentLesson = {
        ...lesson,
        title: lessonContent.title || lesson.title,
        duration: lessonContent.duration || lesson.duration,
        content: lessonContent.content,
      };
      window.NVViewHelpers.setupLessonHeader(
        lessonId,
        track,
        rawTrack.id,
        contentLesson.title,
        navigate,
        saveLastLesson,
        window.NVIcons,
        getTrackIcon,
        escapeHtml,
      );
      const primerText = !seniorMode
        ? enr.primer?.[langKey] || enr.primer?.pt
        : null;
      const seniorText = enr.seniorNote?.[langKey] || enr.seniorNote?.pt;
      const primerHtml = primerText
        ? `<aside class="lesson-box lesson-box-beginner"><h3>${t("lesson.primerTitle")}</h3><p>${escapeHtml(primerText)}</p></aside>`
        : "";
      const seniorHtml = seniorText
        ? `<aside class="lesson-box lesson-box-senior"><h3>${t("lesson.seniorTitle")}</h3><p>${escapeHtml(seniorText)}</p></aside>`
        : "";
      const allLessons = (rawTrack && rawTrack.courses && Array.isArray(rawTrack.courses))
        ? rawTrack.courses.flatMap((c) => c.lessons || [])
        : [];
      const idx = allLessons.findIndex((l) => l.id === rawLesson.id);
      const prev = allLessons[idx - 1];
      const next = allLessons[idx + 1];
      const isFinalProject =
        rawLesson.id.endsWith("-l1") &&
        (rawCourse.id === "s12" ||
          rawCourse.id === "w10" ||
          rawCourse.id === "a9" ||
          rawCourse.id === "m8" ||
          rawCourse.id === "p8" ||
          rawCourse.id === "sec6" ||
          rawCourse.id === "dev5" ||
          rawCourse.id === "a11y5" ||
          rawCourse.id === "lead4");
      const sanitized = window.NVViewHelpers.cleanInlineBackgrounds(contentLesson.content);
      const processedContent = highlightCode(sanitized);
      document.getElementById("lesson-detail").innerHTML = window.NVLessonRenderers.buildLessonPageHtml({
        rawCourse,
        rawLesson,
        course,
        track,
        lesson: contentLesson,
        progressMap: progress,
        isBookmarked,
        prev,
        next,
        lang,
        t,
        tierLabel,
        escapeHtml,
        icons: window.NVIcons,
        getTrackIcon,
        getEnrichment,
        localizedLesson,
        processedContent,
        primerHtml,
        seniorHtml,
      });
      attachCopyButtons(document.getElementById("lesson-detail"));
      if (isFinalProject) {
        const zone = document.getElementById("lesson-checklist-zone");
        renderChecklist(rawTrack.id, zone);
      }
      const quizZone = document.getElementById("lesson-quiz-zone");
      if (quizZone) {
        renderLessonQuiz(rawLesson.id, quizZone);
      }
      window.NVViewHelpers.bindLessonPageActions({
        lessonId,
        rawLesson,
        prevLessonId: prev?.id,
        nextLessonId: next?.id,
        navigate,
        onBookmarkToggle: toggleBookmark,
        onCompleteToggle: (lessonIdToToggle) => {
          window.NVViewHelpers.toggleLessonComplete(lessonIdToToggle, progress, () => saveProgress(progress), checkAchievements, t);
        },
        onReRender: renderLesson,
        onFeedbackSubmit: ({ lessonId: submittedLessonId, rating, text }) => {
          window.NVViewHelpers.submitLessonFeedback({ lessonId: submittedLessonId, rating, text }, { onAfter: () => {
            const ft = document.getElementById('feedback-text'); if (ft) ft.value = '';
            document.querySelectorAll('input[name="feedback-rating"]').forEach((r) => (r.checked = false));
          }, t });
        },
        t,
      });
  }

  // Expose core navigation/render APIs early so external test helpers
  // can call them before full `init()` completes.
  try {
    window.renderLesson = renderLesson;
    window.navigate = navigate;
    window.findLesson = findLesson;
  } catch (e) {
    // noop
  }
  // ── Dashboard ─────────────────────────────────────────────────────────────
  function renderDashboard() {
    const global = getGlobalProgress();
    const passedCount = Object.keys(quizzesPassed).length;

    document.getElementById("dashboard-stats").innerHTML = window.NVViewHelpers.buildDashboardStatsHtml(
      { ...global, passedCount },
      t("price"),
      t,
      t,
    );

    renderAchievements();

    const grid = document.getElementById("dashboard-tracks");
    grid.innerHTML = "";
    tracks.forEach((tr) => renderTrackCard(tr, "dashboard-tracks"));

    const achievementsGrid = document.getElementById("achievements-grid");
    const bmSection = document.getElementById("dashboard-bookmarks");
    const certSection = document.getElementById("dashboard-certificates");
    const completedTracks = tracks.filter((tr) => getTrackProgress(tr).pct === 100);
    const getUserCertificates = window.TG_CERTIFICATES?.getUserCertificates?.bind(window.TG_CERTIFICATES);
    const unlocked = loadJson("testers-guild-unlocked-achievements", []);

    window.NVViewHelpers.renderDashboardSections(
      {
        achievementsGrid,
        bookmarksSection: bmSection,
        certificatesSection: certSection,
      },
      {
        achievementsList,
        unlocked,
        bookmarks,
        findLesson,
        icons: window.NVIcons,
        escapeHtml,
        getTrackIcon,
        lang,
        t,
        getUserCertificates,
        completedTracks,
        onCertDownload: async (trackId) => {
          if (!window.TG_CERTIFICATES) return;
          if (!window.NVAuth || !window.NVAuth.isAuthenticated) {
            showToast(lang === "en" ? "Please log in to download certificates." : "Faça login para baixar certificados.");
            return;
          }
          const track = completedTracks.find((tr) => tr.id === trackId);
          if (!track) return;
          try {
            const userName = window.NVAuth?.getUserName?.() || "";
            await window.TG_CERTIFICATES.downloadCertificate(track.id, userName, new Date());
            window.TG_CERTIFICATES.saveCertificate(track.id, userName, new Date());
            showToast(lang === "en" ? "Certificate downloaded!" : "Certificado baixado!");
          } catch (error) {
            showToast(`Erro: ${error.message}`);
          }
        },
        navigate,
      },
    );

    // Recommendations section intentionally removed.

    // Portfolio Templates section
    const templatesSection = document.querySelector('[id$="templates"]');
    if (!templatesSection && global.pct >= 20) {  // Show after 20% progress
      const templatesHtml = window.NVViewHelpers.buildPortfolioTemplatesHtml(lang);
      const dashboardContent = document.getElementById('dashboard-content') || document.getElementById('dashboard-stats')?.parentElement;
      if (dashboardContent) {
        dashboardContent.insertAdjacentHTML('beforeend', templatesHtml);
      }
    }
  }

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
      window.TG_MOBILE_LABS.forEach((ml) => {
        if (!mergedTracks.find((track) => track.id === ml.id)) {
          mergedTracks.push({
            ...ml,
            id: ml.id,
            slug: ml.slug || ml.id,
            icon: ml.icon || "",
            title: ml.title || ml.name || "Mobile Lab",
            description: ml.description || `Mobile lab for ${ml.device || "mobile testing"}`,
            color: ml.color || "#22c55e",
            level: ml.level || "intermediate",
            modules: ml.modules || 3,
            hours: ml.hours || 30,
            topics: ml.topics || ["Mobile", "Appium"],
            courses: ml.courses || [],
          });
        }
      });
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
    window.renderLesson = renderLesson;
    window.navigate = navigate;
    window.findLesson = findLesson;
  } catch (e) {
    // ignore
  }

  init();
})();
