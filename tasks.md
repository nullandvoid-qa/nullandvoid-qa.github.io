# Backlog de Tarefas - Null and Void QA Course

Este arquivo reúne as próximas ações prioritárias para manter o projeto saudável e evoluir com segurança.

## Status atual

A base já passou por uma consolidação importante de conteúdo, estrutura e módulos. O foco atual é restaurar a qualidade de manutenção da aplicação e, em seguida, seguir com melhorias incrementais.

## Prioridade 1 — Restaurar a base de manutenção

- [x] Remover blocos vazios, inconsistências de escopo e duplicidades que ainda impedem uma validação limpa.

## Prioridade 0 — Go live

- [x] Corrigir a falha atual de CI em `js/__tests__/app-init.test.js` e garantir que `npm run validate:all` passe sem erros.
- [x] Adicionar ou ativar o workflow de deploy para GitHub Pages em `.github/workflows`, com publicação automática do site.
- [x] Verificar a configuração de GitHub Pages / branch de publicação e documentar o fluxo de deploy.
- [x] Revisar estados de carregamento, erro e offline nas páginas de lições e conteúdo dinâmico para evitar experiência quebrada em produção.
- [ ] Fortalecer a cobertura E2E para os fluxos críticos de navegação, busca, certificados e fallback offline.
- [ ] Garantir que a acessibilidade e a navegação por teclado estejam consistentes na home, lições, certificados, menu e banner PWA.
  - [x] Reforçar fallback de teclado e ARIA para track cards (js/app-track.js)
- [ ] Corrigir warnings de lint/testes e eliminar consoles de aviso/erro ativos que aparecem durante a execução da suite.

## Prioridade 2 — Melhorias incrementais

- [x] Melhorar SEO e metadados sociais da home e páginas principais.
- [ ] Fortalecer acessibilidade e navegação por teclado.
- [ ] Reduzir ainda mais o acoplamento do bootstrap e padronizar o estado global.
- [ ] Melhorar tratamento de erros e estados de carregamento para aulas e conteúdo.
- [ ] Expandir a cobertura de testes e2e para fluxos críticos.

## Nota

Trabalhos já concluídos não precisam permanecer aqui; este arquivo deve refletir apenas o que ainda exige atenção.


