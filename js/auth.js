/**
 * Google OAuth2 Authentication Module
 * Handles login/logout and stores user info locally
 * @global google - Google Sign-In API
 * @global jwt_decode - JWT decoding library
 */

/* global google, jwt_decode */

(function() {
  'use strict';

  // Configuration
  const GOOGLE_CLIENT_ID = '891864212965-ka68deqed5he142866v3eul9f7plq19k.apps.googleusercontent.com'; // User must set this
  const GOOGLE_SIGNIN_URL = 'https://accounts.google.com/gsi/client';
  const STORAGE_KEY_USER = 'nv_auth_user';
  const STORAGE_KEY_TOKEN = 'nv_auth_token';
  const STORAGE_KEY_PROGRESS_SUFFIX = '_progress'; // user_id + suffix
  const GUEST_USER_ID = 'guest_user';

  function isLocalDevelopment() {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  }

  function readStoredJson(key, fallback = {}) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error('Failed to parse storage value:', e);
      return fallback;
    }
  }

  function saveStoredJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Failed to save storage value:', e);
      return false;
    }
  }

  function loadGoogleSignInScript() {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts) return resolve(true);
      const existing = document.querySelector(`script[src="${GOOGLE_SIGNIN_URL}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = GOOGLE_SIGNIN_URL;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => resolve(true));
      script.addEventListener('error', () => resolve(false));
      document.head.appendChild(script);
    });
  }

  // Export to global
  window.NVAuth = {
    user: null,
    isAuthenticated: false,
    init,
    getUser,
    getUserName,
    getProgress,
    setProgress,
    logout,
    getStorageKey,
    getReadBooks,
    markAsRead,
    unmarkAsRead,
    isBookRead,
  };

  /**
   * Initialize Google Sign-In
   */
  function init() {
    // Check if already logged in
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      try {
        window.NVAuth.user = JSON.parse(savedUser);
        window.NVAuth.isAuthenticated = true;
        renderAuthUI();
        return;
      } catch (e) {
        console.error('Failed to restore user session:', e);
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }

    // Initialize Google Sign-In button
    const initializeGoogleSignIn = () => {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        });

        google.accounts.id.renderButton(
          document.getElementById('auth-signin'),
          {
            theme: 'dark',
            size: 'large',
            text: 'signin_with',
            logo_alignment: 'left',
          }
        );
      } catch (e) {
        console.error('Google Sign-In initialization failed:', e);
        showAuthError('Google Sign-In não disponível');
        renderLocalAuthFallback();
      }
    };

    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      loadGoogleSignInScript().then((loaded) => {
        if (loaded && window.google && window.google.accounts) {
          initializeGoogleSignIn();
        } else {
          console.warn('Google Sign-In library failed to load or is unavailable.');
          showAuthError('Google Sign-In não disponível');
          renderLocalAuthFallback();
        }
      });
    }

    renderAuthUI();
  }

  function loginGuest() {
    const user = {
      id: GUEST_USER_ID,
      name: 'Convidado',
      picture: '',
      email: '',
    };

    window.NVAuth.user = user;
    window.NVAuth.isAuthenticated = true;
    saveStoredJson(STORAGE_KEY_USER, user);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    document.dispatchEvent(new CustomEvent('nvauth:login', { detail: user }));
    renderAuthUI();
    showToast(window.t ? window.t('auth.localSignInSuccess') : 'Entrou como convidado');
  }

  function renderLocalAuthFallback() {
    const signinDiv = document.getElementById('auth-signin');
    if (!signinDiv) return;
    // In production we avoid duplicating Google Sign-In and guest fallback.
    // For local development (and tests) always show the guest fallback so
    // automated tests can use the local sign-in flow.
    if (!isLocalDevelopment() && window.google && window.google.accounts) return;

    let fallbackBtn = document.getElementById('auth-local-signin');
    if (!fallbackBtn) {
      fallbackBtn = document.createElement('button');
      fallbackBtn.id = 'auth-local-signin';
      fallbackBtn.type = 'button';
      fallbackBtn.className = 'btn btn-secondary';
      fallbackBtn.style.marginTop = '0.75rem';
      fallbackBtn.textContent = window.t ? window.t('auth.localSignIn') : 'Entrar como convidado';
      fallbackBtn.addEventListener('click', loginGuest);
      signinDiv.appendChild(fallbackBtn);
    }
  }

  /**
   * Handle Google Sign-In response
   */
  function handleCredentialResponse(response) {
    if (!response.credential) {
      console.error('No credential received');
      return;
    }

    // Check if jwt_decode is available
    if (typeof jwt_decode === 'undefined') {
      console.error('jwt_decode library not loaded');
      showAuthError('Biblioteca de autenticação não carregada. Recarregue a página.');
      return;
    }

    try {
      // Decode JWT token
      const decoded = jwt_decode(response.credential);

      // Store user info (only public data)
      const user = {
        id: decoded.sub, // Unique Google ID (not email, safer)
        name: decoded.name || 'User',
        picture: decoded.picture || '',
        email: decoded.email || '', // Store for reference but never expose
        iat: decoded.iat,
      };

      window.NVAuth.user = user;
      window.NVAuth.isAuthenticated = true;

      // Save only the minimal session payload locally.
      // Avoid persisting the raw credential token when not strictly needed.
      saveStoredJson(STORAGE_KEY_USER, user);
      localStorage.removeItem(STORAGE_KEY_TOKEN);

      // Trigger custom event for other modules
      document.dispatchEvent(new CustomEvent('nvauth:login', { detail: user }));

      renderAuthUI();
      showToast(`Bem-vindo, ${user.name}!`);
    } catch (e) {
      console.error('Failed to decode credential:', e);
      showAuthError('Falha ao processar login');
    }
  }

  /**
   * Logout user
   */
  function logout() {
    window.NVAuth.user = null;
    window.NVAuth.isAuthenticated = false;

    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);

    // Google logout
    if (window.google && window.google.accounts) {
      google.accounts.id.disableAutoSelect();
    }

    document.dispatchEvent(new CustomEvent('nvauth:logout'));

    renderAuthUI();
    showToast('Desconectado com sucesso');
  }

  /**
   * Render auth UI based on login state
   */
  function renderAuthUI() {
    const signinDiv = document.getElementById('auth-signin');
    const userDiv = document.getElementById('auth-user');

    if (!signinDiv || !userDiv) return;

    if (window.NVAuth.isAuthenticated && window.NVAuth.user) {
      signinDiv.classList.add('hidden');
      userDiv.classList.remove('hidden');

      document.getElementById('auth-name').textContent = window.NVAuth.user.name;
      const picture = document.getElementById('auth-picture');
      if (picture) {
        if (window.NVAuth.user.picture) {
          picture.src = window.NVAuth.user.picture;
        } else {
          picture.src = '';
        }
      }
    } else {
      signinDiv.classList.remove('hidden');
      userDiv.classList.add('hidden');
      // Show guest fallback during local development so tests and local dev
      // environments can sign in as a guest reliably. In production we avoid
      // rendering both Google and guest buttons.
      if (isLocalDevelopment()) {
        renderLocalAuthFallback();
      }
    }
  }

  /**
   * Get current user
   */
  function getUser() {
    return window.NVAuth.user;
  }

  /**
   * Get current user name
   */
  function getUserName() {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      return null;
    }
    return window.NVAuth.user.name || null;
  }

  /**
   * Get user's progress from localStorage
   */
  function getProgress() {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      return {};
    }

    const key = getStorageKey();
    return readStoredJson(key, {});
  }

  /**
   * Save user's progress to localStorage
   */
  function setProgress(progressData) {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      console.warn('Cannot save progress: user not authenticated');
      return false;
    }

    const key = getStorageKey();
    return saveStoredJson(key, progressData);
  }

  /**
   * Get localStorage key for user progress
   */
  function getStorageKey() {
    if (!window.NVAuth.user) return null;
    return `nv_${window.NVAuth.user.id}${STORAGE_KEY_PROGRESS_SUFFIX}`;
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }

    const toast = document.getElementById('toast');
    if (!toast) return;
    if (!showToast.queue) showToast.queue = [];
    showToast.queue.push(message);
    if (showToast.isShowing) return;

    const showNext = () => {
      if (!showToast.queue.length) {
        showToast.isShowing = false;
        return;
      }
      const nextMessage = showToast.queue.shift();
      toast.textContent = nextMessage;
      toast.classList.add('show');
      showToast.isShowing = true;
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => {
        toast.classList.remove('show');
        showToast.isShowing = false;
        showNext();
      }, 3000);
    };

    showNext();
  }

  /**
   * Show auth error
   */
  function showAuthError(message) {
    showToast(message);
  }

  /**
   * Attach logout button listener
   */
  function attachLogoutListener() {
    const logoutBtn = document.getElementById('auth-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }

  /**
   * Setup when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLogoutListener);
  } else {
    attachLogoutListener();
  }

  // Auto-init when script loads
  function bootstrapAuth() {
    if (window.google && window.google.accounts) {
      init();
      return;
    }

    loadGoogleSignInScript().then((loaded) => {
      if (loaded && window.google && window.google.accounts) {
        init();
      } else {
        console.warn('Google Sign-In library failed to load or is unavailable.');
        init();
      }
    });
  }

  if (document.readyState === 'complete') {
    bootstrapAuth();
  } else {
    window.addEventListener('load', bootstrapAuth);
  }

  /**
   * Get all read books for current user
   * @returns {Object} Map of book IDs to read status
   */
  function getReadBooks() {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      return {};
    }

    const key = `nv_${window.NVAuth.user.id}_read_books`;
    return readStoredJson(key, {});
  }

  /**
   * Mark a book as read
   * @param {string} bookId - Book ID
   * @returns {boolean} Success status
   */
  function markAsRead(bookId) {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      console.warn('Cannot mark book as read: user not authenticated');
      return false;
    }

    try {
      const readBooks = getReadBooks();
      readBooks[bookId] = {
        readAt: new Date().toISOString(),
        completed: true,
      };
      const key = `nv_${window.NVAuth.user.id}_read_books`;
      saveStoredJson(key, readBooks);
      document.dispatchEvent(new CustomEvent('nvauth:bookmarked', { detail: { bookId, marked: true } }));
      return true;
    } catch (e) {
      console.error('Failed to mark book as read:', e);
      return false;
    }
  }

  /**
   * Unmark a book as read
   * @param {string} bookId - Book ID
   * @returns {boolean} Success status
   */
  function unmarkAsRead(bookId) {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      console.warn('Cannot unmark book as read: user not authenticated');
      return false;
    }

    try {
      const readBooks = getReadBooks();
      delete readBooks[bookId];
      const key = `nv_${window.NVAuth.user.id}_read_books`;
      saveStoredJson(key, readBooks);
      document.dispatchEvent(new CustomEvent('nvauth:bookmarked', { detail: { bookId, marked: false } }));
      return true;
    } catch (e) {
      console.error('Failed to unmark book as read:', e);
      return false;
    }
  }

  /**
   * Check if a book is marked as read
   * @param {string} bookId - Book ID
   * @returns {boolean} Whether book is read
   */
  function isBookRead(bookId) {
    const readBooks = getReadBooks();
    return readBooks[bookId]?.completed === true;
  }
})();
