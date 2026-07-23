/**
 * Regression test for logout UI behavior.
 */

describe('Logout UI regression', () => {
  let reloadCalled = false;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    window.showToast = jest.fn();
    reloadCalled = false;

    window.__NVAuthReload = () => {
      reloadCalled = true;
    };

    window.NVAuth = window.NVAuth || { user: null, isAuthenticated: false };

    delete require.cache[require.resolve('../auth.js')];
    require('../auth.js');
  });

  test('calls location.reload after logout to restore login UI', () => {
    window.NVAuth.user = { id: 'user-1', name: 'Test User' };
    window.NVAuth.isAuthenticated = true;

    expect(typeof window.NVAuth.logout).toBe('function');
    window.NVAuth.logout();

    expect(reloadCalled).toBe(true);
    expect(window.NVAuth.isAuthenticated).toBe(false);
    expect(window.NVAuth.user).toBeNull();
  });
});
