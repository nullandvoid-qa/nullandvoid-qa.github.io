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
  if (!window.NVAuth || !window.NVAuth.isAuthenticated) {
    return null;
  }

  const userProgress = window.NVAuth.getProgress();
  return Object.keys(userProgress || {}).length > 0 ? userProgress : null;
}

function loadProgress() {
  try {
    const authProgress = getAuthProgress();
    if (authProgress && validateProgress(authProgress)) {
      return normalizeProgressState(authProgress);
    }

    return normalizeProgressState(getStoredProgress(["testers-guild-progress", "tg-qaway-progress"], {}));
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  const normalizedProgress = normalizeProgressState(progress);

  if (window.NVAuth && window.NVAuth.isAuthenticated) {
    window.NVAuth.setProgress(normalizedProgress);
  }

  persistProgress(["testers-guild-progress"], normalizedProgress);
}

function saveLastLesson(id) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("testers-guild-last-lesson", id);
  }
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
  };
}
