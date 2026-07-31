# Lessons Review (Revisão de Aulas)

Este documento fornece uma avaliação honesta e detalhada de cada lição do curso sob `content/lessons`, alinhada com o roadmap de QA para 2026. O objetivo principal é guiar a evolução do conteúdo para consolidar o **melhor curso gratuito de QA do mundo**.

## Score Legend (Legenda de Notas)
- **5/5**: Excelente cobertura, exemplos práticos claros e alinhados com o mercado real.
- **4/5**: Conteúdo muito bom, necessitando apenas de pequenos ajustes ou exemplos mais práticos.
- **3/5**: Conteúdo sólido, mas com lacunas de estruturação ou falta de cenários reais.
- **2/5**: Cobertura muito básica, dependente de outras fontes ou com grandes lacunas técnicas.
- **1/5**: Conteúdo insuficiente ou ausência de módulo obrigatório.

## Status Atual
O curso evoluiu bastante com a inclusão de módulos técnicos (Git, SQL, API, CI/CD e IA aplicada a QA). O foco agora deve ser a **padronização visual/pedagógica, enriquecimento prático com APIs/dados reais, tradução/expansão do módulo de performance e criação de uma base de lógica de programação**.

---

## 1. Base (Fundamentos de QA e Agile)
- **Score**: 4.5/5
- **Strengths**:
  - As lições `l1` a `l10` e `l12` entregam um núcleo teórico excelente sobre prevenção, shift-left, ciclo de vida de testes e técnicas clássicas de caixa-preta.
  - Explica muito bem a atuação do QA em rituais Agile e a relação com engenharia de requisitos.
- **Improvements**:
  - **Padronização Visual (Cabeçalhos)**: Algumas lições usam emojis nos títulos principais e secundários (ex: `🎯 Objetivos de Aprendizado` na `l10` e `l12`) enquanto outras não usam (`l1`, `l2`, `l17` a `l21`). É necessário padronizar a identidade de títulos em todo o curso.
  - **Checklists de Rituais**: As lições de Agile (`l3`, `l7` e `l12`) devem fornecer um checklist executável contendo a exata atuação prática do QA em cada cerimônia (Planning, Daily, Review, Retrospective).
  - **Exemplos de Ferramentas de Mercado**: Mencionar e integrar imagens/contexto de ferramentas comuns de gestão de testes como JIRA, TestRail ou Xray no conteúdo principal, para que o estudante se sinta familiarizado com o ambiente corporativo.
  - **Construção de Tabela de Decisão**: Na lição `l5`, a explicação sobre tabelas de decisão pode ganhar um exemplo avançado passo a passo, mostrando a redução de regras e como preencher os resultados para múltiplas condições.

## 2. Testes Manuais e Exploratórios
- **Score**: 4/5
- **Strengths**:
  - `l4` e `l6` tratam os testes manuais com dignidade, deixando claro que não são inferiores à automação, mas complementares.
  - A aula de testes exploratórios é muito forte ao diferenciar a abordagem estruturada do teste "ad-hoc".
- **Improvements**:
  - **Dados de Mercado 2026**: Adicionar uma seção detalhando a relevância de testes manuais e exploratórios em vagas reais de 2026 (cerca de 35% das tarefas diárias ainda são manuais para novos fluxos), reduzindo a ansiedade do iniciante em relação à automação imediata.
  - **Templates de Artefatos**: Disponibilizar um modelo em Markdown de **Caso de Teste** e **Reporte de Bug** direto no texto, permitindo ao aluno copiar e colar em seus exercícios.
  - **SBTM (Session-Based Test Management)**: Em `l6` (Teste Exploratório), introduzir formalmente o conceito de SBTM e dar um exemplo prático de um *Test Charter* (Carta de Teste) e um relatório de sessão executada.

## 3. Testes de API
- **Score**: 4/5
- **Strengths**:
  - A lição `l19.md` cobre Postman, REST Assured e Playwright APIRequest.
  - Explica muito bem os conceitos de contract testing e validação de schema.
