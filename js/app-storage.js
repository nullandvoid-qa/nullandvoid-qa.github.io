function loadProgress() {
  try {
    if (window.NVAuth && window.NVAuth.isAuthenticated) {
      const userProgress = window.NVAuth.getProgress();
      if (Object.keys(userProgress).length > 0) {
        return validateProgressData(userProgress) ? userProgress : {};
      }
    }

    return getStoredProgress(["testers-guild-progress", "tg-qaway-progress"], {});
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  if (window.NVAuth && window.NVAuth.isAuthenticated) {
    window.NVAuth.setProgress(progress);
  }

  persistProgress(["testers-guild-progress"], progress);
}

function saveLastLesson(id) {
  localStorage.setItem("testers-guild-last-lesson", id);
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
      return null;
    }

    if (!confirm(t("dashboard.importConfirm"))) return null;

    return {
      progress: payload.progress,
      bookmarks: payload.bookmarks,
      quizzesPassed: payload.quizzesPassed,
      checklistState: payload.checklists,
    };
  } catch (error) {
    console.error(error);
    showToast(t("toast.importProgressFail"));
    return null;
  }
}
