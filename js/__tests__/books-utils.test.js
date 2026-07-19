const { bindSingleDelegateEvent, createCatalogStateMarkup } = require('../../books/assets/js/books-utils.js');

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
});