- **Improvements**:
  - **API Real vs. Domínio Falso**: Atualmente a lição usa `https://api.exemplo.com/v1/pedidos/123`. Para que os exercícios sejam executáveis, devemos migrar os exemplos para usar uma API pública e gratuita como JSONPlaceholder (`https://jsonplaceholder.typicode.com`) ou ReqRes (`https://reqres.in`).
  - **Cards de Referência HTTP**: Fornecer um guia rápido contendo os métodos HTTP (GET, POST, PUT, DELETE, PATCH) e as famílias de status codes (1xx a 5xx) com suas respectivas finalidades.
  - **Postman Collection para Download**: Incluir um link para um arquivo JSON ou workspace público do Postman com a coleção de testes descrita na aula, permitindo a importação imediata.

## 4. SQL / Banco de Dados
- **Score**: 4/5
- **Strengths**:
  - `l18.md` foca no SQL voltado para o cotidiano do QA (SELECT, JOIN, GROUP BY), mostrando como cruzar dados do frontend com o banco.
- **Improvements**:
  - **Falta de Schema Visual**: As queries usam tabelas como `usuarios` e `transacoes` mas o aluno não consegue ver a estrutura dessas tabelas. Adicionar uma visualização em formato de tabela Markdown mostrando as colunas, tipos e dados fictícios dessas duas tabelas.
  - **Segurança e Boas Práticas**: Ensinar práticas recomendadas para o dia a dia do QA em produção ou homologação, como o uso obrigatório de `LIMIT`, execução em bases de réplica (Read-Only) e cuidados extremos ao rodar comandos destrutivos como `UPDATE` ou `DELETE` (uso do `WHERE` e transações).

## 5. Automação de Testes (Web e Mobile)
- **Score**: 4/5
- **Strengths**:
  - A matriz de ferramentas em `l11` ajuda o aluno a entender o papel de cada framework.
  - A cobertura de plataformas de nuvem e emuladores móveis (`l13` a `l16`) é bem abrangente.
- **Improvements**:
  - **Comparativo de Código Lado a Lado**: Em `l11`, adicionar um exemplo comparativo prático (ex: teste de login simples) escrito em **Playwright (TypeScript)** de um lado e **Selenium (Java)** do outro, evidenciando as diferenças de verbosidade e APIs.
  - **Foco em Execução Local**: Nas lições de BrowserStack (`l15`) e SauceLabs (`l16`), deixar claro que são plataformas premium pagas e que o estudante deve focar primeiro em executar seus testes localmente antes de usar créditos ou recursos de cloud.
  - **Comparativo de Cypress, Playwright, Selenium e Appium**: Estruturar uma tabela comparativa com arquitetura, pontos fortes, desvantagens e stack recomendada.

## 6. Linguagens de Programação e POO para QA
- **Score**: 2/5
- **Strengths**:
  - O curso cita linguagens como TypeScript, Java e Python ao longo das lições de automação.
- **Improvements**:
  - **Ausência de Módulo de Lógica e POO**: Falta uma lição focada especificamente nos fundamentos de programação aplicados a testes.
  - **Criação de lição dedicada (ex: `l22.md`)**: Abordar conceitos de Programação Orientada a Objetos (POO) estruturados para automação de testes, ensinando como utilizar Classes, Objetos, Herança (ex: herdar métodos de uma classe `BasePage`) e Encapsulamento, contendo exemplos curtos em JavaScript/TypeScript e Python.

## 7. CI/CD para QA
- **Score**: 4/5
- **Strengths**:
  - `l20.md` introduz conceitos de pipelines, GitHub Actions e Jenkins de forma clara e conectada com testes de API e regressão.
- **Improvements**:
  - **Depuração de Erros no Pipeline**: Explicar na lição o que fazer quando um teste falha no CI/CD. Mostrar como inspecionar logs de erro, baixar os artefatos de build (ex: relatórios HTML do Playwright ou JUnit XML) e depurar localmente.
  - **Notificações e Alertas**: Mostrar um exemplo de configuração de notificação em canais de comunicação do time (Slack/Teams/e-mail) para alertar sobre falhas em execuções agendadas de regressivos.

## 8. Testes de Performance
- **Score**: 3/5
- **Strengths**:
  - As lições `perf-l1` a `perf-l7` cobrem de forma sequencial o uso do JMeter, k6, testes em infraestrutura, frontend e banco.
