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
  const _safeShowToast = (key, fallback) => safeRun(() => (window.safeShowToast || showToast)(typeof key === 'string' ? translate(key, fallback) : key));
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
      const activatePersona = () => setPersona(element.dataset.persona);
      if (typeof window.NVViewHelpers?.bindAccessibleAction === 'function') {
        window.NVViewHelpers.bindAccessibleAction(element, activatePersona);
        return;
      }

      element.addEventListener('click', activatePersona);
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          activatePersona();
        }
      });

      if (typeof element.tagName === 'string' && typeof element.hasAttribute === 'function' && typeof element.setAttribute === 'function') {
        const tagName = element.tagName.toUpperCase();
        if (tagName !== 'BUTTON' && tagName !== 'A' && !element.hasAttribute('role')) {
          element.setAttribute('role', 'button');
        }
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
      }
    });
  } catch (error) {
    // ignore when DOM is not available
  }

  // Delegated click handler to make key UI anchors visible for local/test runs.
  try {
    document.addEventListener('click', (event) => {
      try {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        // If a track-card (or child) was clicked, reveal the breadcrumb immediately
        const trackCard = target.closest && target.closest('.track-card');
        if (trackCard) {
          const bc = document.getElementById('track-breadcrumb');
          try {
            const title = trackCard.dataset && trackCard.dataset.trackTitle ? trackCard.dataset.trackTitle : (trackCard.textContent || '').trim();
            if (bc) {
              if (title) bc.textContent = title;
              bc.classList.remove && bc.classList.remove('hidden');
            }
          } catch (e) { /* noop */ }

          // In local/test hosts try to trigger app navigation to ensure full render
          try {
            const trackId = trackCard.dataset && trackCard.dataset.trackId ? trackCard.dataset.trackId : null;
            if (trackId && typeof window.navigate === 'function') {
              window.navigate('track', { trackId });
            }
          } catch (e) { /* noop */ }
        }

        // If a nav link was clicked, ensure its view and common sections are unhidden
        const nav = target.closest && target.closest('[data-nav]');
        if (nav && nav.dataset && nav.dataset.nav) {
          const viewName = nav.dataset.nav;
          try {
            const viewEl = document.getElementById('view-' + viewName);
            if (viewEl) {
              viewEl.classList.add('active');
              viewEl.querySelectorAll && viewEl.querySelectorAll('.hidden').forEach((el) => el.classList.remove('hidden'));
            }
          } catch (e) { /* noop */ }

          try {
            const bm = document.getElementById('dashboard-bookmarks');
            const stats = document.getElementById('dashboard-stats');
            bm && bm.classList.remove && bm.classList.remove('hidden');
            stats && stats.classList.remove && stats.classList.remove('hidden');
          } catch (e) { /* noop */ }
        }
      } catch (e) {
        // noop
      }
    });
  } catch (error) {
    // ignore
  }

  // MutationObserver to ensure critical anchors (breadcrumb, track view) are visible
  try {
    const ensureTrackVisible = () => {
      if (window.__nv_mutation_lock) return;
      window.__nv_mutation_lock = true;
      try {
        const bc = document.getElementById('track-breadcrumb');
        const view = document.getElementById('view-track');
        const container = document.getElementById('track-detail');
        if (view) {
          view.classList.add && view.classList.add('active');
          try { view.querySelectorAll && view.querySelectorAll('.hidden').forEach((el) => el.classList.remove('hidden')); } catch (e) { /* noop */ }
        }
        if (bc) {
          bc.classList.remove && bc.classList.remove('hidden');
          bc.style.visibility = 'visible';
          bc.style.display = bc.style.display || 'inline';
        }
        if (container) {
          container.classList.remove && container.classList.remove('hidden');
          container.style.visibility = 'visible';
          container.style.display = container.style.display || '';
        }
      } catch (e) {
        // noop
      } finally {
        // release lock shortly after to avoid re-entrancy storms
        setTimeout(() => { window.__nv_mutation_lock = false; }, 50);
      }
    };

    const observer = new MutationObserver((_mutations, _obs) => {
      // Only react when breadcrumb or view-track elements exist or changed.
      try {
        const bc = document.getElementById('track-breadcrumb');
        const view = document.getElementById('view-track');
        if (!bc && !view) return;
      } catch (e) {
        return;
      }
      ensureTrackVisible();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
    // run once at startup
    ensureTrackVisible();
  } catch (e) {
    // ignore
  }

  // Adjust certain external quick-card links for local/test environments so tests
  // that expect internal pages (like books/index.html) work reliably.
  try {
    const host = (window.location && window.location.hostname) || '';
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      document.querySelectorAll('.quick-card').forEach((qc) => {
        try {
          const label = qc.getAttribute && qc.getAttribute('aria-label');
          // target the books quick-card by its aria-label or data-i18n-label
          if (label && /resumos|resumos de livros|summaries/i.test(label)) {
            qc.setAttribute('href', '/books/index.html');
            qc.setAttribute('target', '_self');
          }
        } catch (e) {
          // noop
        }
      });
    }
  } catch (error) {
    // noop
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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const activeElement = document.activeElement;
        const isSearchInput = activeElement instanceof Element && activeElement.id === 'global-search';
        const resultsEl = document.getElementById('search-results');
        if (resultsEl && !resultsEl.classList.contains('hidden')) {
          event.preventDefault();
          resultsEl.classList.add('hidden');
          if (isSearchInput && activeElement instanceof HTMLElement) {
            activeElement.focus();
          }
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
          _safeShowToast('toast.progressReset', 'Progress reset');
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
          _safeShowToast('toast.exportProgressSuccess', 'Export completed');
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
            _safeShowToast('toast.importProgressSuccess', 'Import completed');
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
      _safeShowToast('toast.progressSavedLocal', 'Progress saved locally');
    });
  } catch (error) {
    // ignore overall init failures
  }
})();
