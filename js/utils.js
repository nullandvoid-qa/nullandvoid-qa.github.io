function escapeHtml(str) {
  if (typeof str !== "string") {
    return String(str);
  }
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getElementById(id) {
  try {
    return typeof document !== 'undefined' ? document.getElementById(id) : null;
  } catch {
    return null;
  }
}

function normalizeTextLabel(text) {
  return String(text || '').replace(/^[^\wÀ-ž]+\s*/, '').trim();
}

function getTrackIcon(track) {
  const TRACK_ICON_MAP = {
    starter: 'starter',
    intermediate: 'bolt',
    senior: 'crown',
    mentorship: 'mentor',
    web: 'web',
    api: 'api',
    mobile: 'mobile',
    performance: 'perf',
    security: 'security',
    devops: 'devops',
    accessibility: 'accessibility',
    leadership: 'leadership',
    'lab-android-basic': 'android',
    'lab-ios-basic': 'ios',
    'lab-saucelabs': 'externalLink',
    'lab-browserstack': 'cloud',
  };
  const rawIcon = String((track && track.icon) || '').trim();
  try {
    if (window && window.NVIcons && window.NVIcons.icons && window.NVIcons.icons[rawIcon]) return rawIcon;
  } catch (e) {
    // ignore
  }
  try {
    if (/\p{Emoji}/u.test(rawIcon)) return TRACK_ICON_MAP[track.id] || 'tracks';
  } catch (e) {
    // ignore unicode property support
  }
  return TRACK_ICON_MAP[track.id] || 'tracks';
}

function getLangKey() {
  return getCurrentLangKey();
}

function highlightCode(html) {
  return String(html).replace(/<pre>([\s\S]*?)<\/pre>/g, (_, code) => {
    const safe = code.trim();
    return `<div class="code-block">\n        <button class="code-copy-btn" aria-label="Copy code" title="Copy">${getIconMarkup('copy', '18')}</button>\n        <pre>${safe}</pre>\n      </div>`;
  });
}

function attachCopyButtons(container) {
  if (!container || !container.querySelectorAll) return;
  container.querySelectorAll('.code-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pre = btn.nextElementSibling;
      navigator.clipboard
        .writeText(pre.textContent)
        .then(() => {
          btn.innerHTML = getIconMarkupOrFallback('check', '✓', '18');
          setTimeout(() => {
            btn.innerHTML = getIconMarkup('copy', '18');
          }, 1500);
        })
        .catch(() => {
          btn.innerHTML = getIconMarkupOrFallback('close', '×', '18');
          setTimeout(() => {
            btn.innerHTML = getIconMarkup('copy', '18');
          }, 1500);
        });
    });
  });
}

function getCurrentLangKey() {
  const g =
    typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : {};
  return g.lang === "en" ? "en" : "pt";
}

function getStorage(key, legacyKey) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  let value = localStorage.getItem(key);
  if (!value && legacyKey) {
    value = localStorage.getItem(legacyKey);
    if (value) {
      localStorage.setItem(key, value);
    }
  }
  return value;
}

function loadJson(key, fallback, validator) {
  try {
    if (typeof localStorage === "undefined") {
      return fallback;
    }

    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
      const data = JSON.parse(raw);
    if (validator && !validator(data)) {
      return fallback;
    }
    return data;
  } catch {
    return fallback;
  }
}

function saveJson(key, data) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.error(e);
  }
}

