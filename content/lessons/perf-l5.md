---
title: Performance Testing - Infra e Database
duration: 75 min
---

<h2>Performance: Infra e Database</h2>

<h3>Objetivos</h3>
<ul>
  <li>Identificar problemas de conexão ao banco, queries lentas e contensão</li>
  <li>Usar EXPLAIN, monitorar locks e métricas de DB</li>
  <li>Mapear ações para mitigar (index, cache, query rewrite)</li>
</ul>

<h3>Exercício</h3>
<ol>
  <li>Capture queries lentas durante um teste de carga e gere relatório com top-N queries.</li>
  <li>Proponha duas otimizações e justifique o impacto esperado.</li>
  <li>Use um `EXPLAIN ANALYZE` para priorizar a query mais custosa.</li>
</ol>

<h3>Ferramentas úteis</h3>
<ul>
  <li>Postgres: `pg_stat_statements`, `EXPLAIN ANALYZE`</li>
  <li>MySQL: `slow_query_log`, `EXPLAIN`</li>
  <li>Redis/memcached: medir hits/misses e latência</li>
</ul>

<h3>Exemplo rápido</h3>
<pre style="background:#f5f5f5; padding:1rem">
# Obter top slow queries (Postgres)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
</pre>

<h3>Sample outputs</h3>
<p>Exemplos de relatórios gerados pelo pipeline combinado estarão em <code>scripts/perf/examples/</code> após execução; compare com outputs reais gerados pelo laboratório.</p>

<h3>Why this matters</h3>
<p>Database and infrastructure bottlenecks are often the hidden cause of application slowdowns. QA should be able to translate load-test symptoms into actionable DB or infrastructure improvements.</p>

<h3>Resources</h3>
<ul>
  <li><a href="https://www.postgresql.org/docs/current/pgstatstatements.html" target="_blank">PostgreSQL pg_stat_statements</a></li>
  <li><a href="https://dev.mysql.com/doc/refman/en/slow-query-log.html" target="_blank">MySQL slow query log</a></li>
</ul>

<h3>Next steps</h3>
<ul>
  <li>Validate the test dataset and confirm the slow queries are reproducible.</li>
  <li>Propose at least one database optimization and one infrastructure change.</li>
  <li>Verify the improvement with a second load test and compare metrics.</li>
</ul>
