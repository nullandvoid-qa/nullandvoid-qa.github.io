const safeShowToast = typeof showToast === "function" ? showToast : () => {};
const safeTranslate = typeof t === "function" ? t : (key) => key;
const globalScope = typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : {});
const getStoredProgressHelper = typeof globalScope.getStoredProgress === "function" ? globalScope.getStoredProgress : null;
const persistProgressHelper = typeof globalScope.persistProgress === "function" ? globalScope.persistProgress : null;
const getStoredItemHelper = typeof globalScope.getStoredItem === "function" ? globalScope.getStoredItem : null;
const setStoredItemHelper = typeof globalScope.setStoredItem === "function" ? globalScope.setStoredItem : null;
const removeStoredItemHelper = typeof globalScope.removeStoredItem === "function" ? globalScope.removeStoredItem : null;
const loadJsonHelper = typeof globalScope.loadJson === "function" ? globalScope.loadJson : null;
const saveJsonHelper = typeof globalScope.saveJson === "function" ? globalScope.saveJson : null;

const safeRun = (callback) => {
  try {
    return callback();
  } catch (error) {
    return undefined;
  }
};

const safeGlobalFn = (fn, ...args) => safeRun(() => (typeof fn === 'function' ? fn(...args) : undefined));

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
  const auth = typeof window !== "undefined" ? window.NVAuth : null;
  if (!auth || !auth.isAuthenticated || typeof auth.getProgress !== "function") {
    return null;
  }

  const userProgress = auth.getProgress();
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
    if (typeof getStoredProgressHelper === "function") {
      stored = getStoredProgressHelper(["testers-guild-progress", "tg-qaway-progress"], {});
    } else {
      try {
        const utilsModule = require('./utils.js');
        stored = utilsModule.getStoredProgress(["testers-guild-progress", "tg-qaway-progress"], {});
      } catch (error) {
        stored = {};
      }
    }
    return normalizeProgressState(stored);
  } catch (error) {
    return {};
  }
}

function saveProgress(progress) {
  const normalizedProgress = normalizeProgressState(progress);
  const auth = typeof window !== "undefined" ? window.NVAuth : null;

  if (auth && auth.isAuthenticated && typeof auth.setProgress === "function") {
    auth.setProgress(normalizedProgress);
  }

  // Use available persistProgress helper from environment or fallback to utils implementation
  if (typeof persistProgressHelper === "function") {
    persistProgressHelper(["testers-guild-progress"], normalizedProgress);
  } else {
    try {
      const utilsModule = require('./utils.js');
      if (utilsModule && typeof utilsModule.persistProgress === "function") {
        utilsModule.persistProgress(["testers-guild-progress"], normalizedProgress);
      }
    } catch (error) {
      // last resort: try to save as JSON into localStorage
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("testers-guild-progress", JSON.stringify(normalizedProgress));
        }
      } catch (storageError) {
        // ignore
      }
    }
  }
}

function safeGetStoredItem(key) {
  if (typeof window !== "undefined" && typeof window.getStoredItem === "function") {
    return safeGlobalFn(window.getStoredItem, key);
  }
  if (typeof getStoredItemHelper === "function") {
    return safeGlobalFn(getStoredItemHelper, key);
  }
  return safeRun(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }) || null;
}

function safeSetStoredItem(key, value) {
  if (typeof window !== "undefined" && typeof window.setStoredItem === "function") {
    return safeGlobalFn(window.setStoredItem, key, value);
  }
  if (typeof setStoredItemHelper === "function") {
    return safeGlobalFn(setStoredItemHelper, key, value);
  }
  return safeRun(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
    return undefined;
  });
}

function safeRemoveStoredItem(key) {
  if (typeof window !== "undefined" && typeof window.removeStoredItem === "function") {
    return safeGlobalFn(window.removeStoredItem, key);
  }
  if (typeof removeStoredItemHelper === "function") {
    return safeGlobalFn(removeStoredItemHelper, key);
  }
  return safeRun(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
    return undefined;
  });
}

function safeLoadJson(key, fallback, validator) {
  if (typeof window !== "undefined" && typeof window.loadJson === "function") {
    return safeGlobalFn(window.loadJson, key, fallback, validator);
  }
  if (typeof loadJsonHelper === "function") {
    return safeGlobalFn(loadJsonHelper, key, fallback, validator);
  }
  return safeRun(() => {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      const data = JSON.parse(raw);
      if (validator && !validator(data)) {
        return fallback;
      }
      return data;
    }
    return fallback;
  }) || fallback;
}

function safeSaveJson(key, data) {
  if (typeof saveJsonHelper === "function") {
    return safeGlobalFn(saveJsonHelper, key, data);
  }
  if (typeof window !== "undefined" && typeof window.saveJson === "function") {
    return safeGlobalFn(window.saveJson, key, data);
  }
  return safeRun(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
    return undefined;
  });
}

function saveLastLesson(id) {
  safeSetStoredItem("testers-guild-last-lesson", id);
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
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nullandvoid-qa-progress.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
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
if (typeof window !== "undefined") {
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
  } catch (error) {
    // noop - defensive write to window
  }
}
