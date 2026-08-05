describe('app.js track loading fallback', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="view-home"></div>
      <div id="view-lesson"></div>
      <button id="btn-reset-progress"></button>
      <button id="btn-export-progress"></button>
      <input id="progress-import-input" />
    `;

    global.getElementById = (id) => document.getElementById(id);
    global.getStoredItem = (key) => localStorage.getItem(key);
    global.setStoredItem = (key, value) => localStorage.setItem(key, value);
    global.removeStoredItem = (key) => localStorage.removeItem(key);
    global.getStorage = (key, legacyKey) => {
      const value = localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null);
      return value;
    };
    global.getStoredProgress = () => ({});
    global.persistProgress = jest.fn();
    global.validateBookmarksData = (data) => Array.isArray(data) && data.every((item) => typeof item === 'string');
    global.validateQuizzesPassedData = (data) => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
      return Object.values(data).every((value) => value && typeof value === 'object' && typeof value.passedAt === 'string' && typeof value.score === 'number');
    };
    global.validateChecklistState = (data) => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
      return Object.values(data).every((item) => Array.isArray(item) && item.every((idx) => typeof idx === 'number'));
    };

    window.initAppRegistry = jest.fn(({ state, helpers }) => {
      window.NVApp = { state, helpers };
    });

    window.NVAppSettings = {};
    window.showToast = jest.fn();
    window.t = (key, fallback) => fallback || key;
    window.NVViewHelpers = { setActiveView: jest.fn() };
    window.renderHome = jest.fn();
    window.renderTracksPage = jest.fn();
    window.renderLesson = jest.fn();
    window.scrollTo = jest.fn();

    delete require.cache[require.resolve('../app-navigation.js')];
    require('../app-navigation.js');
    delete require.cache[require.resolve('../app.js')];
  });

  afterEach(() => {
    delete window.initAppRegistry;
    delete window.NVApp;
    delete window.NVAppTracks;
    delete window.TG_QAWAY_TRACKS;
    delete window.NVAppSettings;
    delete window.showToast;
    delete window.t;
    delete window.findLesson;
    delete window.navigate;
    delete window.refreshCurrentView;
  });

  test('defaults to empty tracks when NVAppTracks.mergeTrackSources returns invalid', () => {
    window.NVAppTracks = {
      mergeTrackSources: jest.fn(() => null),
    };
    window.TG_QAWAY_TRACKS = [];

    jest.isolateModules(() => {
      require('../app.js');
    });

    expect(window.NVAppTracks.mergeTrackSources).toHaveBeenCalled();
    expect(window.NVApp.state.tracks).toEqual([]);
    expect(window.findLesson('missing')).toBeNull();
  });

  test('falls back to empty tracks when TG_QAWAY_TRACKS is not an array', () => {
    delete window.NVAppTracks;
    window.TG_QAWAY_TRACKS = 'invalid';

    jest.isolateModules(() => {
      require('../app.js');
    });

    expect(window.NVApp.state.tracks).toEqual([]);
    expect(window.findLesson('missing')).toBeNull();
  });
});
