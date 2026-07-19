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

function saveProgress() {
  if (window.NVAuth && window.NVAuth.isAuthenticated) {
    window.NVAuth.setProgress(progress);
  }

  persistProgress(["testers-guild-progress"], progress);
}

function saveLastLesson(id) {
  localStorage.setItem("testers-guild-last-lesson", id);
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
    saveJson("testers-guild-bookmarks", bookmarks);
    saveJson("testers-guild-quizzes", quizzesPassed);
    saveJson("testers-guild-checklists", checklistState);
    showToast(t("toast.importProgressSuccess"));
    refreshCurrentView();
    renderContinueBanner();
  } catch (error) {
    console.error(error);
    showToast(t("toast.importProgressFail"));
  }
}
