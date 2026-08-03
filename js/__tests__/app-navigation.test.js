describe('app-navigation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="view-home" class="view"></div>
      <div id="view-lesson" class="view"></div>
      <div class="nav-links">
        <a data-nav="home"></a>
        <a data-nav="lesson"></a>
      </div>
    `;

    window.NVApp = {
      state: {
        currentView: 'home',
        viewParams: {},
      },
      helpers: {},
    };

    window.NVViewHelpers = {
      setActiveView: jest.fn(),
    };

    window.renderHome = jest.fn();
    window.renderTracksPage = jest.fn();
    window.renderRoadmap = jest.fn();
    window.renderGlossary = jest.fn();
    window.renderLabs = jest.fn();
    window.renderSandbox = jest.fn();
    window.renderTrackDetail = jest.fn();
    window.renderLesson = jest.fn();
    window.renderQuiz = jest.fn();
    window.renderDashboard = jest.fn();
    window.scrollTo = jest.fn();

    delete require.cache[require.resolve('../app-navigation.js')];
    require('../app-navigation.js');
  });

  afterEach(() => {
    delete window.NVApp;
    delete window.NVViewHelpers;
    delete window.renderHome;
    delete window.renderTracksPage;
    delete window.renderRoadmap;
    delete window.renderGlossary;
    delete window.renderLabs;
    delete window.renderSandbox;
    delete window.renderTrackDetail;
    delete window.renderLesson;
    delete window.renderQuiz;
    delete window.renderDashboard;
    delete window.navigate;
    delete window.refreshCurrentView;
    delete window.scrollTo;
  });

  test('navigate updates shared app state and dispatches the lesson renderer', async () => {
    await window.navigate('lesson', { lessonId: 'l1' });

    expect(window.NVApp.state.currentView).toBe('lesson');
    expect(window.NVApp.state.viewParams).toEqual({ lessonId: 'l1' });
    expect(window.NVViewHelpers.setActiveView).toHaveBeenCalledWith(document, 'lesson', 'tracks');
    expect(window.renderLesson).toHaveBeenCalledWith('l1');
  });
});
