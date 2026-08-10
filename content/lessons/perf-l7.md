---
title: Testes de Performance - Análise e Mitigação
duration: 75 min
---

<h2>Testes de Performance - Análise e Mitigação</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Interpretar relatórios técnicos de testes de carga e priorizar ações corretivas.</li>
  <li>Criar runbooks práticos para mitigar falhas de lentidão e timeouts.</li>
  <li>Comunicar resultados de forma clara para stakeholders técnicos e gerenciais (negócios/produto).</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Executar testes de performance e coletar dados é apenas metade do caminho. O valor real de um QA sênior está na capacidade de analisar esses dados, traduzir métricas estatísticas em problemas reais de engenharia e propor um plano estruturado de mitigação de riscos para o time.</p>

<h3>📝 Relatórios de Carga Claros para Stakeholders</h3>
<p>Diferentes públicos precisam de diferentes níveis de detalhes. Desenvolvedores precisam de logs, latência de percentis altos e queries lentas. Gestores de produtos (POs/PMs) precisam saber se o sistema atende aos objetivos de negócio (passou/falhou no SLA).</p>

<h4>Exemplo de Resumo Executivo de Relatório de Carga</h4>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto; font-family:monospace">
Título: Relatório de Teste de Carga - Checkout E-commerce
Data de Execução: 2026-07-31
Resultado Geral: REPROVADO (Falha no SLA de Latência)

Métricas-Chave:
- Vazão Esperada: 200 RPS (Requisições por segundo)
- Vazão Atingida: 180 RPS
- Tempo Médio de Resposta: 210ms
- Latência Percentil 95 (p95): 620ms (SLA Máximo: 500ms - FALHOU)
- Taxa de Erro: 2.3% (SLA Máximo: 1% - FALHOU)

Principais Descobertas:
1. Saturação das conexões com o banco de dados (DB Pool) durante o ramp-up de usuários.
2. Lentidão excessiva na gravação física da rota `POST /checkout` devido à falta de indexação.

Recomendações Técnicas:
1. Criar índice composto na tabela de pedidos.
2. Habilitar cache do catálogo no Redis.
3. Aumentar o pool de conexões do banco de dados na aplicação.
</pre>

<h3>👥 Divisão de Responsabilidades no Time</h3>
<p>A melhoria da performance é um esforço conjunto:</p>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>QA:</strong> Executa simulações, consolida métricas, gera relatórios de anomalias e ajuda a identificar os limites do sistema.</li>
  <li><strong>Dev/Ops:</strong> Ajustam consultas SQL, configuram cache, redimensionam servidores e otimizam algoritmos de código.</li>
  <li><strong>Product Owner (PO):</strong> Prioriza as tarefas de mitigação de performance no backlog ágil com base no impacto de negócio e na experiência do usuário.</li>
</ul>

<h3>🌳 Árvore de Diagnóstico (Diagnostic Tree)</h3>
<p>Uma árvore de diagnóstico ajuda a convergir rapidamente de sintoma para causa raiz. Exemplo simplificado para latência alta:</p>
<ol>
  <li>Latência alta no endpoint `/api/catalog`?
    <ol>
      <li>Sim → verificar cache hit-rate
        <ul>
          <li>Cache hit-rate baixo → checar política de expiração e chave de cache</li>
          <li>Cache funcionando → ir para próxima verificação</li>
        </ul>
      </li>
      <li>Não → verificar DB
        <ul>
          <li>Queries lentas → executar EXPLAIN e revisar índices</li>
          <li>Pool esgotado → aumentar pool ou reduzir concorrência</li>
        </ul>
      </li>
    </ol>
  </li>
</ol>

<h3>⚖️ Priorização por Impacto</h3>
<p>Priorize mitigação com base em impacto no negócio e esforço estimado:</p>
<ul>
  <li><strong>Impacto Alto / Esforço Baixo:</strong> correções rápidas e com alto retorno (ex: adicionar índice, ajustar timeout) — tratar como P0.</li>
  <li><strong>Impacto Alto / Esforço Alto:</strong> refatorações ou arquitetura (ex: mudança de modelo de dados) — quebrar em milestones e tratar como P1 com entregas incrementais.</li>
  <li><strong>Impacto Baixo / Esforço Baixo:</strong> abordagens de melhoria contínua (ex: reduzir payloads) — P2.</li>
</ul>

