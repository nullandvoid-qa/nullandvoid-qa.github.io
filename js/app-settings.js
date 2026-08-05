/**
 * app-settings.js
 *
 * Theme, senior mode, and language toggles for the Null and Void QA Course.
 * Reads and mutates the shared app state exposed via window.NVApp.state.
 */
(function () {
  function getState() {
    return window.NVApp?.state || {};
  }

  function getTranslator() {
    return typeof window.t === 'function'
      ? window.t
      : (key, fallback) => fallback || key;
  }

  function getElement(id) {
    if (typeof window.getElementById === 'function') return window.getElementById(id);
    return document.getElementById(id);
  }

  function safeSetLocalStorage(key, value) {
    if (typeof window !== 'undefined' && window.NVAppStorage?.safeSetStoredItem) {
      try { window.NVAppStorage.safeSetStoredItem(key, value); return; } catch (e) { /* ignore */ }
    }
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function applyTheme() {
    const t = getTranslator();
    const state = getState();
    const theme = state.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = getElement('theme-toggle');
    if (btn) {
      const iconName = theme === 'dark' ? 'moon' : 'sun';
      btn.innerHTML = typeof window.getIconMarkup === 'function'
        ? window.getIconMarkup(iconName, '18')
        : window.NVIcons?.get?.(iconName, '', '18') || '';
      const nextThemeLabel = theme === 'dark'
        ? t('settings.toggleThemeLight', 'Switch to light theme')
        : t('settings.toggleThemeDark', 'Switch to dark theme');
      btn.setAttribute('aria-label', nextThemeLabel);
      btn.setAttribute('title', nextThemeLabel);
    }
    safeSetLocalStorage('testers-guild-theme', theme);
  }

  function toggleTheme() {
    const t = getTranslator();
    const state = getState();
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    if (typeof window.showToast === 'function') {
      window.showToast(t(state.theme === 'dark' ? 'settings.themeDark' : 'settings.themeLight', state.theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'));
    }
  }

  function applySeniorMode() {
    const t = getTranslator();
    const state = getState();
    const seniorMode = !!state.seniorMode;
    document.documentElement.classList.toggle('senior-mode', seniorMode);
    const btn = getElement('senior-mode-toggle');
    if (btn) {
      btn.classList.toggle('active-toggle', seniorMode);
      btn.title = seniorMode
        ? t('settings.seniorModeOn', state.lang === 'en' ? 'Senior Mode ON' : 'Modo Sênior ATIVO')
        : t('settings.seniorModeOff', state.lang === 'en' ? 'Senior Mode' : 'Modo Sênior');
    }
    safeSetLocalStorage('testers-guild-senior-mode', String(seniorMode));
  }

  function toggleSeniorMode() {
    const t = getTranslator();
    const state = getState();
    state.seniorMode = !state.seniorMode;
    applySeniorMode();
    if (typeof window.showToast === 'function') {
      window.showToast(
        state.seniorMode
          ? t('settings.seniorModeOnToast', state.lang === 'en' ? 'Senior Mode ON — beginner tips hidden' : 'Modo Sênior ativado — dicas iniciante ocultas')
          : t('settings.seniorModeOffToast', state.lang === 'en' ? 'Senior Mode OFF' : 'Modo Sênior desativado'),
      );
    }
    if (state.currentView === 'lesson' && typeof window.renderLesson === 'function') {
      window.renderLesson(state.viewParams?.lessonId);
    }
  }

  function applyStaticI18n() {
    const t = getTranslator();
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (key) el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (key) el.title = t(key);
    });
    document.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const key = el.dataset.i18nLabel;
      if (key) el.setAttribute('aria-label', t(key));
    });

    const langToggle = getElement('lang-toggle');
    if (langToggle) {
      const langLabel = t('settings.toggleLanguage', 'Toggle language');
      langToggle.setAttribute('aria-label', langLabel);
      langToggle.setAttribute('title', langLabel);
    }

    const priceEl = getElement('stat-price');
    if (priceEl) priceEl.textContent = t('price', 'Price');
  }

  function updateLangToggle() {
    const t = getTranslator();
    const state = getState();
    const btn = getElement('lang-toggle');
    const label = getElement('lang-label');
    const flag = btn?.querySelector('.lang-flag');
    if (label) label.textContent = t('lang.toggle', 'Language');
    if (flag) flag.textContent = state.lang === 'pt' ? '🇧🇷' : '🇺🇸';

    if (btn) {
      const langLabel = t('settings.toggleLanguage', 'Toggle language');
      btn.setAttribute('aria-label', langLabel);
      btn.setAttribute('title', langLabel);
    }
  }

  function renderNavLinks() {
    const t = getTranslator();
    const navLinksEl = getElement('nav-links');
    if (!navLinksEl) return;

    const navItems = Array.isArray(window.TG_NAV_ITEMS) ? window.TG_NAV_ITEMS : [];
    const navHtml = navItems
      .map((item) => `
        <a href="${item.href}" data-nav="${item.nav}" data-i18n="${item.i18n}">
          ${t(item.i18n, item.title || item.nav)}
        </a>
      `)
      .join('');

    const badgeHtml = `
      <span class="badge-free" data-i18n="nav.allUnlocked">
        <span data-icon="unlock" data-icon-size="14"></span> ${t('nav.allUnlocked', 'All unlocked')}
      </span>
    `;

    navLinksEl.innerHTML = navHtml + badgeHtml;
    if (typeof bindNavLinks === 'function') bindNavLinks();
  }

  function bindNavLinks() {
    document.querySelectorAll('[data-nav]').forEach((el) => {
      el.removeEventListener('click', handleNavClick);
      el.addEventListener('click', handleNavClick);
    });
  }

  function handleNavClick(e) {
    e.preventDefault();
    const nav = e.currentTarget.dataset.nav;
    if (typeof window.navigate === 'function') window.navigate(nav);
  }

  function setLang(newLang) {
    const t = getTranslator();
    const state = getState();
    state.lang = newLang === 'en' ? 'en' : 'pt';
    safeSetLocalStorage('testers-guild-lang', state.lang);
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';
    if (typeof document.title !== 'undefined') document.title = t('meta.title', document.title || '');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t('meta.description', metaDesc.content || '');
    if (typeof renderNavLinks === 'function') renderNavLinks();
    if (typeof applyStaticI18n === 'function') applyStaticI18n();
    if (typeof applyTheme === 'function') applyTheme();
    if (typeof applySeniorMode === 'function') applySeniorMode();
    if (typeof updateLangToggle === 'function') updateLangToggle();
    if (typeof window.refreshCurrentView === 'function') window.refreshCurrentView();
    if (typeof window.showToast === 'function') window.showToast(t('toast.langChanged', state.lang === 'en' ? 'Language changed' : 'Idioma alterado'));
  }

  function toggleLang() {
    const state = getState();
    setLang(state.lang === 'pt' ? 'en' : 'pt');
  }

  window.NVAppSettings = {
    applyTheme,
    toggleTheme,
    applySeniorMode,
    toggleSeniorMode,
    applyStaticI18n,
    updateLangToggle,
    renderNavLinks,
    bindNavLinks,
    setLang,
    toggleLang,
  };

  // Expose on window for legacy callers in app.js
  window.applyTheme = applyTheme;
  window.toggleTheme = toggleTheme;
  window.applySeniorMode = applySeniorMode;
  window.toggleSeniorMode = toggleSeniorMode;
  window.applyStaticI18n = applyStaticI18n;
  window.updateLangToggle = updateLangToggle;
  window.renderNavLinks = renderNavLinks;
  window.bindNavLinks = bindNavLinks;
  window.setLang = setLang;
  window.toggleLang = toggleLang;
})();
