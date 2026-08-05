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

- [x] 3. Melhorar robustez do frontend
  - [x] Revisar fluxo de carregamento de lições e trilhas em cenários inesperados.

- [ ] 4. Reduzir acoplamento do bootstrap principal
  - [ ] Extrair mais lógica de [js/app.js](js/app.js) para módulos específicos.
  - [x] Padronizar inicialização e dependências entre módulos.

- [ ] 6. Melhorar performance e experiência offline
  - [x] Revisar cache do service worker e arquivos estáticos.
  - [x] Avaliar imagens, scripts e CSS para reduzir peso desnecessário.
  - [x] Confirmar comportamento útil quando o navegador estiver offline.

- [ ] 7. Completar conteúdo de apoio e exercícios
  - [ ] Priorizar aulas com maior impacto pedagógico.
  - [ ] Adicionar exercícios práticos e gabaritos onde ainda estiverem ausentes.
  - [ ] Revisar links de apoio e recursos extras por lição.

- [ ] 8. Fortalecer testes e2e
  - [ ] Cobrir fluxo de navegação principal, bookmarks e certificados.
  - [ ] Adicionar cenários de regressão para páginas críticas.
  - [ ] Manter testes automatizados alinhados com o comportamento real do usuário.

- [ ] 9. Revisar internacionalização e consistência editorial
  - [ ] Validar termos, rótulos e mensagens entre PT/EN.
  - [ ] Identificar strings hard-coded ainda não traduzidas.
  - [ ] Revisar consistência de tom e estilo do conteúdo.

- [ ] 10. Documentar e preparar manutenção contínua
  - [ ] Atualizar documentação de setup e contribuição.
  - [ ] Registrar decisões de arquitetura e padrões de implementação.
  - [ ] Definir um fluxo simples para próximas entregas.


