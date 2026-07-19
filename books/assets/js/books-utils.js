(function (root, factory) {
  'use strict';

  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.BooksUtils = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getToastElement() {
    return document.getElementById('toast');
  }

  function showToast(message, duration = 3000) {
    const toast = getToastElement();
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggle.title = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
    }
  }

  function getSavedTheme() {
    return localStorage.getItem('theme') || 'dark';
  }

  function setExpandedState(toggle, expanded) {
    if (!toggle) return;
    toggle.classList.toggle('is-active', expanded);
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function bindSingleDelegateEvent(root, eventName, selector, handler) {
    if (!root || typeof handler !== 'function') return;

    if (!root.__delegateHandlers) {
      root.__delegateHandlers = new Map();
    }

    const existing = root.__delegateHandlers.get(eventName);
    if (existing && existing.get(selector)) {
      return;
    }

    const listener = (event) => {
      const target = event.target.closest(selector);
      if (!target) return;
      handler(target, event);
    };

    root.addEventListener(eventName, listener);

    if (!existing) {
      root.__delegateHandlers.set(eventName, new Map());
    }

    root.__delegateHandlers.get(eventName).set(selector, listener);
  }

  function createCatalogStateMarkup({ type = 'empty', title, message, actionLabel } = {}) {
    const actionMarkup = actionLabel
      ? `<div class="state-actions"><button type="button" class="btn btn-secondary btn-sm state-action">${escapeHtml(actionLabel)}</button></div>`
      : '';

    return `
      <div class="catalog-state catalog-state-${type}" role="status" aria-live="polite">
        <h3 class="state-title">${escapeHtml(title || 'Informação')}</h3>
        <p class="state-message">${escapeHtml(message || '')}</p>
        ${actionMarkup}
      </div>
    `;
  }

  function formatResultsSummary({ visibleCount, totalCount, searchQuery, currentFilter }) {
    const parts = [];
    parts.push(`${visibleCount} de ${totalCount} livros`);
    if (currentFilter && currentFilter !== 'all') {
      parts.push(`categoria: ${escapeHtml(currentFilter)}`);
    }
    if (searchQuery) {
      parts.push(`busca: "${escapeHtml(searchQuery)}"`);
    }
    return parts.join(' · ');
  }

  return { bindSingleDelegateEvent, createCatalogStateMarkup, setExpandedState, formatResultsSummary, showToast, applyTheme, getSavedTheme };
});
