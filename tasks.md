# Backlog & Checklist de Tarefas — Null and Void QA Course

Este documento contém a análise completa do projeto **Null and Void QA Course** e a checklist detalhada de tarefas pendentes, priorizadas a partir das mudanças e atualizações mais críticas para a qualidade, estabilidade e experiência do aluno.

---

## 📊 Resumo Executivo da Análise

O projeto encontra-se em um nível avançado de maturidade técnica e de conteúdo. Abaixo o diagnóstico por pilares:

| Pilar | Status | Diagnóstico Principal |
| :--- | :---: | :--- |
| **Infraestrutura & Validação** | 🟢 OK | 42 lições validadas, catálogo sem inconsistências, 177 testes unitários Jest passando (100%). |
| **Higiene do Repositório** | 🔴 Crítico | Diversos arquivos temporários de teste, PDFs/PNGs de debug e logs soltos na raiz (`tmp-certificate.*`, `page-debug.html`, `quiz-*.json`, etc.). `.gitignore` desatualizado. |
| **Testes & Teardown** | 🟡 Atenção | Jest reporta aviso de vazamento de processos/timers ao finalizar a suíte de testes. |
| **Conteúdo Didático** | 🟡 Atenção | 11 lições curtas/conceituais necessitam de maior profundidade, cenários práticos e exemplos executáveis. |
| **Internacionalização (i18n)** | 🟢 OK / 🟡 | Sistema de i18n centralizado funcional (PT/EN), porém vocabulário técnico precisa de padronização editorial. |
| **Arquitetura de Código** | 🟡 Atenção | O arquivo `js/view-helpers.js` tem 72KB e acumula múltiplas responsabilidades de UI. |
| **PWA & Offline** | 🟢 OK | Service worker funcional, necessita apenas de auditoria final da lista de precache. |

---

## 🚨 Prioridade 1: Tarefas Críticas (Impacto Imediato na Estabilidade e Repositório)

- [x] **Limpeza e Higiene do Repositório Root**
  - [x] Remover arquivos temporários/debug soltos na raiz: `page-debug.html`, `tmp-certificate.pdf`, `tmp-certificate.png`, `tmp-en-snippet.txt`, `test-output-utf8.txt`, `test-output.txt`, `track-*.json`, `quiz-*.json`, `quiz-page.png`, `track-click-*.log`.
  - [x] Atualizar `.gitignore` para ignorar padrões de arquivos temporários (`tmp-*`, `*.pdf`, `quiz-*.json`, `track-*.json`, `playwright-report/`, `test-results/`).
  - [x] Criar script `npm run clean` em `package.json` para limpeza automatizada de artefatos de teste.

- [x] **Correção de Leak de Processos/Timers na Suíte Jest**
  - [x] Investigar com `npx jest --detectOpenHandles` a origem dos timers/handles não encerrados pós-teste.
  - [x] Adicionar teardown adequado (`afterEach` / `afterAll` limpando mocks, intervals e DOM handles em `js/__tests__/`).

- [x] **Correção de Falha em Teste E2E do Playwright**
  - [x] Corrigir o teste `persists bookmark and completion state after a full reload` em `tests/regression-coverage.spec.js:226`.
  - [x] Garantir que o estado de navegação (hash `#lesson/id` ou restauração de rota) permaneça no elemento `#btn-bookmark` após `page.reload()`.



---

## 🔥 Prioridade 2: Alta Prioridade (Qualidade do Conteúdo Didático e Vocabulário)

- [x] **Expansão e Aprofundamento das Lições Sucintas**
  - [x] **L22 — Testes de Regressão**: adicionar exemplo prático de matriz de regressão e estratégias de seleção de testes.
  - [x] **L23 — Testes de Usabilidade**: adicionar checklist prático de Heurísticas de Nielsen e exercício de avaliação.
  - [x] **L24 — Testes de Segurança**: detalhar top 5 OWASP com exemplos de payload de teste seguros.
  - [x] **L25 — Testes de Carga/Estresse**: expandir cenários k6/JMeter com métricas de tempo de resposta e percentis (p95/p99).
  - [x] **L26 — Testes de Integração**: adicionar diagrama de arquitetura e exemplos de stubs/mocks em chamadas HTTP.
  - [x] **L27 — Pact & Consumer-Driven Contracts**: validar alinhamento com o catálogo e garantir exemplo executável de contrato consumidor/provedor.
  - [x] **L28 — BDD & Cucumber**: incluir especificação de cenários Gherkin com bons vs maus padrões.
  - [x] **L30 — Mobile QA**: expandir com estratégias de locators para Android/iOS e comandos Appium.
  - [x] **L32 — CI/CD Pipelines**: incluir exemplo prático de pipeline GitHub Actions executando testes de QA.
  - [x] **L34 — Acessibilidade (a11y)**: incluir guia prático de teste com leitores de tela e ferramentas automáticas (axe/lighthouse).
  - [x] **L35 — Carreira & Checklist de Prontidão**: consolidar a transição entre introdução conceitual e prática de mercado.

- [x] **Padronização Editorial e Vocabulário Técnico (PT / EN)**
  - [x] Padronizar a escrita e aplicação de termos técnicos em inglês (*charter*, *pipeline*, *Page Object*, *E2E*, *shift-left*, *exploratory testing*, *smoke test*, *stub/mock*).
  - [x] Adicionar explicações didáticas no primeiro uso de cada termo técnico em português.

- [x] **Auditoria de Paridade i18n no Runtime**
  - [x] Verificar se todos os botões, banners, descrições de trilhas e quizzes alternam 100% de PT para EN sem fallbacks visíveis.

---

## ⚡ Prioridade 3: Média Prioridade (Arquitetura, PWA e Certificados)

- [ ] **Refatoração do Monolito `js/view-helpers.js`**
  - [ ] Analisar e separar funções auxiliares de UI em módulos menores de responsabilidade única (ex: renderização de cards, modais, quizzes).
  - [ ] Manter retrocompatibilidade total com a API global consumida pelos scripts da aplicação.

- [ ] **Validação do Fluxo de Certificados & Exportação PDF**
  - [ ] Testar exportação de certificado via jsPDF/html2canvas em resoluções mobile e desktop.
  - [ ] Confirmar se o QR Code gerado direciona para `verify.html` com os parâmetros de validação corretos.

- [ ] **Auditoria de PWA & Service Worker**
  - [ ] Verificar se a lista de precache em `js/service-worker.js` inclui todos os arquivos estáticos essenciais para funcionamento offline 100% sem erros 404 no console.

---

## 🌱 Prioridade 4: Baixa Prioridade (Polimento Visual, SEO e Acessibilidade)

- [ ] **Polimento Visual & Contraste A11y**
  - [ ] Verificar taxa de contraste dos elementos no modo escuro (dark mode).
  - [ ] Garantir `aria-label` e `role` em botões dinâmicos (bookmark, conclusão de aula, modais).

- [ ] **Verificação de Links Externos e Recursos**
  - [ ] Executar e validar `npm run validate:links` para garantir que nenhum link ou referência externa esteja quebrado.

---

## 📋 Critérios de Aceite para Cada Tarefa

Para considerar uma tarefa concluída:
1. Os testes de validação (`npm run validate:all`) devem passar com 0 erros.
2. O conteúdo ou código alterado deve ser testado visualmente ou via testes unitários/E2E.
3. Nenhuma regressão nas funcionalidades de navegação, troca de idioma ou quizzes.
