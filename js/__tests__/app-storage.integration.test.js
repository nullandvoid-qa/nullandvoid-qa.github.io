describe('app-storage integration with NVAuth and storage', () => {
  beforeEach(() => {
    jest.resetModules();
    delete window.NVAppStorage;
    delete window.NVAuth;
    localStorage.clear();
  });
  
  function ensureUtils() {
    // utils.js exposes persistProgress/getStoredProgress etc. Ensure they are loaded
    const utils = require('../utils.js');
    // attach to global/window so app-storage can call them
    global.persistProgress = utils.persistProgress;
    global.getStoredProgress = utils.getStoredProgress;
    global.setStoredItem = utils.setStoredItem;
    global.getStoredItem = utils.getStoredItem;
  }

  test('saveProgress calls NVAuth.setProgress when authenticated', () => {
    const NVAuthMock = {
      isAuthenticated: true,
      setProgress: jest.fn(),
    };
    window.NVAuth = NVAuthMock;
    ensureUtils();
    const { saveProgress } = require('../app-storage.js');
    const state = { lessonA: { completedAt: '2024-01-01' } };
    saveProgress(state);
    expect(NVAuthMock.setProgress).toHaveBeenCalled();
  });

  test('saveLastLesson uses setStoredItem to persist', () => {
    ensureUtils();
    const { saveLastLesson } = require('../app-storage.js');
    // setStoredItem defined in utils.js; override to spy
    window.setStoredItem = jest.fn((k, v) => localStorage.setItem(k, v));
    saveLastLesson('l42');
    expect(window.setStoredItem).toHaveBeenCalledWith('testers-guild-last-lesson', 'l42');
  });
});
