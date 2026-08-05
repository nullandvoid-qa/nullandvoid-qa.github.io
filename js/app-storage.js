const safeShowToast = typeof showToast === "function" ? showToast : () => {};
const safeTranslate = typeof t === "function" ? t : (key) => key;
const validateProgress = typeof validateProgressData === "function" ? validateProgressData : (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  return Object.values(data).every((value) => value && typeof value === "object" && typeof value.completedAt === "string");
};
const validateBookmarks = typeof validateBookmarksData === "function" ? validateBookmarksData : (data) => Array.isArray(data) && data.every((item) => typeof item === "string");
const validateQuizzes = typeof validateQuizzesPassedData === "function" ? validateQuizzesPassedData : (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  return Object.values(data).every((value) => value && typeof value === "object" && typeof value.passedAt === "string" && typeof value.score === "number");
};
const validateChecklist = typeof window !== "undefined" && typeof window.validateChecklistState === "function"
  ? window.validateChecklistState
  : (data) => {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return false;
      }
      return Object.values(data).every((item) => Array.isArray(item) && item.every((idx) => typeof idx === "number"));
    };

function normalizeProgressState(progressState) {
  if (!progressState || typeof progressState !== "object" || Array.isArray(progressState)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(progressState).filter(([, value]) => value && typeof value === "object" && typeof value.completedAt === "string").map(([key, value]) => [key, { completedAt: value.completedAt }]),
  );
}

function normalizeBookmarksState(bookmarksState) {
  if (!Array.isArray(bookmarksState)) {
    return [];
  }

  return bookmarksState.filter((item) => typeof item === "string" && item.trim() !== "");
}

function normalizeQuizzesState(quizzesState) {
  if (!quizzesState || typeof quizzesState !== "object" || Array.isArray(quizzesState)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(quizzesState)
      .filter(([, value]) => value && typeof value === "object" && typeof value.passedAt === "string" && typeof value.score === "number")
      .map(([key, value]) => [key, { passedAt: value.passedAt, score: value.score }]),
  );
}

function getAuthProgress() {
  if (!window.NVAuth || !window.NVAuth.isAuthenticated || typeof window.NVAuth.getProgress !== 'function') {
    return null;
  }

  const userProgress = window.NVAuth.getProgress();
  return userProgress && Object.keys(userProgress).length > 0 ? userProgress : null;
}

function loadProgress() {
  try {
    const authProgress = getAuthProgress();
    if (authProgress && validateProgress(authProgress)) {
      return normalizeProgressState(authProgress);
    }

    // Prefer an available getStoredProgress helper from the environment,
    // fallback to requiring the local utils implementation when running in Node tests.
    let stored = {};
    if (typeof getStoredProgress === 'function') {
      stored = getStoredProgress(["testers-guild-progress", "tg-qaway-progress"], {});
    } else {
      try {
        const u = require('./utils.js');
        stored = u.getStoredProgress(["testers-guild-progress", "tg-qaway-progress"], {});
      } catch (e) {
        stored = {};
      }
    }
    return normalizeProgressState(stored);
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  const normalizedProgress = normalizeProgressState(progress);

  if (window.NVAuth && window.NVAuth.isAuthenticated && typeof window.NVAuth.setProgress === 'function') {
    window.NVAuth.setProgress(normalizedProgress);
  }

  // Use available persistProgress helper from environment or fallback to utils implementation
  if (typeof persistProgress === 'function') {
    persistProgress(["testers-guild-progress"], normalizedProgress);
  } else {
    try {
      const u = require('./utils.js');
      if (u && typeof u.persistProgress === 'function') u.persistProgress(["testers-guild-progress"], normalizedProgress);
    } catch (e) {
      // last resort: try to save as JSON into localStorage
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem('testers-guild-progress', JSON.stringify(normalizedProgress));
      } catch (err) {
        // ignore
      }
    }
  }
}

