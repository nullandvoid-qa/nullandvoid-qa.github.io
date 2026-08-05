describe('app-achievements storage and rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="achievements-grid"></div>';
    window.NVApp = {
      state: {
        lang: 'pt',
        quizzesPassed: { track1: { passedAt: '2026-01-01T00:00:00Z', score: 1 } },
        bookmarks: ['l1', 'l2', 'l3', 'l4', 'l5'],
        checklistState: { track1: [1, 2] },
        tracks: [{ id: 'starter' }, { id: 'web' }],
      },
      helpers: {
        getGlobalProgress: jest.fn(() => ({ done: 1, total: 10, pct: 10 })),
        getTrackProgress: jest.fn(() => ({ pct: 100 })),
      },
    };
    window.TG_ACHIEVEMENTS = [
      { id: 'first_lesson', icon: '🔥', pt: { title: 'Primeira lição' } },
      { id: 'bookworm', icon: '📚', pt: { title: 'Bookworm' } },
    ];
    window.NVViewHelpers = { buildAchievementsHtml: jest.fn((achievements, unlocked) => `html:${unlocked.join(',')}`) };
    window.showToast = jest.fn();
    window.t = (key, fallback) => fallback;
    window.setStoredItem = jest.fn((key, value) => localStorage.setItem(key, value));
    window.getStoredItem = jest.fn((key) => localStorage.getItem(key));

    localStorage.clear();
    jest.resetModules();
    require('../app-achievements.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.TG_ACHIEVEMENTS;
    delete window.NVViewHelpers;
    delete window.showToast;
    delete window.t;
    delete window.setStoredItem;
    delete window.getStoredItem;
    delete window.NVAppStorage;
    delete window.NVAppAchievements;
    delete window.checkAchievements;
    delete window.renderAchievements;
  });

  test('checkAchievements saves unlocked achievement IDs using helper storage', () => {
    const unlocked = window.checkAchievements();

    expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-unlocked-achievements', JSON.stringify(unlocked));
    expect(unlocked).toContain('first_lesson');
    expect(unlocked).toContain('bookworm');
    expect(window.showToast).toHaveBeenCalled();
  });

  test('checkAchievements falls back to NVAppStorage when helper storage is available', () => {
    window.NVAppStorage = {
      safeLoadJson: jest.fn((key, fallback) => fallback),
      safeSaveJson: jest.fn(),
    };

    const unlocked = window.checkAchievements();

    expect(window.NVAppStorage.safeSaveJson).toHaveBeenCalledWith('testers-guild-unlocked-achievements', unlocked);
    expect(window.setStoredItem).not.toHaveBeenCalled();
    expect(unlocked).toContain('first_lesson');
    expect(unlocked).toContain('bookworm');
  });

  test('renderAchievements reads unlocked achievements from storage and renders fallback HTML', () => {
    localStorage.setItem('testers-guild-unlocked-achievements', JSON.stringify(['first_lesson']));

    window.NVAppAchievements.renderAchievements();

    expect(window.NVViewHelpers.buildAchievementsHtml).toHaveBeenCalledWith(
      window.TG_ACHIEVEMENTS,
      ['first_lesson'],
      'pt',
      window.escapeHtml,
      window.NVIcons,
      window.t,
    );
    expect(document.getElementById('achievements-grid').innerHTML).toBe('html:first_lesson');
  });
});
