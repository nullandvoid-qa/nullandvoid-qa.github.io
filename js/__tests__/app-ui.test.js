describe('app-ui toast fallback', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toast"></div>';
    jest.resetModules();
    require('../app-ui.js');
  });

  afterEach(() => {
    delete window.NVAppUI;
    delete window.showToast;
    delete window.nvToast;
  });

  test('showToast safely enqueues and displays text content', () => {
    window.showToast('Hello');
    expect(document.getElementById('toast').textContent).toBe('Hello');
    expect(window.nvToast.isShowing).toBe(true);
  });
});
