(function (root, factory) {
  const exports = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = exports;
  } else {
    root.BooksUtils = exports;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function bindSingleDelegateEvent(container, eventName, selector, handler) {
    if (!container || typeof container.addEventListener !== 'function' || typeof handler !== 'function') {
      return;
    }

    const key = `__bookDelegate:${eventName}:${selector}`;
    if (container[key]) {
      return;
    }

    container[key] = true;
    container.addEventListener(eventName, (event) => {
      const target = event.target instanceof Element ? event.target.closest(selector) : null;
      if (!target) return;
      handler(target, event);
    });
  }

  function createCatalogStateMarkup({ type, title, message, actionLabel } = {}) {
    const safeTitle = title || 'Sem resultados';
    const safeMessage = message || 'Tente ajustar os filtros.';
    const safeAction = actionLabel || 'Mostrar todos os livros';

    return `
      <div class="catalog-state" role="status" aria-live="polite">
        <h3>${safeTitle}</h3>
        <p>${safeMessage}</p>
        <button type="button" class="catalog-state-action">${safeAction}</button>
      </div>
    `;
  }

  function setExpandedState(button, expanded) {
    if (!button) return;
    const nextExpanded = !!expanded;
    button.setAttribute('aria-expanded', String(nextExpanded));
    button.classList.toggle('is-active', nextExpanded);
  }

  function formatResultsSummary({ visibleCount, totalCount, searchQuery, filterLabel } = {}) {
    const safeVisible = Number.isFinite(Number(visibleCount)) ? Number(visibleCount) : 0;
    const safeTotal = Number.isFinite(Number(totalCount)) ? Number(totalCount) : safeVisible;
    const query = typeof searchQuery === 'string' && searchQuery.trim() ? searchQuery.trim() : '';
    const filter = typeof filterLabel === 'string' && filterLabel.trim() ? filterLabel.trim() : '';

    const parts = [`Mostrando ${safeVisible} de ${safeTotal} livros`];
    if (query) parts.push(`para a busca “${query}”`);
    if (filter) parts.push(`no filtro ${filter}`);
    return parts.join(' ');
  }

  function applyTheme(themeName) {
    const resolved = themeName === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = resolved === 'dark' ? '🌙' : '☀️';
    }
    return resolved;
  }

  function showToast(message) {
    const container = document.getElementById('toast') || document.createElement('div');
    container.id = 'toast';
    if (!container.parentNode) {
      document.body.appendChild(container);
    }
    container.textContent = String(message || '');
    container.classList.add('show');
    window.clearTimeout(container.__toastTimer);
    container.__toastTimer = window.setTimeout(() => {
      container.classList.remove('show');
    }, 1800);
  }

  return {
    bindSingleDelegateEvent,
    createCatalogStateMarkup,
    setExpandedState,
    formatResultsSummary,
    applyTheme,
    showToast,
  };
});
