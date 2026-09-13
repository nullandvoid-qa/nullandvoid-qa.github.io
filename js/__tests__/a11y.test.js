const fs = require('fs');
const path = require('path');

describe('Accessibility basics', () => {
  const root = path.join(__dirname, '..', '..');
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const lessonRendererSource = fs.readFileSync(path.join(root, 'js', 'lesson-renderers.js'), 'utf8');

  it('keeps an accessible search field and modal close button', () => {
    expect(indexHtml).toContain('for="global-search"');
    expect(indexHtml).toContain('aria-label="Buscar conteúdo"');
    expect(indexHtml).toContain('aria-label="Fechar painel de boas-vindas"');
    expect(indexHtml).toContain('class="sr-only"');
  });

  it('adds accessible labels and button types to dynamic lesson actions', () => {
    expect(lessonRendererSource).toContain('type="button"');
    expect(lessonRendererSource).toContain('id="btn-complete"');
    expect(lessonRendererSource).toContain('aria-label="${done ? t("lesson.unmarkComplete") : t("lesson.markComplete")}"');
  });
});
