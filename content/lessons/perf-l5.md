---
title: Testes de Performance - Infraestrutura e Banco de Dados
duration: 75 min
---

<h2>Performance: Infraestrutura e Banco de Dados</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Identificar gargalos associados a consultas lentas (slow queries), falta de índices ou problemas de concorrência de conexões.</li>
  <li>Interpretar planos de execução de banco de dados usando `EXPLAIN` ou `EXPLAIN ANALYZE`.</li>
  <li>Definir planos de ação básicos para mitigar gargalos (indexação, cacheamento, reescrita de consultas e pools de conexão).</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Na maioria das vezes, o limite de escalabilidade de um sistema está no banco de dados. Servidores de aplicação podem ser criados dinamicamente em múltiplos contêineres, mas o banco de dados geralmente centraliza a gravação física dos dados. Queries ineficientes sem índices adequados ou tabelas com locks prolongados degradam o tempo de resposta geral e podem paralisar todo o sistema durante testes de carga.</p>

<h3>🔍 Identificando Queries Lentas</h3>
<p>Os principais bancos de dados possuem ferramentas internas para gravar consultas que demoram mais do que um limite tolerável para o negócio (ex: queries acima de 1 segundo). No PostgreSQL, a extensão <code>pg_stat_statements</code> rastreia as estatísticas das consultas mais pesadas acumuladas.</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
-- Exemplo: Consultar as 10 queries mais lentas por tempo total de execução (PostgreSQL)
SELECT query, calls, total_exec_time, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
</pre>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos ver <strong>Testes de Performance - Integração de CI e Observabilidade</strong>.</p>

<h3>🛠️ EXPLAIN e EXPLAIN ANALYZE</h3>
<p>Para otimizar uma query lenta, você deve entender como o banco está buscando a informação. Prefixar a consulta com o comando `EXPLAIN` faz o banco exibir o plano de execução planejado, revelando se ele fez uma busca sequencial completa na tabela (Seq Scan) ou se utilizou um índice eficiente (Index Scan).</p>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><code>EXPLAIN SELECT * FROM usuarios WHERE email = 'teste@email.com';</code>: Mostra o plano teórico e o custo estimado.</li>
  <li><code>EXPLAIN ANALYZE SELECT * FROM usuarios WHERE email = 'teste@email.com';</code>: Executa a query de verdade e traz os dados reais de tempo gasto. ⚠️ <em>Cuidado: execute apenas queries seguras de leitura com ANALYZE.</em></li>
</ul>

<h3>📋 Estratégias de Mitigação de Gargalos</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Criação de Índices:</strong> Garante buscas rápidas por chaves de busca comuns (ex: emails, CPFs, códigos de pedido).</li>
  <li><strong>Pool de Conexões:</strong> Gerenciadores de conexões (como PgBouncer para Postgres) evitam a criação/destruição constante de conexões que consomem muita CPU do banco.</li>
  <li><strong>Uso de Caches:</strong> Bancos de chave-valor em memória (como Redis) salvam resultados de queries pesadas e repetitivas (como menus ou listagens estáticas) diminuindo as requisições no banco relacional.</li>
</ul>

<h3>💻 Exemplo e outputs de Exercícios</h3>
<p>Outputs de exemplo gerados pelo pipeline de testes e relatórios de slow queries estão disponíveis em <code>scripts/perf/examples/</code>. Compare o consumo de conexões simultâneas locais com os benchmarks.</p>

<h3>🏛️ Por que isso importa?</h3>
<p>A instabilidade e degradação de performance reportada nos testes de carga quase sempre têm raiz na infraestrutura ou no banco de dados. Um QA apto a inspecionar consultas lentas e sugerir planos de ação técnicos de banco acelera a resolução de falhas e contribui ativamente no refinamento da arquitetura do time.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Imagine uma tabela <code>transacoes</code> com 5 milhões de linhas e sem nenhum índice. Uma consulta busca registros filtrando por <code>status = 'processada'</code> e demora 8 segundos.</li>
  <li>Escreva o comando SQL necessário para criar um índice nessa coluna (ex: <code>CREATE INDEX idx_transacoes_status...</code>).</li>
  <li>Explique qual seria o impacto dessa mudança no plano de execução (Seq Scan vs. Index Scan).</li>
</ol>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank">Entendendo Planos de Execução (EXPLAIN) no PostgreSQL</a></li>
  <li><a href="https://dev.mysql.com/doc/refman/8.0/en/explain.html" target="_blank">Otimização de Consultas com EXPLAIN no MySQL</a></li>
</ul>
