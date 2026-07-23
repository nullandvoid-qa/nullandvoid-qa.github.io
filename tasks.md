# Tasks

Este arquivo é a única fonte de verdade para os próximos passos do projeto. Itens concluídos devem ser removidos para manter o contexto enxuto.

## Importante — backlog de melhorias

### 1. Estabilizar a base do aplicativo
- [ ] Refatorar `js/app.js` em módulos menores por responsabilidade:
  - estado e roteamento
  - renderização de interface
  - handlers de lições e trilhas
  - helpers de storage
- [ ] Mover utilitários compartilhados para `js/utils.js`
- [ ] Remover código legado e branches mortos no fluxo principal
- [ ] Atualizar `js/auth.js` para manter a autenticação isolada e testável

### 2. Garantir consistência de dados e internacionalização
- [ ] Revisar `data/tracks.js` para garantir esquema consistente entre trilhas e cursos
- [x] Confirmar que todos os `trackId` usados no site têm tradução em `data/translations-en.js`
- [ ] Consolidar a lógica de tradução em `js/i18n.js` para evitar regras espalhadas
- [x] Garantir que certificados usem textos 100% em inglês para todas as trilhas
- [x] Adicionar regressão de payload de certificado em `js/__tests__/certificate-english.test.js`

### 3. Melhorar o CSS e layout
- [ ] Organizar `css/styles.css` em seções claras: base, layout, componentes, utilitários
- [ ] Remover estilos duplicados e hacks de página únicos
- [ ] Verificar responsividade móvel e corrigir quebras visuais no hero/dashboard
- [ ] Padronizar botões e cards para evitar regras visuais conflitantes

### 4. Fortalecer a qualidade de teste
- [x] Garantir que `jest` tenha suporte estável ao canvas em jsdom (polyfill no setup)
- [ ] Cobrir o fluxo de geração de certificado com testes de unidade e integração
- [ ] Adicionar testes para filtros de trilha, progresso e download de certificado
- [ ] Manter o `package.json` scripts claros e documentados para lint/test/e2e
- [x] Corrigir logout: após logout, o botão de login pode desaparecer; avaliar refresh da página para restaurar o UI.
- [x] Adicionar regressão de logout UI em `js/__tests__/logout-ui.test.js`

### 5. Melhorar documentação para futuros contribuidores
- [ ] Atualizar `docs/REFACTORING_CHECKLIST.md` com passos de implementação reais
- [x] Adicionar um guia rápido em `README.md` para rodar localmente e validar qualidade
- [ ] Documentar como adicionar novas trilhas, lições e certificados

## Ordem recomendada de execução
1. Refatorar `js/app.js` e extrair helpers para `js/utils.js`
2. Confirmar dados de trilha e tradução (`data/tracks.js`, `data/translations-en.js`)
3. Ajustar CSS e responsividade
4. Adicionar/testar comportamentos de certificado e auth
5. Atualizar docs e scripts de qualidade

## Regras de uso
- Ler este arquivo antes de iniciar qualquer nova tarefa.
- Atualizar a lista sempre que um item for concluído ou surgir um novo passo.
- Evitar reintroduzir itens já finalizados.

