describe('lesson content loader', () => {
  test('uses inline lesson content when no markdown source exists', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const content = await loadLessonContent(
      { id: 'l1', content: '<p>inline content</p>' },
      { fetchImpl: async () => { throw new Error('missing file'); } },
    );

    expect(content.content).toBe('<p>inline content</p>');
  });

  test('loads markdown content from a mapped path and converts it to html', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Nova aula
duration: 10 min
---

# Hello

This is **bold** and a [link](https://example.com).
`;

    const result = await loadLessonContent(
      { id: 'l1' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
        markdownMap: { l1: '/content/lessons/l1.md' },
      },
    );

    expect(result.content).toContain('<h1>Hello</h1>');
    expect(result.content).toContain('<strong>bold</strong>');
    expect(result.content).toContain('<a href="https://example.com"');
    expect(result.title).toBe('Nova aula');
    expect(result.duration).toBe('10 min');
  });

  test('discovers markdown content from the default lesson path when no map exists', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Aula descoberta
duration: 8 min
---

# Descoberta
`;

    const result = await loadLessonContent(
      { id: 'l2' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.title).toBe('Aula descoberta');
    expect(result.duration).toBe('8 min');
    expect(result.content).toContain('<h1>Descoberta</h1>');
  });

  test('preserves raw html content stored in markdown files', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Aula HTML
duration: 12 min
---

<h2>Conteúdo em HTML</h2>
<p>Este texto deve permanecer intacto.</p>
`;

    const result = await loadLessonContent(
      { id: 'l3' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.content).toContain('<h2>Conteúdo em HTML</h2>');
    expect(result.content).toContain('Este texto deve permanecer intacto.');
  });

  test('loads the new programming and POO lesson from markdown', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Lógica de Programação e POO para QA
duration: 60 min
---

# POO para QA
`;

    const result = await loadLessonContent(
      { id: 'l22' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.title).toBe('Lógica de Programação e POO para QA');
    expect(result.duration).toBe('60 min');
    expect(result.content).toContain('<h1>POO para QA</h1>');
  });

  test('loads the new practical automation lesson from markdown', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Exercícios Práticos — Automação e Critérios de Aceite
duration: 60 min
---

# Exercícios Práticos
`;

    const result = await loadLessonContent(
      { id: 'l31' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.title).toBe('Exercícios Práticos — Automação e Critérios de Aceite');
    expect(result.duration).toBe('60 min');
    expect(result.content).toContain('<h1>Exercícios Práticos</h1>');
  });

  test('loads the new market coverage and contract lesson from markdown', async () => {
    const { loadLessonContent } = require('../lesson-content.js');

    const markdown = `---
title: Cobertura de Mercado, Risco e Contratos de API
duration: 55 min
---

# Cobertura e contratos
`;

    const result = await loadLessonContent(
      { id: 'l34' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.title).toBe('Cobertura de Mercado, Risco e Contratos de API');
    expect(result.duration).toBe('55 min');
    expect(result.content).toContain('<h1>Cobertura e contratos</h1>');
  });

  test('recognizes additional lesson markdown files by default path', async () => {
    const { loadLessonContent, resolveMarkdownPath } = require('../lesson-content.js');

    expect(resolveMarkdownPath('l30')).toBe('/content/lessons/l30.md');
    expect(resolveMarkdownPath('l35')).toBe('/content/lessons/l35.md');

    const markdown = `---
title: Fundamentos de teste de performance
duration: 50 min
---

# Performance Fundamentals
`;

    const result = await loadLessonContent(
      { id: 'l30' },
      {
        fetchImpl: async () => ({
          ok: true,
          text: async () => markdown,
        }),
      },
    );

    expect(result.title).toBe('Fundamentos de teste de performance');
    expect(result.duration).toBe('50 min');
    expect(result.content).toContain('<h1>Performance Fundamentals</h1>');
  });
});
