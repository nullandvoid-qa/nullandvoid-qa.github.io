# Backlog de Tarefas - Null and Void QA Course

Este arquivo reúne as próximas ações prioritárias para manter o projeto saudável e evoluir com segurança.

## Status atual

A base já passou pela consolidação de conteúdo, estrutura e validação. O projeto está publicado, com deploy ativo e validação completa da suíte principal.

## Prioridade 1 — Acessibilidade e experiência

- [x] Avaliar a experiência em telas pequenas.

## Auditoria editorial — 2026-08-10

Escopo: 42 arquivos em `content/lessons/`, cobrindo estrutura, profundidade, exemplos executáveis, exercícios, gabaritos, metadados, referências e correspondência com o catálogo publicado.

Resultado: a validação estrutural atual passa e os 98 arquivos de conteúdo não possuem links internos quebrados. Ainda assim, a auditoria encontrou um risco funcional de catálogo e uma fila de revisões editoriais para elevar as aulas ao padrão de qualidade excelente.

## Prioridade 0 — Catálogo e entrega do conteúdo

- [x] **Criar auditoria automatizada:** `npm run audit:catalog` gera `reports/lesson-catalog-audit.json` e encontrou 24 inconsistências no catálogo runtime atual. O modo `npm run audit:catalog -- --check` já pode ser usado como gate depois da reconciliação.
- [x] **Preservar cursos mobile na mesclagem:** corrigido `js/app-tracks.js`, que substituía a trilha mobile inteira ao adicionar labs e removia aulas catalogadas como `l13`–`l27`.
- [x] **Priorizar Markdown no detalhe da aula:** corrigido `js/app-lesson.js` para carregar o conteúdo editorial antes do fallback inline, com regressão cobrindo catálogo antigo versus Markdown revisado.
- [x] **Reconciliação de IDs e títulos:** alinhados `data/tracks.js` e `data/performance-track.js` aos 42 arquivos editoriais; `l34` e `l35` publicados no curso de estratégia. `npm run audit:catalog` agora reporta 0 inconsistências.
- [x] **Definir fonte única de verdade:** o Markdown em `content/lessons/` é fonte editorial de título, duração e conteúdo; os dados de trilha definem organização, IDs e fallback inline.
- [x] **Adicionar teste de consistência do catálogo:** `npm run validate:catalog` executa o auditor em modo `--check` e foi incluído no `validate:all`.
- [ ] **Validar experiência publicada:** testar cada aula editorial pelo fluxo real de navegação, incluindo título, breadcrumb, conteúdo, idioma, quiz, próxima aula e persistência de progresso. Quatro aulas representativas (`l27`, `l34`, `l35`, `perf-l2`) já foram verificadas no browser.

## Prioridade 1 — Aulas curtas ou superficiais

Estas são as maiores lacunas por volume e densidade de prática. A métrica é um sinal de triagem, não um critério único de qualidade.

- [x] **Expandir `l29` — Teste Exploratório, Relato de Bug e Critérios de Aceitação** (574 palavras): incluir charter preenchido, sessão time-boxed com notas, bug report completo, severidade versus prioridade, hipótese de causa e gabarito com exemplos observáveis.
- [x] **Expandir `l30` — Pirâmide de Testes e Estratégias de Automação** (522 palavras): incluir anti-padrões, critérios para converter E2E em integração/contrato, matriz custo/risco, exemplo aplicado ao projeto e política de retries/flaky tests.
- [x] **Expandir `perf-l6` — Integração de CI e Observabilidade** (646 palavras): incluir workflow completo, thresholds, artefatos, retenção, correlação entre métricas k6 e infraestrutura, falha de gate e exercício executável.
- [x] **Expandir `perf-l2` — k6 e testes de API** (776 palavras): incluir cenário de API realista, checks de corpo/status, thresholds justificados, p50/p95/p99, dados de teste e interpretação de resultado.
- [x] **Expandir `perf-l3` — Carga em APIs e servidores** (790 palavras): incluir modelo de workload, mistura de endpoints, ramp-up, dependências, dados, critérios de parada e diagnóstico de banco/cache/pool.
- [x] **Expandir `perf-l7` — Análise e Mitigação** (799 palavras): incluir relatório antes/depois, árvore de diagnóstico, priorização por impacto, hipótese versus evidência e plano de remediação validável.

## Prioridade 1 — Revisão de aulas abaixo do padrão de profundidade

As aulas abaixo estão entre aproximadamente 800 e 1.200 palavras ou têm poucos artefatos práticos. Revisar depois das lacunas críticas acima.

