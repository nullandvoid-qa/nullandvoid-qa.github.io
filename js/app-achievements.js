w/**
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

    let prev = [];
    try {
      prev = JSON.parse(localStorage.getItem('testers-guild-unlocked-achievements') || '[]');
    } catch (e) {
      prev = [];
    }

    rules.forEach((rule) => {
      if (rule.test() && !prev.includes(rule.id)) {
        unlockedIds.push(rule.id);
        prev.push(rule.id);
      }
    });

    if (unlockedIds.length) {
      try { localStorage.setItem('testers-guild-unlocked-achievements', JSON.stringify(prev)); } catch (e) { /* ignore */ }
      unlockedIds.forEach((id) => {
        const ach = achievementsList.find((a) => a.id === id);
        if (ach && window.showToast) {
          window.showToast(
            `${ach.icon} ${window.t('toast.achievementUnlocked')}: ${ach[state.lang]?.title || ach.pt?.title || ''}`,
          );
        }
      });
    }
    return prev;
  }

  function renderAchievements() {
    const state = getState();
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    const achievementsList = window.TG_ACHIEVEMENTS || [];
    let unlocked = [];
    try {
      unlocked = JSON.parse(localStorage.getItem('testers-guild-unlocked-achievements') || '[]');
    } catch (e) {
      unlocked = [];
    }
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