<h3>🔬 Hipótese vs Evidência</h3>
<p>Cada hipótese de causalidade deve ser validada por evidência concreta antes de ser implementada:</p>
<ul>
  <li><strong>Hipótese:</strong> "A latência é causada por queries sem índice"</li>
  <li><strong>Evidência requerida:</strong> EXPLAIN mostrando full table scan; correlação temporal entre p95 e aumento de tempo de execução da query no slow log.</li>
  <li><strong>Validação pós-fix:</strong> rerun do teste com comparação antes/depois do p95 e monitoramento do slow log para confirmar redução.</li>
</ul>

<h3>🛠 Plano de Remediação Validável (Template)</h3>
<ol>
  <li>Descrição do problema: resumo breve e métricas que falharam (p95, taxa de erro, RPS).</li>
  <li>Hipótese técnica: causa provável.</li>
  <li>Ação proposta (curto prazo): passo acionável e de baixo custo (ex: adicionar índice X na tabela Y).</li>
  <li>Métrica de sucesso: critério objetivo para validar correção (ex: p95 reduzido para <400ms e taxa de erro <1%).</li>
  <li>Experimento de validação: instruções para executar o teste (script, cenário, duração) e como coletar artefatos.</li>
  <li>Pós-validação: relatar antes/depois com gráficos e anexar `k6-summary.json` e logs relevantes.</li>
</ol>

<h3>📄 Relatório Antes/Depois (Modelo)</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto; font-family:monospace">
Problema: p95 de /api/catalog = 800ms (SLA 400ms)

Antes:
- p95: 800ms
- p99: 1200ms
- Taxa de erro: 0.5%

Intervenção:
- Adicionar índice composto em `catalog.items(tenant_id, updated_at)`
- Ajustar TTL do cache para 60s

Depois:
- p95: 320ms
- p99: 410ms
- Taxa de erro: 0.1%

Conclusão: Intervenção validada. Criar PR com índice e instrumentar rollback caso métricas degradem em produção.
</pre>


<h3>⏭️ Próxima Aula</h3>
<p>Esta é a última aula do track de Performance; faremos uma revisão e exercícios práticos para consolidar os conceitos aprendidos.</p>
<h3>🔍 Amostras e Relatórios</h3>
<p>Você pode utilizar o template de relatório em <code>scripts/perf-report-template.md</code> e comparar com os dados de exemplo estruturados em <code>scripts/perf/examples</code> para estruturar sua própria documentação de testes.</p>

<h4>Checklist rápido para relatório de performance</h4>
<ul>
  <li>Resumo executivo com verdict claro: passou ou falhou contra o SLA.</li>
  <li>Métricas principais: RPS, latência p50/p95/p99 e taxa de erro.</li>
  <li>Top 3 endpoints lentos com evidência e timestamp.</li>
  <li>Recomendações técnicas priorizadas em curto, médio e longo prazo.</li>
</ul>

<h3>🔍 Por que isso importa</h3>
<p>Se as métricas e conclusões de performance não forem comunicadas de forma clara e o fluxo de correção não for planejado, os testes se tornam um desperdício de tempo. Saber documentar e mediar a resolução de gargalos de escalabilidade garante que a qualidade seja integrada como meta de toda a equipe.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Abra o template <code>scripts/perf/perf-report-template.md</code>.</li>
  <li>Imagine que seu teste de carga registrou latência de percentil 95 (p95) de 800ms na busca de catálogo, enquanto o SLA estabelecia 400ms.</li>
  <li>Escreva um relatório executivo curto baseado no cenário acima, preenchendo as métricas e sugerindo duas possíveis soluções práticas de otimização de banco ou cache.</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li><strong>Resumo executivo:</strong> o cenário deve indicar falha de SLA com p95 acima do limite esperado e impacto direto na experiência de navegação e compra.</li>
  <li><strong>Soluções práticas:</strong> adicionar índice ou reescrever a query de catálogo; usar cache de listagens em Redis ou cache de fragmento para reduzir leitura no banco.</li>
  <li><strong>Entregável esperado:</strong> o relatório deve resumir a falha, evidenciar a métrica crítica e apontar ações de mitigação em curto prazo com prioridade clara.</li>
</ul>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://blog.k6.io/share-performance-results/" target="_blank">Melhores Práticas para Compartilhar Resultados de Carga (k6 Blog)</a></li>
  <li><a href="https://www.atlassian.com/agile/retrospectives" target="_blank">Facilitando Retrospectivas Eficientes de Engenharia (Atlassian)</a></li>
</ul>
