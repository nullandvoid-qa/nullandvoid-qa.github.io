/**
 * app-achievements.js
 *
 * Achievement detection, unlocking, and rendering for the dashboard.
 * Reads shared app state from window.NVApp.state.
 */
(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getHelpers() {
    return window.NVApp?.helpers || {};
  }

  function safeLoadJson(key, fallback, validator) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeLoadJson) {
      try { return window.NVAppStorage.safeLoadJson(key, fallback, validator); } catch (e) { return fallback; }
    }
    if (typeof window !== 'undefined' && typeof window.loadJson === 'function') {
      try { return window.loadJson(key, fallback, validator); } catch (e) { return fallback; }
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

  function safeSetStoredItem(key, value) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSetStoredItem) {
      try { window.NVAppStorage.safeSetStoredItem(key, value); return; } catch (e) { /* ignore */ }
    }
    if (typeof window !== 'undefined' && typeof window.setStoredItem === 'function') {
      try { window.setStoredItem(key, value); return; } catch (e) { /* ignore */ }
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      // ignore
    }
  }

  function safeSaveJson(key, data) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSaveJson) {
      try { window.NVAppStorage.safeSaveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    if (typeof window !== 'undefined' && typeof window.saveJson === 'function') {
      try { window.saveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    if (typeof saveJson === 'function') {
      try { saveJson(key, data); return; } catch (e) { /* ignore */ }
    }
    safeSetStoredItem(key, JSON.stringify(data));
  }

  function getStoredAchievements() {
    const key = 'testers-guild-unlocked-achievements';
    return safeLoadJson(key, [], (data) => Array.isArray(data));
  }

  function saveStoredAchievements(achievements) {
    const key = 'testers-guild-unlocked-achievements';
    safeSaveJson(key, achievements);
  }

  function safeShowToast(message) {
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      window.showToast(message);
    }
  }

  function safeTranslate(key, fallback) {
    if (typeof window !== 'undefined' && typeof window.t === 'function') {
      return window.t(key, fallback);
    }
    return fallback || key;
  }

  function checkAchievements() {
    const state = getState();
    const helpers = getHelpers();
    const global = helpers.getGlobalProgress();
    const passedAll = Object.keys(state.quizzesPassed || {}).length;
    const bookmarkCount = (state.bookmarks || []).length;
    const unlockedIds = [];

    const achievementsList = window.TG_ACHIEVEMENTS || [];

    const rules = [
      { id: 'first_lesson', test: () => global.done >= 1 },
      { id: 'ten_lessons', test: () => global.done >= 10 },
      { id: 'fifty_lessons', test: () => global.done >= 50 },
      {
        id: 'track_complete',
        test: () => (state.tracks || []).some((tr) => helpers.getTrackProgress(tr).pct === 100),
      },
      { id: 'quiz_pass', test: () => passedAll >= 1 },
      { id: 'all_quizzes', test: () => passedAll >= 9 },
      {
        id: 'recruit_route',
        test: () => {
          const starterTrack = (state.tracks || []).find((tr) => tr.id === 'starter');
          return starterTrack ? helpers.getTrackProgress(starterTrack).pct === 100 : false;
        },
      },
      {
        id: 'master_route',
        test: () => {
          const leadTrack = (state.tracks || []).find((tr) => tr.id === 'leadership');
          return leadTrack ? helpers.getTrackProgress(leadTrack).pct === 100 : false;
        },
      },
      { id: 'bookworm', test: () => bookmarkCount >= 5 },
      {
        id: 'checklist_done',
        test: () => {
          return Object.values(state.checklistState || {}).some(
            (arr) => Array.isArray(arr) && arr.length > 0,
          );
        },
      },
    ];

    const prev = getStoredAchievements();
    const unlockedList = [...prev];

    rules.forEach((rule) => {
      if (rule.test() && !unlockedList.includes(rule.id)) {
        unlockedIds.push(rule.id);
        unlockedList.push(rule.id);
      }
    });

    if (unlockedIds.length) {
      saveStoredAchievements(unlockedList);
      unlockedIds.forEach((id) => {
        const ach = achievementsList.find((a) => a.id === id);
        if (ach) {
          safeShowToast(
            `${ach.icon} ${safeTranslate('toast.achievementUnlocked', 'Achievement unlocked!')}: ${ach[state.lang]?.title || ach.pt?.title || ''}`,
          );
        }
      });
    }
    return unlockedList;
  }

  function renderAchievements() {
    const state = getState();
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    const achievementsList = window.TG_ACHIEVEMENTS || [];
    const unlocked = getStoredAchievements();
    grid.innerHTML = window.NVViewHelpers.buildAchievementsHtml(
      achievementsList,
      unlocked,
      state.lang,
      window.escapeHtml,
      window.NVIcons,
      window.t,
    );
  }

  window.NVAppAchievements = { checkAchievements, renderAchievements };
  window.checkAchievements = checkAchievements;
  window.renderAchievements = renderAchievements;
})();
