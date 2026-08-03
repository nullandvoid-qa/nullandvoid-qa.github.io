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

  function applyTheme() {
    const state = getState();
    const theme = state.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = window.getElementById ? window.getElementById('theme-toggle') : document.getElementById('theme-toggle');
    if (btn) {
      const iconName = theme === 'dark' ? 'moon' : 'sun';
      btn.innerHTML = window.getIconMarkup ? window.getIconMarkup(iconName, '18') : window.NVIcons?.get(iconName, '', '18') || '';
      const nextThemeLabel = theme === 'dark'
        ? window.t('settings.toggleThemeLight')
        : window.t('settings.toggleThemeDark');
      btn.setAttribute('aria-label', nextThemeLabel);
      btn.setAttribute('title', nextThemeLabel);
    }
    try { localStorage.setItem('testers-guild-theme', theme); } catch (e) { /* ignore */ }
  }

  function toggleTheme() {
    const state = getState();
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    window.showToast(window.t(state.theme === 'dark' ? 'settings.themeDark' : 'settings.themeLight'));
  }

  function applySeniorMode() {
    const state = getState();
    const seniorMode = !!state.seniorMode;
    document.documentElement.classList.toggle('senior-mode', seniorMode);
    const btn = document.getElementById('senior-mode-toggle');
    if (btn) {
      btn.classList.toggle('active-toggle', seniorMode);
      btn.title = seniorMode
        ? window.t('settings.seniorModeOn', state.lang === 'en' ? 'Senior Mode ON' : 'Modo Sênior ATIVO')
        : window.t('settings.seniorModeOff', state.lang === 'en' ? 'Senior Mode' : 'Modo Sênior');
    }
    try { localStorage.setItem('testers-guild-senior-mode', String(seniorMode)); } catch (e) { /* ignore */ }
  }

  function toggleSeniorMode() {
    const state = getState();
    state.seniorMode = !state.seniorMode;
    applySeniorMode();
    window.showToast(
      state.seniorMode
        ? window.t('settings.seniorModeOnToast', state.lang === 'en' ? 'Senior Mode ON — beginner tips hidden' : 'Modo Sênior ativado — dicas iniciante ocultas')
        : window.t('settings.seniorModeOffToast', state.lang === 'en' ? 'Senior Mode OFF' : 'Modo Sênior desativado'),
    );
    if (state.currentView === 'lesson' && typeof window.renderLesson === 'function') {
      window.renderLesson(state.viewParams?.lessonId);
    }
  }

  function applyStaticI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key) el.textContent = window.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (key) el.placeholder = window.t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (key) el.title = window.t(key);
    });
    document.querySelectorAll('[data-i18n-label]').forEach((el) => {
      const key = el.dataset.i18nLabel;
      if (key) el.setAttribute('aria-label', window.t(key));
    });

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      const langLabel = window.t('settings.toggleLanguage');
      langToggle.setAttribute('aria-label', langLabel);
      langToggle.setAttribute('title', langLabel);
    }

    const priceEl = document.getElementById('stat-price');
    if (priceEl) priceEl.textContent = window.t('price');
  }

  function updateLangToggle() {
    const state = getState();
    const btn = document.getElementById('lang-toggle');
    const label = document.getElementById('lang-label');
    const flag = btn?.querySelector('.lang-flag');
    if (label) label.textContent = window.t('lang.toggle');
    if (flag) flag.textContent = state.lang === 'pt' ? '🇧🇷' : '🇺🇸';

    if (btn) {
      const langLabel = window.t('settings.toggleLanguage');
      btn.setAttribute('aria-label', langLabel);
      btn.setAttribute('title', langLabel);
    }
  }

  function renderNavLinks() {
    const navLinksEl = document.getElementById('nav-links');
    if (!navLinksEl) return;

    const navItems = window.TG_NAV_ITEMS || [];
    const navHtml = navItems
      .map((item) => `
        <a href="${item.href}" data-nav="${item.nav}" data-i18n="${item.i18n}">
          ${window.t(item.i18n)}
        </a>
      `)
      .join('');

    const badgeHtml = `
      <span class="badge-free" data-i18n="nav.allUnlocked">
        <span data-icon="unlock" data-icon-size="14"></span> ${window.t('nav.allUnlocked')}
      </span>
    `;

    navLinksEl.innerHTML = navHtml + badgeHtml;
    bindNavLinks();
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
    const state = getState();
    state.lang = newLang === 'en' ? 'en' : 'pt';
    window.lang = state.lang; // Sync with global
    try { localStorage.setItem('testers-guild-lang', state.lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';
    document.title = window.t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = window.t('meta.description');
    renderNavLinks();
    applyStaticI18n();
    applyTheme();
    applySeniorMode();
    updateLangToggle();
    if (typeof window.refreshCurrentView === 'function') window.refreshCurrentView();
    window.showToast(window.t('toast.langChanged'));
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