function getStoredProgress(storageKeys, fallback = {}, validator = validateProgressData) {
  const [primaryKey, legacyKey] = storageKeys;
  const raw = getStorage(primaryKey, legacyKey);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    return validator(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function persistProgress(storageKeys, progressState) {
  const [primaryKey] = storageKeys;
  saveJson(primaryKey, progressState);
  return progressState;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateProgressData(data) {
  if (!isPlainObject(data)) {
    return false;
  }
  for (const val of Object.values(data)) {
    if (!isPlainObject(val) || typeof val.completedAt !== "string") {
      return false;
    }
  }
  return true;
}

function validateBookmarksData(data) {
  if (!Array.isArray(data)) {
    return false;
  }
  for (const item of data) {
    if (typeof item !== "string") {
      return false;
    }
  }
  return true;
}

function validateQuizzesPassedData(data) {
  if (!isPlainObject(data)) {
    return false;
  }
  for (const val of Object.values(data)) {
    if (!isPlainObject(val) || typeof val.passedAt !== "string" || typeof val.score !== "number") {
      return false;
    }
  }
  return true;
}

function validateChecklistState(data) {
  if (!isPlainObject(data)) {
    return false;
  }
  for (const item of Object.values(data)) {
    if (!Array.isArray(item)) {
      return false;
    }
    for (const idx of item) {
      if (typeof idx !== "number") {
        return false;
      }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    escapeHtml,
    getCurrentLangKey,
    getStorage,
    loadJson,
    saveJson,
    getStoredProgress,
    persistProgress,
    validateProgressData,
    validateBookmarksData,
    validateQuizzesPassedData,
    validateChecklistState,
    t,
    getElementById,
    normalizeTextLabel,
    getTrackIcon,
    getLangKey,
    highlightCode,
    attachCopyButtons,
  };
}

function t(path, fallback) {
  // Prefer the centralized translation API when available.
  const ctxGlobal = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {}));
  if (ctxGlobal && ctxGlobal.NV_I18N && typeof ctxGlobal.NV_I18N.t === 'function') {
    return ctxGlobal.NV_I18N.t(path, fallback);
  }

  const lang = getCurrentLangKey();
  const ctx = ctxGlobal;
  // Accept translations defined at global TG_I18N or under a global `window` object.
  const translationsRoot = (ctx && ctx.TG_I18N) || (typeof globalThis !== 'undefined' && globalThis.window && globalThis.window.TG_I18N) || (ctx && ctx.window && ctx.window.TG_I18N);
  let translations = translationsRoot;
  if (!translations) {
    try {
      for (const k of Object.keys(ctx || {})) {
        const cand = ctx[k];
        if (cand && cand.TG_I18N) {
          translations = cand.TG_I18N;
          break;
        }
      }
      // Also scan globalThis top-level entries for a nested TG_I18N if present.
      for (const k of Object.keys(globalThis || {})) {
        try {
          const cand = globalThis[k];
          if (cand && cand.TG_I18N) {
            translations = cand.TG_I18N;
            break;
          }
        } catch (e) {
          // Ignore lookup failures for unrelated globals.
        }
      }
    } catch (e) {
      // Ignore failures while resolving nested translation objects.
    }
  }
  const dict2 = translations && translations[lang];
  const FALLBACK_LABELS = {
    pt: {
      inProgress: 'Em andamento',
      completed: 'Concluído',
      unlocked: 'Liberado',
      modules: 'módulos',
      hours: 'h',
      hoursLong: 'horas',
      free: 'Grátis',
      lessonsDone: 'aulas concluídas',
      lessonsProgress: 'aulas',
      overallProgress: 'progresso geral',
    },
    en: {
      inProgress: 'In progress',
      completed: 'Completed',
      unlocked: 'Unlocked',
      modules: 'modules',
      hours: 'h',
      hoursLong: 'hours',
      free: 'Free',
      lessonsDone: 'lessons completed',
      lessonsProgress: 'lessons',
      overallProgress: 'overall progress',
    },
  };

  function humanizeTranslationPath(path, currentLang) {
    const parts = String(path).split('.').filter(Boolean);
    const key = parts[parts.length - 1] || '';
    const direct = FALLBACK_LABELS[currentLang]?.[key];
    if (direct) return direct;

    const humanized = key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim();

    if (!humanized) return path;
    return humanized.charAt(0).toUpperCase() + humanized.slice(1);
  }

  if (!dict2) return fallback || humanizeTranslationPath(path, lang);
  const parts = String(path).split('.');
  let cur = dict2;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
    else return fallback || humanizeTranslationPath(path, lang);
  }
  return cur;
}
