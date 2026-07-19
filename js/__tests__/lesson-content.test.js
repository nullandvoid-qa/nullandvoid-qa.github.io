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
});
