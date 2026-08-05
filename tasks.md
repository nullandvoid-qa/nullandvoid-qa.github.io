# Backlog de Tarefas - Null and Void QA Course

Este arquivo resume as melhorias prioritárias para continuar o projeto de forma incremental e segura.

## 🔎 Análise geral do projeto

O projeto está em um bom estado geral de base técnica:
- A suíte de testes está verde: 27/27 suites e 123/123 testes passaram no último run.
- O lint está limpo para JavaScript, CSS e HTML.
- A estrutura já é bastante rica em conteúdo, módulos e documentação, o que dá boa base para evolução.

Os principais pontos de melhoria identificados são:
- Melhorar SEO e metadados sociais para a home e páginas principais.
- Fortalecer acessibilidade e navegação por teclado.
- Reduzir ainda mais o acoplamento do bootstrap principal e padronizar o estado global.
- Melhorar tratamento de erros e estados de carregamento para conteúdo e aulas.
- Completar conteúdo de apoio e exercícios nas aulas prioritárias.
- Aumentar a cobertura de testes e2e para fluxos críticos.

## ✅ Checklist priorizada para execução incremental

- [ ] 4. Reduzir acoplamento do bootstrap principal
  - [x] Remover chamadas duplicadas de inicialização global (`ensureGlobalNVApp`) em `js/app.js`.
  - [x] Extrair `ensureGlobalNVApp` para `js/app-bootstrap-helpers.js` e delegar em `js/app.js`.
  - [x] Delegar `mergeTrackSources` para `js/app-tracks.js` e simplificar o fallback em `js/app.js`.
  - [ ] Extrair mais lógica de [js/app.js](js/app.js) para módulos específicos.

- [ ] 7. Completar conteúdo de apoio e exercícios
  - [ ] Priorizar aulas com maior impacto pedagógico.
  - [ ] Adicionar exercícios práticos e gabaritos onde ainda estiverem ausentes.
  - [ ] Revisar links de apoio e recursos extras por lição.

- [ ] 8. Fortalecer testes e2e
  - [x] Adicionar cenários de regressão para páginas críticas (bookmark flow)
  - [ ] Manter testes automatizados alinhados com o comportamento real do usuário.

- [ ] 9. Revisar internacionalização e consistência editorial
  - [x] Validar termos, rótulos e mensagens entre PT/EN.
  - [x] Identificar strings hard-coded ainda não traduzidas. (report at `docs/HARDCODED_STRINGS_REPORT.md`)
  - [ ] Revisar consistência de tom e estilo do conteúdo.
  - [x] Extrair strings inline do `js/service-worker.js` para i18n (adicionadas chaves em `data/translations-pt.json`).

Documentation moved to [docs/MAINTENANCE.md](docs/MAINTENANCE.md)


