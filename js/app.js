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
  let quizState = {};

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
  function loadProgress() {
    try {
      // Se usuario está autenticado, carrega progresso dele
      if (window.NVAuth && window.NVAuth.isAuthenticated) {
        const userProgress = window.NVAuth.getProgress();
        if (Object.keys(userProgress).length > 0) {
          return validateProgressData(userProgress) ? userProgress : {};
        }
      }

      return getStoredProgress([STORAGE_PROGRESS, "tg-qaway-progress"], {});
    } catch {
      return {};
    }
  }

  function saveProgress() {
    // Se usuario está autenticado, salva progresso dele
    if (window.NVAuth && window.NVAuth.isAuthenticated) {
      window.NVAuth.setProgress(progress);
    }

    // Também salva no storage padrão como backup
    persistProgress([STORAGE_PROGRESS], progress);
  }
  function saveLastLesson(id) {
    localStorage.setItem(STORAGE_LAST_LESSON, id);
  }

  function exportProgressToFile() {
    try {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        progress,
        bookmarks,
        quizzesPassed,
        checklists: checklistState,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nullandvoid-qa-progress.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t("toast.exportProgressSuccess"));
    } catch (error) {
      console.error(error);
      showToast(t("toast.exportProgressFail"));
    }
  }

  async function importProgressFromFile(file) {
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (
        typeof payload !== "object" ||
        payload === null ||
        !validateProgressData(payload.progress) ||
        !validateBookmarksData(payload.bookmarks) ||
        !validateQuizzesPassedData(payload.quizzesPassed) ||
        !window.validateChecklistState(payload.checklists)
      ) {
        showToast(t("toast.invalidProgressFile"));
        return;
      }

      if (!confirm(t("dashboard.importConfirm"))) return;

      progress = payload.progress;
      bookmarks.length = 0;
      bookmarks.push(...payload.bookmarks);
      Object.assign(quizzesPassed, payload.quizzesPassed);
      Object.keys(checklistState).forEach((key) => delete checklistState[key]);
      Object.assign(checklistState, payload.checklists);
      saveProgress();
      saveJson(STORAGE_BOOKMARKS, bookmarks);
      saveJson(STORAGE_QUIZZES, quizzesPassed);
      saveJson(STORAGE_CHECKLISTS, checklistState);
      showToast(t("toast.importProgressSuccess"));
      refreshCurrentView();
      renderContinueBanner();
    } catch (error) {
      console.error(error);
      showToast(t("toast.importProgressFail"));
    }
  }

  // ── i18n ──────────────────────────────────────────────────────────────────
  function t(key) {
    const parts = key.split(".");
    let node = window.TG_I18N?.[lang];
    for (const p of parts) {
      if (!node || node[p] === undefined) return key;
      node = node[p];
    }
    return node;
  }

  // Expose translation helper for auth and other external modules
  window.t = t;

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
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const iconName = theme === "dark" ? "moon" : "sun";
      btn.innerHTML = window.NVIcons ? window.NVIcons.get(iconName, '', '18') : '';
      btn.setAttribute('aria-label', theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
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
    const btn = document.getElementById("senior-mode-toggle");
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
    applyStaticI18n();
    updateLangToggle();
    refreshCurrentView();
    showToast(t("toast.langChanged"));
  }

  function toggleLang() {
    setLang(lang === "pt" ? "en" : "pt");
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    const priceEl = document.getElementById("stat-price");
    if (priceEl) priceEl.textContent = t("price");
  }

  function updateLangToggle() {
    const btn = document.getElementById("lang-toggle");
    const label = document.getElementById("lang-label");
    const flag = btn?.querySelector(".lang-flag");
    if (label) label.textContent = t("lang.toggle");
    if (flag) flag.textContent = lang === "pt" ? "🇧🇷" : "🇺🇸";
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  window.nvToast = window.nvToast || { queue: [], isShowing: false, timer: null };
  function showToast(msg) {
    const el = document.getElementById("toast");
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

  function highlightCode(html) {
    // Wrap <pre> blocks with a copy button and language detection
    return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_, code) => {
      const safe = code.trim();
      return `<div class="code-block">
        <button class="code-copy-btn" aria-label="Copy code" title="Copy">${window.NVIcons ? window.NVIcons.get('copy','','18') : ''}</button>
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
            btn.innerHTML = window.NVIcons ? window.NVIcons.get('check','','18') : '✓';
            setTimeout(() => {
              btn.innerHTML = window.NVIcons ? window.NVIcons.get('copy','','18') : '';
            }, 1500);
          })
          .catch(() => {
            btn.innerHTML = window.NVIcons ? window.NVIcons.get('close','','18') : '×';
            setTimeout(() => {
              btn.innerHTML = window.NVIcons ? window.NVIcons.get('copy','','18') : '';
            }, 1500);
          });
      });
    });
  }

  // ── Sandbox Examples ──────────────────────────────────────────────────────
  const SANDBOX_EXAMPLES = {
    "playwright-basics": {
      title: "Playwright: Seu primeiro teste",
      description: "Login e validação básica em Sauce Demo",
      language: "javascript",
      code: `// Playwright - Login Test
import { test, expect } from '@playwright/test';

test('Login to Sauce Demo', async ({ page }) => {
  // 1. Navega para a URL
  await page.goto('https://www.saucedemo.com');
  
  // 2. Preenche credenciais
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  
  // 3. Clica login
  await page.click('[data-test="login-button"]');
  
  // 4. Valida que chegou na página de produtos
  await expect(page).toHaveURL('**/inventory.html');
  const title = await page.locator('.title').textContent();
  expect(title).toBe('Products');
});`,
      explanation: {
        pt: "Este teste demonstra os passos básicos: navegar, preencher campos, clicar e validar.",
        en: "This test demonstrates basic steps: navigate, fill fields, click, and assert."
      },
      output: "✓ Login to Sauce Demo (2.3s)",
      track: "web"
    },
    "api-rest-basics": {
      title: "API Testing: CRUD com Postman",
      description: "Testar endpoints REST com validação",
      language: "javascript",
      code: `// Postman Collection JSON - GET User
{
  "info": { "name": "ReqRes API Tests" },
  "item": [
    {
      "name": "Get User #1",
      "request": {
        "method": "GET",
        "url": "https://reqres.in/api/users/1"
      },
      "test": [
        "pm.test('Status 200', function() {",
        "  pm.response.to.have.status(200);",
        "});",
        "pm.test('Response has id', function() {",
        "  var json = pm.response.json();",
        "  pm.expect(json.data.id).to.equal(1);",
        "  pm.expect(json.data.email).to.include('@reqres.in');",
        "});"
      ]
    }
  ]
}`,
      explanation: {
        pt: "Testes de API verificam status, headers, body e validações de schema.",
        en: "API tests check status, headers, body, and schema validations."
      },
      output: "✓ Status 200\n✓ Response has id",
      track: "api"
    },
    "performance-k6": {
      title: "Performance: Load Test com K6",
      description: "Simular carga em API/aplicação",
      language: "javascript",
      code: `// K6 Load Test Script
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,           // 10 usuários virtuais
  duration: '30s',   // 30 segundos de carga
  thresholds: {
    http_req_duration: ['p(95)<200'],  // 95% < 200ms
    http_req_failed: ['<1%']            // < 1% de falhas
  }
};

export default function () {
  const res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 300ms': (r) => r.timings.duration < 300,
  });
}`,
      explanation: {
        pt: "K6 simula múltiplos usuários para encontrar gargalos antes da produção.",
        en: "K6 simulates multiple users to find bottlenecks before production."
      },
      output: null,
      track: "performance"
    },
    "security-owasp": {
      title: "Segurança: OWASP Top 10",
      description: "Testando vulnerabilidades comuns",
      language: "text",
      code: `OWASP Top 10 — Vulnerabilidades mais críticas

