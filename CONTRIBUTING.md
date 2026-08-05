# Contributing Guide

Este documento centraliza o fluxo mínimo para contribuir com trilhas, aulas, certificados e ajustes de qualidade no projeto.

## Repositório e estrutura principal

- `data/tracks.js`: definição de trilhas, cursos e aulas.
- `data/translations-en.js`: textos de interface e labels de trilhas em inglês.
- `data/lesson-enrichment.js`: notas extras, contexto e enriquecimento de aulas.
- `data/quizzes.js`: quizzes e gabaritos.
- `js/certificates.js`: fluxo de geração e download de certificados.
- `certificate/template.html`: template HTML do certificado.
- `js/__tests__`: testes de regressão e utilitários.

## Fluxo recomendado para adicionar trilhas

1. Abra `data/tracks.js`.
2. Crie ou edite a trilha com os campos mínimos:
   - `id`
   - `slug`
   - `title`
   - `description`
   - `level`
   - `topics`
   - `courses`
3. Cada curso deve ter `id`, `title` e `lessons`.
4. Cada lição deve ter `id`, `title`, `duration`, `content` e, quando aplicável, `resources`.
5. Verifique se o curso fica consistente com as trilhas já existentes e com a navegação do site.

## Fluxo recomendado para adicionar aulas

1. Use o mesmo padrão dos objetos já presentes em `data/tracks.js`.
2. Mantenha o conteúdo em HTML estruturado e legível.
3. Adicione `resources` com links úteis.
4. Sempre inclua exercícios e, quando necessário, apoio de avaliação ou quiz.
5. Se a aula tiver enriquecimento adicional, atualize `data/lesson-enrichment.js`.

## Fluxo recomendado para adicionar certificados

1. Verifique a lógica em `js/certificates.js`.
2. Se o certificado precisar de ajuste visual, atualize `certificate/template.html`.
3. Confirme que a trilha concluída realmente dispara a emissão do certificado esperado.
4. Revise o texto do certificado em PT-BR e EN quando a regra de UI ou copy mudar.

## Traduções e labels

O projeto usa um sistema i18n em camadas. Sempre que criar ou modificar textos, siga estas regras:

### Arquivos de tradução

1. **`js/i18n.js`** — Dicionário principal de UI (PT + EN). Suporta ~180+ chaves.
2. **`data/translations-pt.json`** — Metadados de trilhas/cursos/aulas em PT-BR (120 chaves).
3. **`data/translations-en.json`** — Metadados de trilhas/cursos/aulas em EN (120 chaves).
4. **`data/translations-en.js`** — Overlay legado para compatibilidade.

### Como adicionar novas strings

- **Strings de UI**: adicione a chave em ambos `pt` e `en` dentro de `js/i18n.js`.
- **Metadados de trilha/curso/aula**: adicione a chave em ambos `translations-pt.json` e `translations-en.json`.
- Use chaves em dot-notation (ex: `track.starter.title`).
- Mantenha a estrutura hierárquica em `i18n.js` (ex: `nav.home`).

### Validação automática

Antes de abrir PR, execute:

```bash
# Start a local static server (Python 3):
python -m http.server 8000

# Run unit tests locally using npm/yarn (node + jest required):
npx jest

# Quick lint check (if you have eslint configured):
npx eslint . --ext .js,.html
```

### Desenvolvimento local

1. Serve the site locally for manual testing:

```bash
# from repository root
python -m http.server 8000
# then open http://localhost:8000/
```

2. If you change large assets (fonts, images), re-run service worker by unregistering it in the browser devtools or increment `CACHE_VERSION` in `js/service-worker.js`.

3. When updating styles or fonts, test both with JS enabled and disabled to ensure fallbacks work (`noscript`).


