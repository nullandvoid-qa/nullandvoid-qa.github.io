(function () {
  "use strict";

  // Lightweight init module: attach UI event listeners using shared helpers
  const helpers = window.NVApp && window.NVApp.helpers ? window.NVApp.helpers : {};
  const setPersona = helpers.setPersona || ((persona) => {
    if (window.NVApp && window.NVApp.state) {
      window.NVApp.state.persona = persona;
    }
  });
  const toggleLang = helpers.toggleLang || (() => {});
  const toggleTheme = helpers.toggleTheme || (() => {});
  const toggleSeniorMode = helpers.toggleSeniorMode || (() => {});
  const handleSearch = helpers.handleSearch || (() => {});
  const translate = helpers.t || ((key, fallback) => fallback || key);
  const showToast = typeof window.showToast === 'function' ? window.showToast : () => {};

  const safeRun = (callback) => {
    try {
      return callback();
    } catch (error) {
      return undefined;
    }
  };

  const safeRemoveStoredItem = (key) => safeRun(() => {
    if (window.NVAppStorage?.safeRemoveStoredItem) {
      return window.NVAppStorage.safeRemoveStoredItem(key);
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.removeItem(key);
    }
    return undefined;
  });

  const safeSaveJson = (key, data) => safeRun(() => {
    if (window.NVAppStorage?.safeSaveJson) {
      return window.NVAppStorage.safeSaveJson(key, data);
    }
    if (typeof window !== 'undefined' && typeof window.saveJson === 'function') {
      return window.saveJson(key, data);
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.setItem(key, JSON.stringify(data));
    }
    return undefined;
  });

  const safeSaveProgress = (...args) => safeRun(() => typeof helpers.saveProgress === 'function' && helpers.saveProgress(...args));
  const safeRefreshCurrentView = () => safeRun(() => typeof helpers.refreshCurrentView === 'function' && helpers.refreshCurrentView());
  const safeRenderContinueBanner = () => safeRun(() => typeof helpers.renderContinueBanner === 'function' && helpers.renderContinueBanner());
  const safeShowToast = (key, fallback) => safeRun(() => showToast(translate(key, fallback)));
  const safeInvoke = (fn, ...args) => safeRun(() => typeof fn === 'function' ? fn(...args) : undefined);
  const safeAssignState = (state, key, value) => safeRun(() => {
    try {
      state[key] = value;
    } catch (error) {
      // ignore when state is not writable
    }
  });

  // local debounce state for search
  let searchTimeout = null;

  try {
    document.querySelectorAll('.persona-card').forEach((element) => {
      element.addEventListener('click', () => setPersona(element.dataset.persona));
    });
  } catch (error) {
    // ignore when DOM is not available
  }

  try {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', toggleLang);
    }
  } catch (error) {
    // ignore when DOM is not available
  }

  try {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  } catch (error) {
    // ignore when DOM is not available
  }

  try {
    const seniorModeToggle = document.getElementById('senior-mode-toggle');
    if (seniorModeToggle) {
      seniorModeToggle.addEventListener('click', toggleSeniorMode);
    }
  } catch (error) {
    // ignore when DOM is not available
  }

  try {
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(document.getElementById('global-search')?.value || ''), 200);
      });
    }
  } catch (error) {
    // ignore when DOM is not available
  }

  try {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('.search-bar-wrap')) {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) {
          resultsEl.classList.add('hidden');
        }
      }
    });
  } catch (error) {
    // ignore when DOM is not available
  }

  // Additional init responsibilities: reset/export/import, keyboard nav, auth sync
  try {
    const STORAGE_LAST_LESSON = helpers.STORAGE_LAST_LESSON || 'testers-guild-last-lesson';

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const confirmFn = window.confirm || (() => false);
        if (confirmFn(translate('dashboard.resetConfirm', 'Are you sure?'))) {
          const state = window.NVApp?.state || {};
          safeAssignState(state, 'progress', {});
          safeSaveProgress(state.progress);
          safeRemoveStoredItem(STORAGE_LAST_LESSON);
          safeShowToast('toast.progressReset', 'Progress reset');
          safeRefreshCurrentView();
          safeRenderContinueBanner();
        }
      });
    }

    const btnExport = document.getElementById('btn-export-progress');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const state = window.NVApp?.state || {};
        if (window.NVAppStorage?.exportProgressToFile) {
          try {
            window.NVAppStorage.exportProgressToFile(state.progress || {}, state.bookmarks || [], state.quizzesPassed || {}, state.checklistState || {});
            return;
          } catch (error) {
            // fall back to browser download below
          }
        }
        // fallback: build blob
        try {
          const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            progress: state.progress || {},
            bookmarks: state.bookmarks || [],
            quizzesPassed: state.quizzesPassed || {},
            checklists: state.checklistState || {},
          };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'nullandvoid-qa-progress.json';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(url);
          safeShowToast('toast.exportProgressSuccess', 'Export completed');
        } catch (error) {
          // ignore export failures
        }
      });
    }

    const importInput = document.getElementById('progress-import-input');
    if (importInput) {
      importInput.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        try {
          if (window.NVAppStorage?.importProgressFromFile) {
            const imported = await window.NVAppStorage.importProgressFromFile(file);
            event.target.value = '';
            if (!imported) {
              return;
            }
            const state = window.NVApp?.state || {};
            safeAssignState(state, 'progress', imported.progress || {});
            safeAssignState(state, 'bookmarks', imported.bookmarks || []);
            safeAssignState(state, 'quizzesPassed', imported.quizzesPassed || {});
            safeAssignState(state, 'checklistState', imported.checklistState || {});
            safeSaveProgress(state.progress);
            safeSaveJson('testers-guild-bookmarks', state.bookmarks || []);
            safeSaveJson('testers-guild-quizzes', state.quizzesPassed || {});
            safeSaveJson('testers-guild-checklists', state.checklistState || {});
            safeShowToast('toast.importProgressSuccess', 'Import completed');
            safeRefreshCurrentView();
            safeRenderContinueBanner();
          }
        } catch (error) {
          // ignore import failures
        }
      });
    }

    // Keyboard navigation for lessons
    document.addEventListener('keydown', (event) => {
      const state = window.NVApp?.state || {};
      if (state.currentView !== 'lesson') {
        return;
      }
      if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) {
        return;
      }
      const found = typeof helpers.findLesson === 'function' ? helpers.findLesson(state.viewParams?.lessonId) : null;
      if (!found) {
        return;
      }
      const allLessons = Array.isArray(found.rawTrack?.courses) ? found.rawTrack.courses.flatMap((course) => course.lessons || []) : [];
      const index = allLessons.findIndex((lesson) => lesson.id === state.viewParams?.lessonId);
      if (event.key === 'ArrowRight' && allLessons[index + 1]) {
        helpers.navigate?.('lesson', { lessonId: allLessons[index + 1].id });
      }
      if (event.key === 'ArrowLeft' && allLessons[index - 1]) {
        helpers.navigate?.('lesson', { lessonId: allLessons[index - 1].id });
      }
    });

    // Auth sync handlers
    document.addEventListener('nvauth:login', (event) => {
      try {
        const userProgress = window.NVAuth?.getProgress?.() || {};
        if (Object.keys(userProgress).length > 0) {
          const state = window.NVApp?.state || {};
          safeAssignState(state, 'progress', userProgress);
          safeInvoke(showToast, `Progresso restaurado para ${event?.detail?.name || ''}`);
        } else {
          safeInvoke(window.NVAuth?.setProgress, window.NVApp?.state?.progress || {});
        }
        safeRefreshCurrentView();
      } catch (error) {
        // ignore auth login failures
      }
    });

    document.addEventListener('nvauth:logout', () => {
      safeSaveProgress(window.NVApp?.state?.progress || {});
      safeShowToast('toast.progressSavedLocal', 'Progress saved locally');
    });
  } catch (error) {
    // ignore overall init failures
  }
})();