1. SQL Injection
   Teste: ' OR '1'='1
   Lab: DVWA, OWASP Juice Shop

2. Broken Authentication
   Teste: Força bruta de senha
   Lab: OWASP Juice Shop

3. Sensitive Data Exposure
   Teste: Dados em HTTPS? Senhas hasheadas?
   Lab: Inspecionar localStorage

4. Broken Access Control
   Teste: Alterar URL de ID (user/1 → user/admin)
   Lab: OWASP Juice Shop profile bypass`,
      explanation: {
        pt: "Entender vulnerabilidades é parte essencial do job de QA sênior.",
        en: "Understanding vulnerabilities is essential for senior QA role."
      },
      output: null,
      track: "security"
    }
  };

  function renderSandbox() {
    const container = document.getElementById("view-sandbox");
    if (!container) return;

    container.innerHTML = window.NVViewHelpers.buildSandboxPageHtml();
    renderSandboxMenu();

    const firstKey = Object.keys(SANDBOX_EXAMPLES)[0];
    if (firstKey) loadSandboxExample(firstKey);
  }

  function renderSandboxMenu() {
    const menu = document.getElementById("sandbox-menu");
    if (!menu) return;

    const byTrack = {};
    Object.entries(SANDBOX_EXAMPLES).forEach(([key, ex]) => {
      if (!byTrack[ex.track]) byTrack[ex.track] = [];
      byTrack[ex.track].push({ key, ...ex });
    });

    const trackTitles = {
      web: "Web Testing",
      api: "API Testing",
      performance: "Performance",
      security: "Segurança"
    };

    menu.innerHTML = window.NVViewHelpers.buildSandboxMenuHtml(
      byTrack,
      trackTitles,
      escapeHtml,
    );

    menu.querySelectorAll(".sandbox-item").forEach((btn) => {
      btn.addEventListener("click", () => loadSandboxExample(btn.dataset.key));
    });
  }

  function loadSandboxExample(key) {
    const example = SANDBOX_EXAMPLES[key];
    if (!example) return;

    const container = document.getElementById("sandbox-example");
    if (!container) return;

    const explanation = example.explanation[lang] || example.explanation.pt;

    container.innerHTML = window.NVViewHelpers.buildSandboxExampleHtml(
      example,
      key,
      window.NVIcons,
      escapeHtml,
      lang,
    );
  }

  window.copySandboxCode = function(key) {
    const example = SANDBOX_EXAMPLES[key];
    if (!example) return;
    navigator.clipboard.writeText(example.code).then(() => {
      showToast(t("toast.copySuccess"));
    });
  };

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
  function navigate(view, params = {}) {
    currentView = view;
    viewParams = params;
    window.NVViewHelpers.setActiveView(document, view, "tracks");

    if (view === "home") renderHome();
    else if (view === "tracks") renderTracksPage();
    else if (view === "roadmap") renderRoadmap();
    else if (view === "glossary") renderGlossary();
    else if (view === "sandbox") renderSandbox();
    else if (view === "labs") renderLabs();
    else if (view === "track" && params.trackId)
      renderTrackDetail(params.trackId);
    else if (view === "lesson" && params.lessonId)
      renderLesson(params.lessonId);
    else if (view === "quiz" && params.trackId) renderQuiz(params.trackId);
    else if (view === "dashboard") renderDashboard();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function refreshCurrentView() {
    navigate(currentView, viewParams);
  }

  // ── Track card ────────────────────────────────────────────────────────────
  function renderTrackCard(track, containerId, opts = {}) {
    const lt = localizedTrack(track);
    const prog = getTrackProgress(track);
    const container = document.getElementById(containerId);
    if (!container) return;
    const audience = TRACK_AUDIENCE[track.id] || "intermediate";
    const isComplete = prog.pct === 100;

    const iconName = getTrackIcon(track);
    const iconHtml = window.NVIcons
      ? window.NVIcons.get(iconName, "track-icon-svg", "28")
      : escapeHtml(track.icon || "");
    const title = normalizeTextLabel(lt.title);

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
      lang,
      icons: window.NVIcons,
      escapeHtml,
      t,
      tierLabel,
    });

    const card = document.createElement("div");
    card.innerHTML = cardMarkup;
    const cardElement = card.firstElementChild;
    if (cardElement) {
      cardElement.style.setProperty("--track-color", track.color);
      const open = () => navigate("track", { trackId: track.id });
      window.NVViewHelpers.bindAccessibleAction(cardElement, open);
      container.appendChild(cardElement);
    }
  }

  // ── Continue banner ───────────────────────────────────────────────────────
  function renderContinueBanner() {
    const banner = document.getElementById("continue-banner");
    window.NVViewHelpers.renderContinueBanner(
      banner,
      null,
      findLesson,
      getTrackIcon,
      escapeHtml,
      t,
      navigate,
      window.NVIcons,
      STORAGE_LAST_LESSON,
    );
  }

  // ── Home Lessons ──────────────────────────────────────────────────────────
  function renderHomeLessons() {
    // Recommendations are disabled, render nothing.
  }

  // ── Home ──────────────────────────────────────────────────────────────────
  function renderHomeFilterBar() {
    const bar = document.getElementById("home-filter-bar");
    if (!bar) return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    window.NVViewHelpers.wireFilterBar(
      bar,
      filters,
      homeFilter,
      t,
      (nextFilter) => {
        homeFilter = nextFilter;
        renderHome();
      },
    );
  }

  function renderHome() {
    const global = getGlobalProgress();
    window.NVViewHelpers.renderHomeView(
      {
        global,
        tracks,
        persona,
        homeFilter,
        lang,
        avatarIcons: window.NVIcons,
        getTrackIcon,
        escapeHtml,
        t,
        renderTrackCard,
        renderHomeFilterBar,
        renderContinueBanner,
        renderHomeLessons,
        renderInstallBanner,
      },
    );
  }

  /**
   * Render PWA install prompt banner
   */
  function renderInstallBanner() {
    const banner = document.getElementById("install-banner");
    window.NVViewHelpers.renderInstallBanner(banner);
  }

  // ── Tracks page ───────────────────────────────────────────────────────────
  function renderFilterBar() {
    const bar = document.getElementById("track-filter-bar");
    if (!bar) return;
    const filters = ["all", "beginner", "intermediate", "senior"];
    window.NVViewHelpers.wireFilterBar(
      bar,
      filters,
      trackFilter,
      t,
      (nextFilter) => {
        trackFilter = nextFilter;
        renderTracksPage();
      },
    );
  }

  function renderTracksPage() {
    renderFilterBar();
    const grid = document.getElementById("tracks-grid");
    grid.innerHTML = "";
    const filtered =
      trackFilter === "all"
        ? sortTracksForPersona(tracks)
        : tracks.filter((tr) => TRACK_AUDIENCE[tr.id] === trackFilter);
    filtered.forEach((tr) =>
      renderTrackCard(tr, "tracks-grid", { showRecommend: true }),
    );
  }

  // ── Roadmap ───────────────────────────────────────────────────────────────
  function renderRoadmap() {
    const container = document.getElementById("roadmap-content");
    const roadmaps = window.TG_ROADMAPS || {};
    window.NVViewHelpers.renderRoadmap(container, roadmaps, lang, t, escapeHtml, navigate);
  }

  // ── Glossary ──────────────────────────────────────────────────────────────
  function renderGlossary() {
    const items = window.TG_GLOSSARY?.[lang === "en" ? "en" : "pt"] || [];
    document.getElementById("glossary-content").innerHTML = window.NVViewHelpers.buildGlossaryHtml(items, escapeHtml);
  }

  // ── Labs ──────────────────────────────────────────────────────────────────
  function renderLabs() {
    const container = document.getElementById("labs-content");
    if (!container) return;
    const labs = labsData[lang === "en" ? "en" : "pt"] || labsData.pt || [];
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

    const langKey = lang === "en" ? "en" : "pt";
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

    // Reset quiz state for this track
    quizState = { trackId, answers: {}, submitted: false };

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

  // ── Checklist ─────────────────────────────────────────────────────────────
  function renderChecklist(trackId, container) {
    const langKey = lang === "en" ? "en" : "pt";
    const data = checklists[trackId]?.[langKey] || checklists[trackId]?.pt;
    if (!data) return "";

    const savedItems = checklistState[trackId] || [];
    const html = window.NVViewHelpers.buildChecklistHtml(
      trackId,
      data,
      savedItems,
      lang,
      window.NVIcons,
      escapeHtml,
      t,
    );

    if (container) {
      container.insertAdjacentHTML("beforeend", html);
      window.NVViewHelpers.bindChecklistHandlers(
        container,
        trackId,
        data,
        checklistState,
        t,
        (updatedState) => saveJson(STORAGE_CHECKLISTS, updatedState),
        () => {
          checkAchievements();
          showToast(
            lang === "en"
              ? "Project checklist complete!"
              : "Checklist do projeto completo!",
          );
        },
      );
    }
    return html;
  }

  // ── Lesson Quiz (inline) ──────────────────────────────────────────────────
  function renderLessonQuiz(lessonId, container) {
    const lessonQuizzes = window.TG_LESSON_QUIZZES || {};
    const langKey = lang === "en" ? "en" : "pt";
    const quizData = lessonQuizzes[lessonId]?.[langKey] || lessonQuizzes[lessonId]?.pt;
    if (!quizData) return; // No quiz for this lesson

    if (container) {
      window.NVViewHelpers.renderLessonQuiz(
        lessonId,
        container,
        quizData,
        lang,
        window.NVIcons,
        escapeHtml,
        t,
      );
    }
  }

  // ── Track Detail ──────────────────────────────────────────────────────────
  function renderTrackDetail(trackId) {
    const raw = findTrack(trackId);
    if (!raw) return;
    const track = localizedTrack(raw);
    document.getElementById("track-breadcrumb").textContent = track.title;
    const prog = getTrackProgress(raw);
    const hasQuiz = !!quizzes[trackId];

    const coursesHtml = window.NVViewHelpers.buildTrackCoursesHtml(
      raw,
      progress,
      getEnrichment,
      localizedLesson,
      localizedCourse,
      escapeHtml,
      t,
      window.NVIcons,
      getTrackIcon,
    );

    const container = document.getElementById("track-detail");
    window.NVViewHelpers.renderTrackDetail(
      container,
      { ...track, icon: track.icon },
      coursesHtml,
      prog,
      {
        modules: getTrackModules(raw),
        hours: getTrackHours(raw),
        audience: TRACK_AUDIENCE[raw.id],
      },
      {
        icons: window.NVIcons,
        escapeHtml,
        t,
        tierLabel,
        getTrackIcon,
      },
      navigate,
      hasQuiz,
    );
  }

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
  function renderLesson(lessonId) {
    const found = findLesson(lessonId);
    if (!found) return;
    const { track, course, lesson, rawTrack, rawCourse, rawLesson } = found;
      const done = !!progress[rawLesson.id];
      const enr = getEnrichment(rawLesson.id);
      const isBookmarked = bookmarks.includes(rawLesson.id);
      const langKey = lang === "en" ? "en" : "pt";
      window.NVViewHelpers.setupLessonHeader(
        lessonId,
        track,
        rawTrack.id,
        lesson.title,
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
      const sanitized = window.NVViewHelpers.cleanInlineBackgrounds(lesson.content);
      const processedContent = highlightCode(sanitized);
      document.getElementById("lesson-detail").innerHTML = window.NVLessonRenderers.buildLessonPageHtml({
        rawCourse,
        rawLesson,
        course,
        track,
        lesson,
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
          window.NVViewHelpers.toggleLessonComplete(lessonIdToToggle, progress, saveProgress, checkAchievements, t);
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
          const track = completedTracks.find((tr) => tr.id === trackId);
          if (!track) return;
          try {
            const userName = window.NVAuth?.getUserName?.() || "Learner";
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

      if (recSection) {
        recSection.insertAdjacentHTML('afterend', templatesHtml);
      }
    }
  }

  // ── Search ────────────────────────────────────────────────────────────────
  function handleSearch(query) {
    const resultsEl = document.getElementById("search-results");
    const glossaryItems = window.TG_GLOSSARY?.[lang === "en" ? "en" : "pt"] || [];
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
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });

  document.querySelectorAll(".persona-card").forEach((el) => {
    el.addEventListener("click", () => setPersona(el.dataset.persona));
  });

  document.getElementById("lang-toggle").addEventListener("click", toggleLang);
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  const seniorModeToggle = document.getElementById("senior-mode-toggle");
  if (seniorModeToggle) {
    seniorModeToggle.addEventListener("click", toggleSeniorMode);
  }

  const globalSearch = document.getElementById("global-search");
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
    if (!e.target.closest(".search-bar-wrap"))
      document.getElementById("search-results").classList.add("hidden");
  });

  document
    .getElementById("btn-reset-progress")
    ?.addEventListener("click", () => {
      if (confirm(t("dashboard.resetConfirm"))) {
        progress = {};
        saveProgress();
        localStorage.removeItem(STORAGE_LAST_LESSON);
        showToast(t("toast.progressReset"));
        refreshCurrentView();
        renderContinueBanner();
      }
    });

  document
    .getElementById("btn-export-progress")
    ?.addEventListener("click", () => {
      exportProgressToFile();
    });

  document
    .getElementById("btn-import-progress")
    ?.addEventListener("click", () => {
      document.getElementById("progress-import-input").click();
    });

  document
    .getElementById("progress-import-input")
    ?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      importProgressFromFile(file);
      event.target.value = "";
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
    saveProgress();
    showToast(t("toast.progressSavedLocal"));
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    // Load all tracks: merge main tracks + new specialized tracks
    tracks = window.TG_QAWAY_TRACKS || [];
    
    // Merge new track structures — ensure all required fields are present
    if (window.TG_PERFORMANCE_TRACK && window.TG_PERFORMANCE_TRACK.courses) {
      const pt = window.TG_PERFORMANCE_TRACK;
      if (!tracks.find(t => t.id === 'performance')) {
        tracks.push({
          id: pt.id || 'performance',
          slug: pt.slug || 'performance-testing',
          icon: 'perf',
          title: pt.title || 'Arena de Carga',
          color: pt.color || '#f59e0b',
          description: pt.description || 'Performance testing com K6 e JMeter.',
          level: pt.level || 'Sênior',
          modules: pt.modules || 3,
          hours: pt.hours || 40,
          topics: pt.topics || ['Load Testing', 'K6', 'JMeter'],
          courses: pt.courses
        });
      }
    }
    if (window.TG_MENTORSHIP && window.TG_MENTORSHIP.courses) {
      const mt = window.TG_MENTORSHIP;
      if (!tracks.find(t => t.id === 'mentorship')) {
        tracks.push({
          id: mt.id || 'mentorship',
          slug: mt.slug || 'mentorship',
          icon: 'mentor',
          title: mt.title || 'Mentorship',
          color: mt.color || '#6366f1',
          description: mt.description || 'Programa de mentoria e liderança.',
          level: mt.level || 'Intermediário',
          modules: mt.modules || 3,
          hours: mt.hours || 30,
          topics: mt.topics || ['Mentoring', 'Liderança'],
          courses: mt.courses
        });
      }
    }
    if (window.TG_MOBILE_LABS && Array.isArray(window.TG_MOBILE_LABS)) {
      window.TG_MOBILE_LABS.forEach((ml) => {
        if (!tracks.find((t) => t.id === ml.id)) {
          tracks.push({
            ...ml,
            id: ml.id,
            slug: ml.slug || ml.id,
            icon: ml.icon || '',
            title: ml.title || ml.name || 'Mobile Lab',
            description:
              ml.description ||
              `Mobile lab for ${ml.device || 'mobile testing'}`,
            color: ml.color || '#22c55e',
            level: ml.level || 'intermediate',
            modules: ml.modules || 3,
            hours: ml.hours || 30,
            topics: ml.topics || ['Mobile', 'Appium'],
            courses: ml.courses || [],
          });
        }
      });
    }

    window.lang = lang; // Sync with global for utility functions
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    // sync homeFilter with saved persona on load
    homeFilter = PERSONA_FILTER[persona] || "all";
    applyTheme();
    applySeniorMode();
    applyStaticI18n();
    updateLangToggle();
    checkAchievements();
    renderHome();

    // Register Service Worker for PWA support
    if ('serviceWorker' in navigator) {
      const basePath = location.pathname.endsWith('/')
        ? location.pathname
        : location.pathname.replace(/\/[^/]+$/, '/');
      const swUrl = new URL('service-worker.js', location.href).href;

      navigator.serviceWorker.register(swUrl, { scope: basePath })
        .then(() => {
          console.log('[PWA] Service Worker registered');
        })
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
