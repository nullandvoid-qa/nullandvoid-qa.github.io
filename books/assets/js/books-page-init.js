(function () {
  'use strict';

  function getCurrentTheme() {
    return window.BooksUtils?.getSavedTheme?.() || localStorage.getItem('theme') || 'dark';
  }

  function updateThemeToggle(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.title = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
  }

  function initializeTheme() {
    const theme = getCurrentTheme();
    window.BooksUtils?.applyTheme(theme);
    updateThemeToggle(theme);
  }

  function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      window.BooksUtils?.applyTheme(nextTheme);
      updateThemeToggle(nextTheme);
    });
  }

  function setupMobileNavigation() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav-links');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      window.BooksUtils?.setExpandedState(toggle, false);
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      window.BooksUtils?.setExpandedState(toggle, isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) {
        closeMenu();
      }
    });
  }

  function initAuth() {
    if (window.NVAuth && typeof window.NVAuth.init === 'function') {
      window.NVAuth.init();
    }
  }

  function setupAuthEvents() {
    document.addEventListener('nvauth:login', (event) => {
      if (typeof window.onNVAuthLogin === 'function') {
        window.onNVAuthLogin(event.detail);
      }
    });

    document.addEventListener('nvauth:logout', () => {
      if (typeof window.onNVAuthLogout === 'function') {
        window.onNVAuthLogout();
      }
    });

    document.addEventListener('nvauth:bookmarked', (event) => {
      if (typeof window.onNVAuthBookmarked === 'function') {
        window.onNVAuthBookmarked(event.detail);
      }
    });
  }

  function init() {
    initializeTheme();
    setupThemeToggle();
    setupMobileNavigation();
    setupAuthEvents();
    initAuth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
