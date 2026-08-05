describe('navigation -> storage integration', () => {
  beforeEach(() => {
    jest.resetModules();
    // reset globals and mocks
    delete window.NVApp;
    window.NVApp = { state: {} };
    // jsdom doesn't implement scrollTo
    window.scrollTo = jest.fn();

    // storage helpers mocked on window so modules using window.* find them
    window.persistProgress = jest.fn();
    window.getStoredProgress = jest.fn(() => ({}));
    window.setStoredItem = jest.fn((k, v) => localStorage.setItem(k, v));
    window.getStoredItem = jest.fn((k) => localStorage.getItem(k));

    // load modules after mocks are in place
    require('../app-storage.js');
    require('../app-navigation.js');

    // renderLesson will call app-storage helpers
    window.renderLesson = (lessonId) => {
      const { saveLastLesson, saveProgress } = require('../app-storage.js');
      saveLastLesson(lessonId);
      saveProgress({ [lessonId]: { completedAt: new Date().toISOString() } });
    };
  });

  test('navigate to lesson triggers saveLastLesson and saveProgress', async () => {
    await window.navigate('lesson', { lessonId: 'lX' });

    expect(window.NVApp.state.currentView).toBe('lesson');
    expect(window.NVApp.state.viewParams.lessonId).toBe('lX');
    expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-last-lesson', 'lX');
    expect(window.persistProgress).toHaveBeenCalled();
  });

  test('when NVAuth is present and authenticated, navigate triggers NVAuth.setProgress', async () => {
    // re-require modules with NVAuth available so modules pick it up if needed
    jest.resetModules();

    window.scrollTo = jest.fn();
    window.NVApp = { state: {} };
    window.persistProgress = jest.fn();
    window.getStoredProgress = jest.fn(() => ({}));
    window.setStoredItem = jest.fn((k, v) => localStorage.setItem(k, v));
    window.getStoredItem = jest.fn((k) => localStorage.getItem(k));

    window.NVAuth = {
      isAuthenticated: () => true,
      setProgress: jest.fn(),
    };

    require('../app-storage.js');
    require('../app-navigation.js');

    window.renderLesson = (lessonId) => {
      const { saveLastLesson, saveProgress } = require('../app-storage.js');
      saveLastLesson(lessonId);
      saveProgress({ [lessonId]: { completedAt: new Date().toISOString() } });
    };

    await window.navigate('lesson', { lessonId: 'lY' });

    expect(window.NVApp.state.currentView).toBe('lesson');
    expect(window.NVApp.state.viewParams.lessonId).toBe('lY');
    expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-last-lesson', 'lY');
    expect(window.NVAuth.setProgress).toHaveBeenCalled();
  });
});