- [ ] **Revisar `l17` — colaboração/revisão:** acrescentar caso de PR com risco, evidência de teste, feedback acionável e decisão de merge.
- [ ] **Revisar `l20` — pipeline/quality gate:** alinhar comandos e artefatos ao CI real do projeto, incluindo falhas, retries, logs e critérios de bloqueio.
- [ ] **Revisar `l25` — CI/CD para QA:** validar snippets contra o workflow real e separar claramente exemplo didático de comando realmente disponível.
- [ ] **Revisar `l27` — Pact:** confirmar a correspondência do ID no catálogo antes de considerar o conteúdo entregue; manter exemplo consumer/provider executável.
- [ ] **Revisar `l31` — exercícios de automação:** transformar o POM e o teste de integração em uma atividade verificável com arquivos, comandos e resultado esperado.
- [ ] **Revisar `l33` — cobertura/checklist/acessibilidade:** evitar sobreposição com `l35` e definir a progressão pedagógica entre as duas aulas.
- [ ] **Revisar `perf-l1`, `perf-l4` e `perf-l5`:** uniformizar objetivos, métricas, exemplos, thresholds e gabaritos com a sequência de performance.

## Prioridade 2 — Consistência editorial e pedagógica

- [ ] **Metadados de revisão:** adicionar `reviewedAt`, autor/revisor e status editorial às 21 aulas sem metadados de revisão (`l8`, `l12`–`l21`, `l29`, `l30`, `l33` e `perf-l1`–`perf-l7`). Só marcar como revisada após leitura humana e validação do conteúdo.
- [ ] **Heading hierarchy:** corrigir o segundo `<h2>` de `l25` para a hierarquia adequada e auditar todos os arquivos para garantir um único título principal e subtítulos sequenciais.
- [ ] **Padrão de aula excelente:** criar um checklist editorial comum contendo objetivo mensurável, contexto, conceito, exemplo aplicado, exercício executável, gabarito específico, critérios de aceite, recursos válidos e próxima etapa.
- [ ] **Exemplos executáveis:** para cada aula prática, indicar pré-requisitos, arquivos, comando, massa de dados, resultado esperado e como investigar falha; distinguir pseudocódigo de código pronto para execução.
- [ ] **Gabaritos verificáveis:** substituir respostas genéricas por saídas, decisões ou critérios concretos. Um gabarito deve permitir ao aluno comparar o próprio trabalho sem depender de interpretação do autor.
- [ ] **Progressão entre aulas:** mapear pré-requisitos e evitar repetição entre `l22`/`l30`, `l28`/`l34`, `l33`/`l35` e `l13`/`l14`/`l26`.
- [ ] **Terminologia e idioma:** padronizar PT-BR, termos em inglês, siglas, acentuação, capitalização e uso de “simulador”, “emulador” e “device real”.
- [ ] **Recursos externos:** revisar URLs, indicar versão/data quando necessário e oferecer alternativa local para conteúdo dependente de ferramenta, conta, macOS ou dispositivo físico.
- [ ] **Acessibilidade do conteúdo:** revisar tabelas, blocos de código, links externos, ordem de headings, textos alternativos e exemplos de mensagens para que as próprias aulas sigam as práticas ensinadas.

## Critérios de aceite para fechar uma revisão

- [ ] A aula possui objetivos observáveis e não apenas uma lista de conceitos.
- [ ] Existe pelo menos um cenário de negócio preenchido, com risco e decisão de teste.
- [ ] O exemplo principal pode ser executado ou tem instruções explícitas para reproduzi-lo.
- [ ] O exercício exige uma entrega verificável e o gabarito apresenta critérios ou resultado esperado.
- [ ] Os comandos, arquivos e links foram conferidos no repositório atual.
- [ ] O ID, título, duração, idioma, quiz e enrichment correspondem ao catálogo publicado.
- [ ] A aula passou por `npm run validate:lessons`, `npm run validate:links` e uma verificação de renderização no site.

## Próxima sequência recomendada

1. Validar no navegador as 42 aulas, incluindo título, conteúdo Markdown, idioma, quiz, próxima aula e persistência.
2. Expandir `l29`, `l30` e a sequência `perf-l2`/`perf-l3`/`perf-l6`/`perf-l7`.
3. Fazer a revisão de metadados, headings e terminologia em lote controlado.
4. Revalidar a experiência publicada e só então fechar os itens editoriais.

## Próximo foco

1. Limpar os pontos restantes de estabilidade observados em testes e execução.
2. Fortalecer a suíte E2E para cobrir os fluxos mais relevantes em produção.
3. Evoluir a experiência de acessibilidade e mobile sem comprometer a estabilidade do site.


