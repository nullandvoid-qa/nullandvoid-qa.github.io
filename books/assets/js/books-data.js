(function (root, factory) {
  const exports = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = exports;
  } else {
    root.BooksData = exports;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizeBook(book) {
    const source = book && typeof book === 'object' ? book : {};
    const titulo = typeof source.titulo === 'string' && source.titulo.trim() ? source.titulo.trim() : (typeof source.title === 'string' ? source.title.trim() : '');
    const autor = typeof source.autor === 'string' && source.autor.trim() ? source.autor.trim() : (typeof source.author === 'string' ? source.author.trim() : '');
    const categoria = typeof source.categoria === 'string' && source.categoria.trim() ? source.categoria.trim() : (typeof source.category === 'string' ? source.category.trim() : 'Diversos');
    const tags = Array.isArray(source.tags) ? source.tags.map((item) => String(item).trim()).filter(Boolean) : [];
    const ano = Number.isFinite(Number(source.ano)) ? Number(source.ano) : new Date().getFullYear();
    const tempoLeitura = Number.isFinite(Number(source.tempoLeitura)) ? Number(source.tempoLeitura) : 0;
    const arquivo = typeof source.arquivo === 'string' && source.arquivo.trim() ? source.arquivo.trim() : (typeof source.file === 'string' ? source.file.trim() : '');

    return {
      id: source.id || `book-${String(Math.random()).slice(2, 10)}`,
      titulo,
      autor,
      descricao: typeof source.descricao === 'string' ? source.descricao : (typeof source.description === 'string' ? source.description : ''),
      categoria,
      tags,
      ano,
      tempoLeitura,
      capa: typeof source.capa === 'string' ? source.capa : (typeof source.cover === 'string' ? source.cover : ''),
      nivel: typeof source.nivel === 'string' && source.nivel.trim() ? source.nivel.trim() : 'beginner',
      arquivo,
      destacado: Boolean(source.destacado),
    };
  }

  function validateBook(book) {
    const issues = [];
    const normalized = normalizeBook(book);

    if (!normalized.id || String(normalized.id).trim() === '') {
      issues.push('id é obrigatório');
    }
    if (!normalized.titulo || String(normalized.titulo).trim() === '') {
      issues.push('titulo é obrigatório');
    }
    if (!normalized.autor || String(normalized.autor).trim() === '') {
      issues.push('autor é obrigatório');
    }
    if (!normalized.arquivo || String(normalized.arquivo).trim() === '') {
      issues.push('arquivo é obrigatório');
    }
    if (!normalized.categoria || String(normalized.categoria).trim() === '') {
      issues.push('categoria é obrigatória');
    }
    if (!Array.isArray(book?.tags) || book.tags.length === 0) {
      issues.push('tags é obrigatório');
    }
    if (!Number.isFinite(Number(book?.tempoLeitura)) || Number(book.tempoLeitura) <= 0) {
      issues.push('tempoLeitura deve ser maior que zero');
    }
    if (!Number.isFinite(Number(book?.ano)) || Number(book.ano) <= 0) {
      issues.push('ano é obrigatório');
    }

    return issues;
  }

  function normalizeBooks(books) {
    const list = Array.isArray(books) ? books : [];
    return list.map(normalizeBook);
  }

  return {
    normalizeBook,
    validateBook,
    normalizeBooks,
  };
});
