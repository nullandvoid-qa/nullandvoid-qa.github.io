---
title: Testes de Performance - Testes de Carga em APIs e Servidores de Aplicação
duration: 60 min
---

<h2>Testes de Carga: APIs e Servidores de Aplicação</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Modelar cenários de usuários reais (login, navegação, transações e checkout).</li>
  <li>Medir métricas de desempenho essenciais: RPS (requisições por segundo), latências (p50/p95/p99) e taxa de erro por minuto.</li>
  <li>Identificar gargalos de infraestrutura clássicos (banco de dados, CPU, Garbage Collector e exaustão de conexões).</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Testar a performance do backend (APIs e servidores de aplicação) exige modelagem realista. Um teste que dispara apenas requisições idênticas contra um único endpoint não simula a realidade de produção. Devemos planejar jornadas de usuários completas que misturem leituras e escritas para estressar todas as camadas da aplicação (banco de dados, cache, integradores de pagamento e processadores de fila).</p>

<h3>📋 Checklist de Execução de Testes</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Definir Baseline:</strong> Execute um teste com carga reduzida para documentar a performance normal com e sem o uso de cache.</li>
  <li><strong>Monitorar Infraestrutura:</strong> Acompanhe o consumo de CPU, memória RAM, filas de conexão de threads e comportamento do banco de dados.</li>
  <li><strong>Estratégia de Rampa (Ramp-up/Ramp-down):</strong> Suba o número de usuários gradativamente para ver o ponto exato onde a performance começa a degradar.</li>
</ul>

<h3>💡 Cenário Sugerido de Negócio</h3>
<p>Para obter métricas relevantes, simule um fluxo transacional comum: o usuário faz a autenticação, pesquisa um item, adiciona ao carrinho e finaliza o pedido. Isso permite analisar se operações pesadas (como geração de boletos ou gravação no banco) estão bloqueando requisições leves de leitura.</p>

<h3>💻 Comandos e Scripts de Exemplo</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
# k6: Executando teste de carga de API com parâmetros de ambiente
K6_VUS=50 K6_DURATION=1h BASE_URL="https://jsonplaceholder.typicode.com" k6 run scripts/k6/basic-script.js

# Apache JMeter: Executando teste sem interface gráfica (GUI)
jmeter -n -t scripts/jmeter/test-plan.jmx -l scripts/jmeter/results.jtl -JBASE_URL="https://jsonplaceholder.typicode.com"
</pre>

<h3>📈 Métricas Esperadas e Análise de Gargalos</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Vazão (RPS):</strong> Compare o volume de requisições processadas com as metas estabelecidas (ex: suportar 200 compras/segundo).</li>
  <li><strong>Latência p95/p99:</strong> 95% ou 99% das respostas dos usuários devem retornar abaixo do limite acordado (ex: latência p95 < 500ms).</li>
  <li><strong>Taxa de Erro:</strong> Monitorar taxas de erros acima de 1%. Erros 5xx geralmente apontam para falhas internas do servidor, e erros 408 indicam timeouts.</li>
</ul>

<h3>🔍 Amostras de Outputs</h3>
<p>Você pode comparar suas métricas locais de latência e RPS com a amostra em <code>scripts/perf/examples/k6-summary-sample.json</code> ou ver o modelo de relatório HTML do JMeter em <code>scripts/perf/examples/jmeter-report-placeholder/index.html</code>.</p>

<h3>🏛️ Por que isso importa?</h3>
<p>Os gargalos em APIs e servidores de aplicação geralmente surgem de uma combinação de consultas de banco lentas, gerenciamento ineficiente de conexões (pool esgotado) ou falta de CPU. Compreender estes problemas ajuda o time de QA a sugerir melhorias diretamente no código ou na arquitetura, em vez de apenas reportar que "o sistema caiu".</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Execute um teste k6 local de 2 minutos simulando 30 usuários virtuais.</li>
  <li>Monitore a latência média e a latência de percentil 95 (p95).</li>
  <li>Proponha duas hipóteses de melhoria de código caso a latência p95 ultrapasse 1 segundo (ex: adicionar cache na rota de listagem ou paginação nas queries).</li>
</ol>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://k6.io/docs/using-k6/scenarios/" target="_blank">Criação de Cenários e Workloads no k6</a></li>
  <li><a href="https://jmeter.apache.org/usermanual/build-web-test-plan.html" target="_blank">Construindo planos de teste de API no JMeter</a></li>
</ul>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos abordar <strong>Testes de Performance - Frontend e Realidade de Dispositivos Reais</strong>.</p>
