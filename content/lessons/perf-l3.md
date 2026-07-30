---
title: Performance Testing - Testes de Carga em APIs e App Servers
duration: 60 min
---

<h2>Testes de Carga: APIs e App Servers</h2>

<h3>Objetivos</h3>
<ul>
  <li>Modelar cenários de usuários reais (login, navegação, transações)</li>
  <li>Medir métricas chave: RPS, latência p50/p95/p99, erro por minuto</li>
  <li>Identificar gargalos (DB, CPU, GC, conexões)</li>
</ul>

<h3>Checklist de execução</h3>
<ul>
  <li>Definir baseline (sem cache, com cache).</li>
  <li>Monitorar infra (CPU, memory, threads, DB).</li>
  <li>Executar testes progressivos (soak, spike, ramp-up).</li>
</ul>

<h3>Cenário sugerido</h3>
<p>Simule um fluxo típico de API: login de usuário, consulta de dados e envio de uma transação simples. Isso ajuda a correlacionar picos de latência com chamadas específicas do backend.</p>

<h3>Exercício</h3>
<ol>
  <li>Execute um soak test de 1 hora com 50 VUs e registre as métricas de sistema.</li>
  <li>Analise os resultados e proponha 3 ações para mitigação.</li>
  <li>Compare a performance antes e depois de uma pequena otimização ou ajuste de cache.</li>
</ol>

<h3>Comandos de exemplo</h3>
<pre style="background:#f5f5f5; padding:1rem">
# k6 (HTTP API)
K6_VUS=50 K6_DURATION=1h BASE_URL="https://test-api.example.com" k6 run scripts/k6/basic-script.js

# JMeter (non-GUI)
jmeter -n -t scripts/jmeter/test-plan.jmx -l scripts/jmeter/results.jtl -JBASE_URL="https://test-api.example.com"
</pre>

<h3>Métricas esperadas e análise rápida</h3>
<ul>
  <li><strong>Throughput (RPS):</strong> compare com o objetivo declarado (ex.: 200 RPS).</li>
  <li><strong>Latência p95/p99:</strong> p95 < 500ms pode ser um bom objetivo para APIs simples.</li>
  <li><strong>Error rate:</strong> idealmente < 1%; se >1% investigue timeouts e erros 5xx.</li>
</ul>

<h3>Sample outputs</h3>
<p>Compare seus resultados com a amostra em <code>scripts/perf/examples/k6-summary-sample.json</code> e o exemplo de relatório JMeter em <code>scripts/perf/examples/jmeter-report-placeholder/index.html</code>.</p>

<h3>Why this matters</h3>
<p>API and app server performance issues often emerge from a combination of slow back-end operations, bad connection handling, or insufficient capacity. This lesson helps QA teams tie load-test metrics directly to engineering fixes.</p>

<h3>Resources</h3>
<ul>
  <li><a href="https://k6.io/docs/using-k6/scenarios/" target="_blank">k6 scenarios</a></li>
  <li><a href="https://jmeter.apache.org/usermanual/build-web-test-plan.html" target="_blank">JMeter Test Plan structure</a></li>
</ul>

<h3>Next steps</h3>
<ul>
  <li>Compare the test results with a baseline run and document any regressions.</li>
  <li>Share the key findings with developers and classify them by impact.</li>
  <li>Repeat the test after one optimization and compare the effect.</li>
</ul>
