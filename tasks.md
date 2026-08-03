# Backlog de Tarefas - Null and Void QA Course

Este arquivo serve como a fonte da verdade para o progresso do projeto, detalhando as melhorias de refatoração, qualidade de conteúdo, validação e preparação para o lançamento.

## 🚀 Próximos Passos para o Go-Live

 - [x] **Garantir a qualidade das lições mais críticas**
  - [x] Adicionar pelo menos 1 exercício prático com gabarito para cada uma das 10 lições amostradas em `reports/lesson-review.md`.
  - [x] Incluir metadados de revisão (data, autor, status) nos cabeçalhos dessas lições.
  - [x] Confirmar que a estrutura das lições segue os blocos esperados usando `node scripts/validate-lessons.js`.

## ✅ Concluído (resumo)

- 2026-08-03 — Adicionados gabaritos a 10 lições amostradas; inseridos metadados de revisão (`reviewedAt`, `reviewAuthor`, `reviewStatus`) nas lições afetadas; executada validação de estrutura com `node scripts/validate-lessons.js` (passou para 42 arquivos).


[ ] **Revisar e atualizar a experiência de certificado**
  - Adicionar export social-ready do certificado (imagem para LinkedIn) além do fluxo de PDF atual.
  - Incluir botão de download de imagem no modal de certificado.
  - Cobrir o comportamento com testes de regressão.

## 🛠️ Ajustes de Qualidade e Código

- [ ] **Refinar as responsabilidades de UI e renderização**
  - Finalizar a separação de helpers de renderização de `js/app.js` para `js/view-helpers.js` ou `js/lesson-renderers.js`.
  - Reduzir itens de DOM direto em `js/app.js` e centralizar estado onde fizer sentido.

- [ ] **Centralizar utilitários de DOM e armazenamento**
  - Mover helpers genéricos de DOM, JSON e `localStorage` para `js/utils.js`.

- [ ] **Organizar CSS para produção**
  - Revisar `css/styles.css` e agrupar por base, layout, componentes e utilitários.
  - Remover seletores obsoletos ou redundantes.

## 📄 Documentação e lançamento

- [x] **Atualizar README e fluxos de contribuição**
  - Incluir os novos comandos de validação e os passos de preparação para deploy.
  - Instruir como rodar `npm run validate:all`, `npm run validate:tracks`, `npm run validate:lessons` e `node scripts/sync-translations.js`.

- [ ] **Criar checklist final de go-live**
 - [ ] **Criar checklist final de go-live** (em andamento)
  - [ ] Validar estrutura das lições e gabaritos (`node scripts/validate-lessons.js` deve passar)
  - [ ] Confirmar traduções sincronizadas (`node scripts/sync-translations.js` deve reportar cobertura completa)
  - [ ] Rodar validações globais: `npm run validate:all` (tracks, lessons, i18n)
  - [ ] Executar testes: `npm test` — todas as suites devem passar
  - [ ] Lint e qualidade: `npm run lint:js` — nenhum erro crítico
  - [ ] Servir site localmente e smoke-test das páginas críticas (index, lições, certificado)
  - [ ] Verificar export de certificado (PDF e imagem social-ready) manualmente
  - [ ] Rodar verificador de links internos (ex: `linkinator` ou verificação manual)
  - [ ] Atualizar `README.md` / notas de release com comandos e mudanças importantes
  - [ ] Abrir PR com descrição, checklist e reviewers atribuídos
  - [ ] Após merge: monitorar CI e abrir issues para regressões detectadas


