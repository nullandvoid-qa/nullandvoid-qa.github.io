const { normalizeBook, validateBook, normalizeBooks } = require('../../books/assets/js/books-data.js');

describe('books data helpers', () => {
  it('normalizes missing optional metadata with safe defaults', () => {
    const normalized = normalizeBook({
      id: 'new-book',
      titulo: 'Novo Livro',
      autor: 'Autor',
      ano: 2024,
      categoria: 'Produtividade',
      tags: ['teste'],
      tempoLeitura: 15,
      arquivo: 'resumos/novo-livro.md',
    });

    expect(normalized.descricao).toBe('');
    expect(normalized.nivel).toBe('beginner');
    expect(normalized.capa).toBe('');
    expect(normalized.destacado).toBe(false);
  });

  it('reports invalid required fields', () => {
    const issues = validateBook({
      id: 'bad-book',
      titulo: '',
      autor: '',
      ano: '2024',
      categoria: 'Produtividade',
      tags: [],
      tempoLeitura: 0,
      arquivo: '',
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.stringContaining('titulo'),
      expect.stringContaining('autor'),
      expect.stringContaining('arquivo'),
    ]));
  });

  it('normalizes an entire catalog array', () => {
    const normalized = normalizeBooks([
      {
        id: 'book-1',
        titulo: 'Book One',
        autor: 'Author',
        ano: 2024,
        categoria: 'Produtividade',
        tags: ['tag'],
        tempoLeitura: 15,
        arquivo: 'resumos/book-1.md',
      },
    ]);

    expect(normalized).toHaveLength(1);
    expect(normalized[0].id).toBe('book-1');
  });
});
