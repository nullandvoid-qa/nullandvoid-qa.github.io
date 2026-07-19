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
    localStorage.setItem(key, JSON.stringify(data));
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

function validateProgressData(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (typeof val !== "object" || val === null || Array.isArray(val)) {
      return false;
    }
    if (typeof val.completedAt !== "string") {
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
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (typeof val !== "object" || val === null || Array.isArray(val)) {
      return false;
    }
    if (typeof val.passedAt !== "string" || typeof val.score !== "number") {
      return false;
    }
  }
  return true;
}

function validateChecklistState(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }
  for (const key of Object.keys(data)) {
    const item = data[key];
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
  };
}
