(function (root, factory) {
  'use strict';

  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.BooksData = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const DEFAULT_BOOK = Object.freeze({
    descricao: '',
    nivel: 'beginner',
    capa: '',
    destaque: false,
    destacado: false,
    tags: [],
  });

  function normalizeBook(book) {
    if (!book || typeof book !== 'object') {
      return { ...DEFAULT_BOOK, id: '', titulo: '', autor: '', ano: 0, categoria: '', tags: [], tempoLeitura: 15, arquivo: '', capa: '' };
    }

    return {
      id: String(book.id || '').trim(),
      titulo: String(book.titulo || '').trim(),
      autor: String(book.autor || '').trim(),
      ano: Number(book.ano) || 0,
      categoria: String(book.categoria || '').trim(),
      tags: Array.isArray(book.tags) ? book.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
      tempoLeitura: Number(book.tempoLeitura) || 15,
      arquivo: String(book.arquivo || '').trim(),
      capa: String(book.capa || '').trim(),
      descricao: String(book.descricao || '').trim(),
      nivel: String(book.nivel || 'beginner').trim() || 'beginner',
      destaque: Boolean(book.destaque ?? book.destacado),
      destacado: Boolean(book.destaque ?? book.destacado),
    };
  }

  function validateBook(book) {
    const normalized = normalizeBook(book);
    const issues = [];

    if (!normalized.titulo) issues.push('titulo is required');
    if (!normalized.autor) issues.push('autor is required');
    if (!normalized.categoria) issues.push('categoria is required');
    if (!normalized.arquivo) issues.push('arquivo is required');
    if (!normalized.tags.length) issues.push('tags should include at least one tag');
    if (!normalized.ano) issues.push('ano should be a valid year');
    if (!normalized.tempoLeitura) issues.push('tempoLeitura should be greater than zero');

    return issues;
  }

  function normalizeBooks(books) {
    if (!Array.isArray(books)) return [];
    return books.map(normalizeBook);
  }

  return { normalizeBook, validateBook, normalizeBooks };
});
