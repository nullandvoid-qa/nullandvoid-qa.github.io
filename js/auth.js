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
  const STORAGE_KEY_USER = 'nv_auth_user';
  const STORAGE_KEY_TOKEN = 'nv_auth_token';
  const STORAGE_KEY_PROGRESS_SUFFIX = '_progress'; // user_id + suffix

  // Export to global
  window.NVAuth = {
    user: null,
    isAuthenticated: false,
    init,
    getUser,
    getProgress,
    setProgress,
    logout,
    getStorageKey,
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
    if (window.google && window.google.accounts) {
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
      }
    }

    renderAuthUI();
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

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_TOKEN, response.credential);

      // Trigger custom event for other modules
      document.dispatchEvent(new CustomEvent('nvauth:login', { detail: user }));

      renderAuthUI();
      showToast(`Bem-vindo, ${user.name}! 👋`);
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
      if (window.NVAuth.user.picture) {
        picture.src = window.NVAuth.user.picture;
      }
    } else {
      signinDiv.classList.remove('hidden');
      userDiv.classList.add('hidden');
    }
  }

  /**
   * Get current user
   */
  function getUser() {
    return window.NVAuth.user;
  }

  /**
   * Get user's progress from localStorage
   */
  function getProgress() {
    if (!window.NVAuth.isAuthenticated || !window.NVAuth.user) {
      return {};
    }

    const key = getStorageKey();
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse progress:', e);
      return {};
    }
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
    try {
      localStorage.setItem(key, JSON.stringify(progressData));
      return true;
    } catch (e) {
      console.error('Failed to save progress:', e);
      return false;
    }
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
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  /**
   * Show auth error
   */
  function showAuthError(message) {
    showToast(`❌ ${message}`);
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
  window.addEventListener('load', () => {
    // Wait for Google to be available
    if (window.google && window.google.accounts) {
      init();
    } else {
      // Retry after delay
      setTimeout(init, 1000);
    }
  });
})();
