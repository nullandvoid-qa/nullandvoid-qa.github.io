# Tasks

Este arquivo é a única fonte de verdade para os próximos passos do projeto. Itens concluídos devem ser removidos para manter o contexto enxuto.

Não rode testes ou push pro github, faço isso manualmente.

## Estado atual
- A base de refatoração já foi estabilizada em torno de `js/app-storage.js`, `js/app-i18n.js`, `js/app-navigation.js`, `js/app-lesson.js`, `js/app-dashboard.js` e `js/utils.js`.
- Os fluxos principais de progresso, importação, dashboard, aulas e tradução já possuem cobertura de regressão.
- A trilha mobile já foi integrada em `data/tracks.js` e `data/translations-en.js`, com apoio de conteúdo e documentação de referência em `docs/TRACKS_UPDATE.md`.
- O acoplamento principal de renderização foi reduzido em `js/app.js`, que agora concentra estado, roteamento e bindings globais, enquanto `js/app-lesson.js` e `js/app-dashboard.js` assumem os fluxos específicos de UI.
- O alinhamento de fallbacks de i18n e o suporte a labels legíveis já foram consolidados em `js/app-i18n.js`, `js/i18n.js` e `js/utils.js`, com cobertura em `js/__tests__/utils-translate.test.js`.
- A regressão de compatibilidade do helper global `window.t` foi corrigida em `js/app-i18n.js` e validada com a suíte de testes atual, que agora está verde: 18 suites e 93 testes aprovados.
- O feedback beta já foi coletado e consolidado em `reports/beta-feedback.json` e `reports/beta-feedback-summary.json`, com 5 respostas registradas e resumo quantitativo disponível.
- O próximo esforço é fechar as lacunas restantes de qualidade, documentação e contribuição sem reabrir itens já concluídos.
- A folha de estilos foi parcialmente organizada para reduzir duplicidade visual e reforçar a legibilidade das seções relevantes de autenticação e botões.

## Próximo passo
- [ ] Garantir tradução PT-BR / EN cobrindo 100% do site
  - Critérios de aceite: extrair todas as strings para i18n; confirmar 100% das páginas traduzidas; revisão por revisores nativos para ambas línguas.
  - Subtarefas:
    - [ ] Traduzir todas as páginas para PT-BR
    - [ ] Traduzir todas as páginas para EN
    - [ ] Revisão nativa PT-BR
    - [ ] Revisão nativa EN

## Regras de uso
- Ler este arquivo antes de iniciar qualquer nova tarefa.
- Atualizar a lista sempre que um item for concluído ou surgir um novo passo.
- Evitar reintroduzir itens já finalizados.

