(function () {
  // Lightweight init module: attach UI event listeners using shared helpers
  const helpers = (window.NVApp && window.NVApp.helpers) ? window.NVApp.helpers : {};
  const setPersona = helpers.setPersona || ((p) => { if (window.NVApp && window.NVApp.state) window.NVApp.state.persona = p; });
  const toggleLang = helpers.toggleLang || (() => {});
  const toggleTheme = helpers.toggleTheme || (() => {});
  const toggleSeniorMode = helpers.toggleSeniorMode || (() => {});
  const handleSearch = helpers.handleSearch || (() => {});

  // local debounce state for search
  let searchTimeout = null;

  try {
    document.querySelectorAll('.persona-card').forEach((el) => {
      el.addEventListener('click', () => setPersona(el.dataset.persona));
    });
  } catch (e) {
    // ignore when DOM not available
  }

  try {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.addEventListener('click', toggleLang);
  } catch (e) {}

  try {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  } catch (e) {}

  try {
    const seniorModeToggle = document.getElementById('senior-mode-toggle');
    if (seniorModeToggle) seniorModeToggle.addEventListener('click', toggleSeniorMode);
  } catch (e) {}

  try {
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(document.getElementById('global-search')?.value || ''), 200);
      });
    }
  } catch (e) {}

  try {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-wrap')) {
        const resultsEl = document.getElementById('search-results');
        if (resultsEl) resultsEl.classList.add('hidden');
      }
    });
  } catch (e) {}

  // Additional init responsibilities: reset/export/import, keyboard nav, auth sync
  try {
    const STORAGE_LAST_LESSON = helpers.STORAGE_LAST_LESSON || 'testers-guild-last-lesson';

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const t = helpers.t || ((k, f) => f || k);
        const confirmFn = window.confirm || (() => false);
        if (confirmFn(t('dashboard.resetConfirm', 'Are you sure?'))) {
          const state = window.NVApp?.state || {};
          try { state.progress = {}; } catch (e) {}
          try { if (typeof helpers.saveProgress === 'function') helpers.saveProgress(state.progress); } catch (e) {}
          try { if (window.NVAppStorage?.safeRemoveStoredItem) window.NVAppStorage.safeRemoveStoredItem(STORAGE_LAST_LESSON); else localStorage.removeItem(STORAGE_LAST_LESSON); } catch (e) {}
          try { if (typeof window.showToast === 'function') window.showToast(t('toast.progressReset', 'Progress reset')); } catch (e) {}
          try { if (typeof helpers.refreshCurrentView === 'function') helpers.refreshCurrentView(); } catch (e) {}
          try { if (typeof helpers.renderContinueBanner === 'function') helpers.renderContinueBanner(); } catch (e) {}
        }
      });
    }

    const btnExport = document.getElementById('btn-export-progress');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const state = window.NVApp?.state || {};
        if (window.NVAppStorage?.exportProgressToFile) {
          try { window.NVAppStorage.exportProgressToFile(state.progress || {}, state.bookmarks || [], state.quizzesPassed || {}, state.checklistState || {}); return; } catch (e) {}
        }
        // fallback: build blob
        try {
          const payload = { version: 1, exportedAt: new Date().toISOString(), progress: state.progress || {}, bookmarks: state.bookmarks || [], quizzesPassed: state.quizzesPassed || {}, checklists: state.checklistState || {} };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'nullandvoid-qa-progress.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
          if (typeof window.showToast === 'function') window.showToast((helpers.t || ((k,f)=>f||k))('toast.exportProgressSuccess', 'Export completed'));
        } catch (e) {}
      });
    }

    const importInput = document.getElementById('progress-import-input');
    if (importInput) {
      importInput.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          if (window.NVAppStorage?.importProgressFromFile) {
            const imported = await window.NVAppStorage.importProgressFromFile(file);
            event.target.value = '';
            if (!imported) return;
            const state = window.NVApp?.state || {};
            try { state.progress = imported.progress || {}; } catch (e) {}
            try { state.bookmarks = imported.bookmarks || []; } catch (e) {}
            try { state.quizzesPassed = imported.quizzesPassed || {}; } catch (e) {}
            try { state.checklistState = imported.checklistState || {}; } catch (e) {}
            try { if (typeof helpers.saveProgress === 'function') helpers.saveProgress(state.progress); } catch (e) {}
            try { if (window.NVAppStorage?.safeSaveJson) window.NVAppStorage.safeSaveJson('testers-guild-bookmarks', state.bookmarks || []); } catch (e) {}
            try { if (window.NVAppStorage?.safeSaveJson) window.NVAppStorage.safeSaveJson('testers-guild-quizzes', state.quizzesPassed || {}); } catch (e) {}
            try { if (window.NVAppStorage?.safeSaveJson) window.NVAppStorage.safeSaveJson('testers-guild-checklists', state.checklistState || {}); } catch (e) {}
            try { if (typeof window.showToast === 'function') window.showToast((helpers.t || ((k,f)=>f||k))('toast.importProgressSuccess', 'Import completed')); } catch (e) {}
            try { if (typeof helpers.refreshCurrentView === 'function') helpers.refreshCurrentView(); } catch (e) {}
            try { if (typeof helpers.renderContinueBanner === 'function') helpers.renderContinueBanner(); } catch (e) {}
          }
        } catch (e) {}
      });
    }

    // Keyboard navigation for lessons
    document.addEventListener('keydown', (e) => {
      const state = window.NVApp?.state || {};
      if (state.currentView !== 'lesson') return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const found = typeof helpers.findLesson === 'function' ? helpers.findLesson(state.viewParams?.lessonId) : null;
      if (!found) return;
      const allLessons = Array.isArray(found.rawTrack?.courses) ? found.rawTrack.courses.flatMap((c) => c.lessons || []) : [];
      const idx = allLessons.findIndex((l) => l.id === state.viewParams?.lessonId);
      if (e.key === 'ArrowRight' && allLessons[idx + 1]) helpers.navigate?.('lesson', { lessonId: allLessons[idx + 1].id });
      if (e.key === 'ArrowLeft' && allLessons[idx - 1]) helpers.navigate?.('lesson', { lessonId: allLessons[idx - 1].id });
    });

    // Auth sync handlers
    document.addEventListener('nvauth:login', (e) => {
      try {
        const userProgress = window.NVAuth?.getProgress?.() || {};
        if (Object.keys(userProgress).length > 0) {
          const state = window.NVApp?.state || {};
          try { state.progress = userProgress; } catch (err) {}
          try { if (typeof window.showToast === 'function') window.showToast(`Progresso restaurado para ${e?.detail?.name || ''}`); } catch (err) {}
        } else {
          try { window.NVAuth?.setProgress?.(window.NVApp?.state?.progress || {}); } catch (err) {}
        }
        try { if (typeof helpers.refreshCurrentView === 'function') helpers.refreshCurrentView(); } catch (err) {}
      } catch (err) {}
    });

    document.addEventListener('nvauth:logout', () => {
      try { if (typeof helpers.saveProgress === 'function') helpers.saveProgress(window.NVApp?.state?.progress || {}); } catch (err) {}
      try { if (typeof window.showToast === 'function') window.showToast((helpers.t || ((k,f)=>f||k))('toast.progressSavedLocal', 'Progress saved locally')); } catch (err) {}
    });
  } catch (e) {
    // ignore overall init failures
  }
})();
