const fs = require('fs');
const path = require('path');

describe('Accessibility basics', () => {
  const root = path.join(__dirname, '..', '..');
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  it('keeps an accessible search field and modal close button', () => {
    expect(indexHtml).toContain('for="global-search"');
    expect(indexHtml).toContain('aria-label="Buscar conteúdo"');
    expect(indexHtml).toContain('aria-label="Fechar painel de boas-vindas"');
    expect(indexHtml).toContain('class="sr-only"');
  });
});
