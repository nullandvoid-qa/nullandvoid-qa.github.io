const { bindSingleDelegateEvent, createCatalogStateMarkup, setExpandedState, formatResultsSummary, applyTheme, showToast } = require('../../books/assets/js/books-utils.js');

describe('bindSingleDelegateEvent', () => {
  it('registers a single delegated listener for repeated bindings', () => {
    document.body.innerHTML = `
      <div id="filter-bar">
        <button type="button" class="filter-chip active" data-filter="all">Todos</button>
        <button type="button" class="filter-chip" data-filter="prod">Produtividade</button>
      </div>
    `;

    const filterBar = document.getElementById('filter-bar');
    const calls = [];
    const handler = (chip) => calls.push(chip.dataset.filter);

    bindSingleDelegateEvent(filterBar, 'click', '.filter-chip', handler);
    bindSingleDelegateEvent(filterBar, 'click', '.filter-chip', handler);

    filterBar.querySelector('[data-filter="prod"]').click();

    expect(calls).toEqual(['prod']);
  });

  it('creates accessible feedback markup for empty states', () => {
    const markup = createCatalogStateMarkup({
      type: 'empty',
      title: 'Nenhum livro combina com seus filtros',
      message: 'Tente limpar os filtros.',
      actionLabel: 'Mostrar todos os livros',
    });

    expect(markup).toContain('role="status"');
    expect(markup).toContain('Nenhum livro combina com seus filtros');
    expect(markup).toContain('Mostrar todos os livros');
  });

  it('updates the toggle state for mobile navigation', () => {
    const button = document.createElement('button');
    button.setAttribute('aria-expanded', 'false');

    setExpandedState(button, true);

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.classList.contains('is-active')).toBe(true);
  });

  it('formats a helpful results summary for the catalog', () => {
    const summary = formatResultsSummary({ visibleCount: 3, totalCount: 12, searchQuery: 'hábitos' });

    expect(summary).toContain('3');
    expect(summary).toContain('12');
    expect(summary).toContain('hábitos');
  });

  it('applies theme and updates the theme toggle text', () => {
    document.body.innerHTML = '<button id="theme-toggle"></button><div id="toast"></div>';
    applyTheme('light');

    const toggle = document.getElementById('theme-toggle');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(toggle.textContent).toBe('🌙');
  });

  it('shows toast messages in the shared toast element', () => {
    document.body.innerHTML = '<div id="toast"></div>';
    showToast('Test');

    const toast = document.getElementById('toast');
    expect(toast.textContent).toBe('Test');
    expect(toast.classList.contains('show')).toBe(true);
  });
});
