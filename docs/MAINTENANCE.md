# Manutenção e processo de entrega — Null and Void QA Course

Pequeno registro para facilitar manutenção e próximas entregas.

## Decisões de arquitetura (resumo)
- Estado global centralizado em `window.NVApp` com `ensureGlobalNVApp()` para evitar inicializações duplicadas.
- Service Worker: cache orientado por versão, evitar cache de requisições não-GET e servir `offline.html` para navegação quando necessário.
- Testes: usar Jest para unidade e Playwright para e2e; manter scripts `npm run test` e `npx playwright test` no `package.json`.

## Fluxo mínimo para novas entregas
1. Criar branch com nome `feat/<descrição>`.
2. Implementar mudanças pequenas e rodar testes locais:
   - `npm test`
   - `npx playwright test tests/e2e`
3. Atualizar `tasks.md` removendo itens concluídos e escrever um breve changelog no PR.
4. Abrir PR, pedir 1 revisão e aprovar após checks passarem.
5. Fazer merge e criar tag semântica opcional.

## Pontos a manter atualizados
- Lista de decisões (esta file) quando houver mudanças relevantes de arquitetura.
- Instruções de execução em `CONTRIBUTING.md`.
- Checklist de pré-merge em `tasks.md`.

