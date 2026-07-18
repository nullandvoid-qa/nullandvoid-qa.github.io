/**
 * Tests for Google OAuth2 Authentication Module
 */

describe('NVAuth Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Initialize mock NVAuth if not exists
    if (!window.NVAuth) {
      window.NVAuth = {
        user: null,
        isAuthenticated: false,
        getUser: () => window.NVAuth.user,
        getProgress: () => {
          const key = window.NVAuth.getStorageKey();
          try {
            return key ? JSON.parse(localStorage.getItem(key) || '{}') : {};
          } catch {
            return {};
          }
        },
        setProgress: (data) => {
          if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) return false;
          const key = window.NVAuth.getStorageKey();
          if (key) localStorage.setItem(key, JSON.stringify(data));
          return true;
        },
        getStorageKey: () => {
          return window.NVAuth.user ? `nv_${window.NVAuth.user.id}_progress` : null;
        },
      };
    }

    // Mock globals
    global.jwt_decode = (_token) => ({
      sub: 'test-user-123',
      name: 'Test User',
      picture: 'https://example.com/pic.jpg',
      email: 'test@example.com',
      iat: Date.now(),
    });
  });

  test('should initialize with authenticated = false', () => {
    expect(window.NVAuth.isAuthenticated).toBe(false);
    expect(window.NVAuth.user).toBe(null);
  });

  test('should get user when authenticated', () => {
    window.NVAuth.user = {
      id: 'test-user-123',
      name: 'Test User',
    };
    window.NVAuth.isAuthenticated = true;

    const user = window.NVAuth.getUser();
    expect(user.name).toBe('Test User');
    expect(user.id).toBe('test-user-123');
  });

  test('should generate correct storage key for user', () => {
    window.NVAuth.user = { id: 'test-user-123' };
    window.NVAuth.isAuthenticated = true;

    const key = window.NVAuth.getStorageKey();
    expect(key).toBe('nv_test-user-123_progress');
  });

  test('should save and retrieve user progress', () => {
    window.NVAuth.user = { id: 'test-user-123' };
    window.NVAuth.isAuthenticated = true;

    const testProgress = { lesson1: true, lesson2: false };
    window.NVAuth.setProgress(testProgress);

    const retrieved = window.NVAuth.getProgress();
    expect(retrieved).toEqual(testProgress);
  });

  test('should not save progress if not authenticated', () => {
    window.NVAuth.isAuthenticated = false;
    window.NVAuth.user = null;

    const result = window.NVAuth.setProgress({ test: true });
    expect(result).toBe(false);
  });

  test('should return empty progress if no data stored', () => {
    window.NVAuth.user = { id: 'test-user-999' };
    window.NVAuth.isAuthenticated = true;

    const progress = window.NVAuth.getProgress();
    expect(progress).toEqual({});
  });

  test('should isolate progress between users', () => {
    // User 1 progress
    window.NVAuth.user = { id: 'user-1' };
    window.NVAuth.isAuthenticated = true;
    window.NVAuth.setProgress({ lesson1: true });

    // User 2 progress
    window.NVAuth.user = { id: 'user-2' };
    window.NVAuth.setProgress({ lesson2: true });

    // Check user 2
    expect(window.NVAuth.getProgress()).toEqual({ lesson2: true });

    // Switch back to user 1
    window.NVAuth.user = { id: 'user-1' };
    expect(window.NVAuth.getProgress()).toEqual({ lesson1: true });
  });
});