function safeGetStoredItem(key) {
  if (typeof window !== 'undefined' && typeof window.getStoredItem === 'function') {
    try { return window.getStoredItem(key); } catch (e) { /* ignore */ }
  }
  if (typeof getStoredItem === 'function') {
    try { return getStoredItem(key); } catch (e) { /* ignore */ }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function safeSetStoredItem(key, value) {
  if (typeof window !== 'undefined' && typeof window.setStoredItem === 'function') {
    try { window.setStoredItem(key, value); return; } catch (e) { /* ignore */ }
  }
  if (typeof setStoredItem === 'function') {
    try { setStoredItem(key, value); return; } catch (e) { /* ignore */ }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    // ignore
  }
}

function safeRemoveStoredItem(key) {
  if (typeof window !== 'undefined' && typeof window.removeStoredItem === 'function') {
    try { window.removeStoredItem(key); return; } catch (e) { /* ignore */ }
  }
  if (typeof removeStoredItem === 'function') {
    try { removeStoredItem(key); return; } catch (e) { /* ignore */ }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore
  }
}

function safeLoadJson(key, fallback, validator) {
  if (typeof window !== 'undefined' && typeof window.loadJson === 'function') {
    try { return window.loadJson(key, fallback, validator); } catch (e) { /* ignore */ }
  }
  if (typeof loadJson === 'function') {
    try { return loadJson(key, fallback, validator); } catch (e) { /* ignore */ }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const data = JSON.parse(raw);
      if (validator && !validator(data)) return fallback;
      return data;
    }
  } catch (e) {
    // ignore
  }
  return fallback;
}

function safeSaveJson(key, data) {
  if (typeof window !== 'undefined' && typeof window.saveJson === 'function') {
    try { window.saveJson(key, data); return; } catch (e) { /* ignore */ }
  }
  if (typeof saveJson === 'function') {
    try { saveJson(key, data); return; } catch (e) { /* ignore */ }
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    // ignore
  }
}

function saveLastLesson(id) {
  setStoredItem("testers-guild-last-lesson", id);
}

function exportProgressToFile(progress, bookmarks, quizzesPassed, checklistState) {
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
    safeShowToast(safeTranslate("toast.exportProgressSuccess"));
  } catch (error) {
    console.error(error);
    safeShowToast(safeTranslate("toast.exportProgressFail"));
  }
}

function isValidImportedPayload(payload) {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const hasProgress = payload.progress === undefined || validateProgress(payload.progress);
  const hasBookmarks = payload.bookmarks === undefined || validateBookmarks(payload.bookmarks);
  const hasQuizzes = payload.quizzesPassed === undefined || validateQuizzes(payload.quizzesPassed);
  const hasChecklist = payload.checklists === undefined || validateChecklist(payload.checklists);

  return hasProgress && hasBookmarks && hasQuizzes && hasChecklist;
}

async function readImportedFileText(file) {
  if (!file) {
    return "";
  }

  if (typeof file.text === "function") {
    return file.text();
  }

  if (typeof FileReader === "function") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
      reader.readAsText(file);
    });
  }

  return typeof file === "string" ? file : "";
}

async function importProgressFromFile(file) {
  try {
    const text = await readImportedFileText(file);
    const payload = JSON.parse(text);

    if (!isValidImportedPayload(payload)) {
      safeShowToast(safeTranslate("toast.invalidProgressFile"));
      return null;
    }

    return {
      progress: normalizeProgressState(payload.progress),
      bookmarks: normalizeBookmarksState(payload.bookmarks),
      quizzesPassed: normalizeQuizzesState(payload.quizzesPassed),
      checklistState: payload.checklists,
    };
  } catch (error) {
    console.error(error);
    safeShowToast(safeTranslate("toast.importProgressFail"));
    return null;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalizeProgressState,
    normalizeBookmarksState,
    normalizeQuizzesState,
    loadProgress,
    saveProgress,
    saveLastLesson,
    exportProgressToFile,
    isValidImportedPayload,
    importProgressFromFile,
    safeGetStoredItem,
    safeSetStoredItem,
    safeRemoveStoredItem,
    safeLoadJson,
    safeSaveJson,
  };
}

// Expose a safe storage API for other modules in the browser environment.
if (typeof window !== 'undefined') {
  window.NVAppStorage = window.NVAppStorage || {};
  try {
    window.NVAppStorage.normalizeProgressState = normalizeProgressState;
    window.NVAppStorage.normalizeBookmarksState = normalizeBookmarksState;
    window.NVAppStorage.normalizeQuizzesState = normalizeQuizzesState;
    window.NVAppStorage.loadProgress = loadProgress;
    window.NVAppStorage.saveProgress = saveProgress;
    window.NVAppStorage.saveLastLesson = saveLastLesson;
    window.NVAppStorage.exportProgressToFile = exportProgressToFile;
    window.NVAppStorage.importProgressFromFile = importProgressFromFile;
    window.NVAppStorage.isValidImportedPayload = isValidImportedPayload;
    window.NVAppStorage.safeGetStoredItem = safeGetStoredItem;
  window.NVAppStorage.safeSetStoredItem = safeSetStoredItem;
  window.NVAppStorage.safeRemoveStoredItem = safeRemoveStoredItem;
    window.NVAppStorage.safeSaveJson = safeSaveJson;
  } catch (e) {
    // noop - defensive write to window
  }
}
