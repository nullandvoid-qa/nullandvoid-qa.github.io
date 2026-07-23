# Tasks

Este arquivo é a única fonte de verdade para os próximos passos do projeto. Itens concluídos devem ser removidos para manter o contexto enxuto.

Não rode testes ou push pro github, faço isso manualmente.

## Estado atual
- A base de refatoração já foi estabilizada em torno de `js/app-storage.js`, `js/app-i18n.js`, `js/app-navigation.js` e `js/utils.js`.
- Os fluxos principais de progresso, importação e tradução já possuem cobertura de regressão.
- O próximo esforço é reduzir o acoplamento restante em `js/app.js` e manter a documentação alinhada com o código.

## Próximo passo
- [ ] Continuar refatorando `js/app.js` em módulos menores por responsabilidade
  - [ ] separar estado, renderização, roteamento e handlers
  - [ ] extrair helpers de renderização e composição de UI
    
- [ ] Consolidar utilitários compartilhados em `js/utils.js`
- [ ] Revisar `data/tracks.js` e `data/translations-en.js` para garantir consistência estrutural
- [ ] Organizar `css/styles.css` em seções claras e remover estilos duplicados
- [ ] Fortalecer a cobertura de testes para certificados, filtros e navegação
- [ ] Atualizar `docs/REFACTORING_CHECKLIST.md` conforme a refatoração avançar
- [ ] Documentar o fluxo de contribuição para adicionar trilhas, lições e certificados

- [ ] Documentar o fluxo de contribuição para adicionar trilhas, lições e certificados

- [ ] Garantir que as aulas sejam boas o suficiente para competir com cursos pagos
  - Critérios de aceite: definir checklist de qualidade (conteúdo, exercícios, avaliações); revisar 10 aulas amostrais; coletar feedback de 5 usuários beta; criar roadmap de melhorias.
  - Subtarefas:
    - [x] Definir checklist de qualidade (conteúdo, exercícios, avaliações)
    - [ ] Revisar 10 aulas amostrais
    - [x] Revisar 10 aulas amostrais
    - [ ] Coletar feedback de 5 usuários beta
    - [x] Priorizar correções e criar roadmap de melhorias
    - [x] Implementar exercícios + gabaritos nas 5 aulas prioritárias

- [ ] Garantir tradução PT-BR / EN cobrindo 100% do site
  - Critérios de aceite: extrair todas as strings para i18n; confirmar 100% das páginas traduzidas; revisão por revisores nativos para ambas línguas.
  - Subtarefas:
    - [x] Extrair todas as strings para i18n
    - [ ] Traduzir todas as páginas para PT-BR
    - [ ] Traduzir todas as páginas para EN
    - [ ] Revisão nativa PT-BR
    - [ ] Revisão nativa EN

- [ ] Garantir que todas as trilhas façam sentido e tenham conteúdo suficiente
  - Critérios de aceite: auditar `data/tracks.js` para learning outcomes; cada trilha deve ter mapa de competências e número mínimo de aulas (ex.: >=5 aulas); gerar plano de lacunas para trilhas curtas.
  - Subtarefas:
    - [x] Auditar `data/tracks.js` para learning outcomes
    - [x] Verificar número de aulas por trilha (min 5)
    - [x] Gerar plano de lacunas para trilhas curtas
    - [ ] Atualizar documentação de trilhas e exemplos (em andamento — veja `docs/TRACKS_UPDATE.md`)

## Regras de uso
- Ler este arquivo antes de iniciar qualquer nova tarefa.
- Atualizar a lista sempre que um item for concluído ou surgir um novo passo.
- Evitar reintroduzir itens já finalizados.