- **Improvements**:
  - **Tradução e Consistência de Linguagem**: Muitas explicações usam termos mesclados em inglês e português (Portu-inglês). Todo o texto deve ser traduzido e adaptado integralmente para o português brasileiro.
  - **Profundidade Teórica (Sizing & Tipos)**: As lições são excessivamente curtas. Expandir `perf-l1` para explicar com clareza as diferenças entre os tipos de testes de performance (Carga, Estresse, Pico/Spike e Resistência/Endurance) usando analogias e diagramas explicativos.
  - **SLAs e Thresholds no CI**: Mostrar como declarar limites de aceitação de tempo de resposta e erro (SLAs) nos scripts do k6 para automatizar o bloqueio de deploys falhos no pipeline de CI/CD.

## 9. Testes Mobile
- **Score**: 4/5
- **Strengths**:
  - Ensina o setup e uso prático de emuladores locais (Android e iOS).
- **Improvements**:
  - **Emuladores vs. Simuladores vs. Dispositivos Reais**: Criar uma seção curta detalhando a diferença técnica entre simuladores (iOS), emuladores (Android) e dispositivos físicos, incluindo prós, contras e custos.
  - **Guia de Troubleshooting Móvel**: Adicionar soluções rápidas para erros clássicos que iniciantes encontram no setup (virtualização desabilitada na BIOS, caminhos inválidos da variável `ANDROID_HOME`, erros do HAXM no Windows).

## 10. QA + Inteligência Artificial (IA)
- **Score**: 4/5
- **Strengths**:
  - A lição `l21.md` orienta o uso da IA de forma crítica como um co-piloto, definindo bem seus limites.
- **Improvements**:
  - **Biblioteca de Prompts Práticos**: Adicionar prompts prontos estruturados e testados para tarefas diárias:
    1. Prompt para extrair casos de teste de uma User Story vaga.
    2. Prompt para reescrever um bug report confuso em linguagem técnica e objetiva.
    3. Prompt para sugerir dados de teste e cenários de exceção para uma API específica.
  - **Privacidade e Segurança de Dados**: Enfatizar a proibição ética e corporativa de colar chaves de API, códigos de produção sensíveis ou dados reais de clientes (PII) em ferramentas de IA públicas.

---

## Estrutura Recomendada de Trilha Pedagógica
Para alcançar o nível de **Melhor Curso de QA do Mundo**, a trilha deve guiar o aluno de forma fluida:

1. **Fase 1: Fundamentos & Raciocínio de Teste** (l1 a l6) - O que é QA, papéis, processos, design de teste (equivalência/limites), testes exploratórios.
2. **Fase 2: QA Ágil e Comunicação** (l7 a l10, l12) - Cerimônias, Three Amigos, critérios de aceitação, matriz de riscos, DoD.
3. **Fase 3: Ferramental Técnico de Apoio** (l17, l18) - Git básico para QA, SQL para consulta e validação de dados.
4. **Fase 4: Testes de API** (l19) - Protocolo HTTP, Postman (manual/automático), REST Assured / Playwright API.
5. **Fase 5: Lógica e Automação Web/Mobile** (l11, l13 a l16, l22) - Lógica/POO voltada para QA, frameworks de automação (Playwright/Selenium), testes mobile e cloud.
6. **Fase 6: DevOps e Performance** (l20, perf-l1 a perf-l7) - CI/CD, pipelines e testes de performance (JMeter/k6).
7. **Fase 7: O Futuro do QA** (l21) - IA e LLMs aplicados ao cotidiano do QA.

---

## Plano de Ação Imediato para Desenvolvimento
1. **Padronizar cabeçalhos**: Realizar uma varredura nas lições `l1` a `l21` e nas lições `perf-*` para unificar os títulos usando emojis consistentes (ex: `🎯 Objetivos de Aprendizado`, `📝 Exercício Prático`, `📚 Recursos`).
2. **Traduzir e expandir lições de Performance**: Realizar a tradução das lições `perf-l1` a `perf-l7` para o português e adicionar a seção de tipos de testes de carga.
