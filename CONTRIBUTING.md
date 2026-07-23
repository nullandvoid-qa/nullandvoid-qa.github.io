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

- Sempre que criar uma nova string de UI, atualize também `data/translations-en.js`.
- Quando a string for usada em rótulos de status, progresso ou CTA, mantenha a chave coerente com `js/app-i18n.js`, `js/i18n.js` e `js/utils.js`.
- Para fallbacks legíveis, prefira labels de texto humano em vez de expor a chave bruta do dicionário.

## Validação antes do PR

Execute ao menos:

```bash
npm test
npm run lint
npm run validate:tracks
```

Se a mudança for de UI ou navegação, também vale revisar:

```bash
npm run test:e2e
```

## Checklist mínimo de PR

- [ ] Trilha atualizada em `data/tracks.js`
- [ ] Traduções revisadas em `data/translations-en.js`
- [ ] Conteúdo de lição consistente com o padrão esperado
- [ ] Quizzes ou enriquecimentos atualizados quando necessários
- [ ] Certificados ou templates revisados, se o fluxo mudou
- [ ] Testes e lint executados com sucesso

## Boas práticas

- Preferir mudanças pequenas e bem descritas.
- Manter o documento de tarefas alinhado com o estado real.
- Não reintroduzir itens já finalizados.
- Antes de abrir PR, confirme se a mudança está reproduzível, testada e documentada.
