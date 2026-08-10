---
title: Testes de Performance - Testes de Carga em APIs e Servidores de Aplicação
duration: 60 min
---

<h2>Testes de Performance - Testes de Carga em APIs e Servidores de Aplicação</h2>

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

<h3>🧩 Modelagem de Workload e Mix de Endpoints</h3>
<p>Modele a carga com base em jornadas reais. Uma boa prática é definir um mix de endpoints (porcentagem/ peso) que reflita tráfego de produção:</p>
<ul>
  <li>Exemplo de mix: 60% leitura de listagens (`GET /api/lessons`), 30% leitura de detalhe (`GET /api/lessons/:id`), 8% ações de escrita leve (`POST /api/bookmarks`), 2% transações pesadas (`POST /api/checkout`).</li>
  <li>Use pesos e seleção aleatória de IDs para evitar hotspots artificiais; no k6 isso é feito com `Math.random()` ou com o utilitário `__ITER`/`__VU` para escolher IDs distintos.</li>
</ul>

<h3>📈 Ramp-up / Stages recomendados</h3>
<p>Evite subir carga instantaneamente. Use stages para observar comportamento em transições:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
export let options = {
  stages: [
    { duration: '2m', target: 20 }, // aquecimento
    { duration: '5m', target: 100 }, // aumento gradual até carga alvo
    { duration: '10m', target: 100 }, // sustentação
    { duration: '2m', target: 0 }, // ramp-down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration{p95}': ['p(95)<500'],
  }
};
</pre>

<h3>⛔ Critérios de parada / abort</h3>
<ul>
  <li>Abortar e investigar se a taxa de erro exceder 5% por mais de 1 minuto.</li>
  <li>Abortar se a latência p99 exceder 5× o threshold definido (sinal de sistema degradado).</li>
  <li>Use health-checks entre stages para garantir sistema responsivo antes de aumentar carga.</li>
</ul>

<h3>🔧 Diagnóstico de Gargalos (onde olhar primeiro)</h3>
<ol>
  <li><strong>Banco de dados:</strong> consulte slow query log, verifique índices, examine locks e tempo de execução das queries; identifique queries com alta variação de latência.</li>
  <li><strong>Pool de conexões:</strong> confirme contadores de conexões ativas versus limite; pools exauridos causam filas e timeouts.</li>
  <li><strong>CPU e GC:</strong> picos de CPU ou pausas do GC podem elevar p99; correlacione timestamps do teste com métricas de APM e métricas do host.</li>
  <li><strong>Cache:</strong> cache-misses em rota de leitura podem aumentar latência dramaticamente; cheque hit-rate do Redis/Memcached.</li>
  <li><strong>Dependências externas:</strong> serviços terceiros podem degradar a cadeia; use mocks para isolar ou monitorar latências das integrações.</li>
</ol>

<h3>🔗 Correlacione com APM e Logs</h3>
<p>Para diagnóstico efetivo, injete um header `X-Request-Id` gerado pelo k6 em cada requisição. Use esse ID para localizar traces no APM e linhas relevantes nos logs. Registrar timestamps precisos no teste e emparelhar com métricas do APM acelera a investigação.</p>

<h3>🧾 Exemplo de roteiro de investigação após falha</h3>
<ol>
  <li>Confirmar que a falha é reproduzível: repetir o teste com mesmo cenário e verificar erro.</li>
  <li>Coletar evidências: HAR/netlogs, métricas de host (CPU/RAM), métricas do DB (slow queries), logs de aplicação com requestId.</li>
  <li>Isolar camada: reduzir mix para apenas leitura para ver se problema é ligado à escrita/lock.</li>
  <li>Executar perfil/trace no ambiente (APM/pprof) para identificar função ou query causadora.</li>
  <li>Documentar hipótese, aplicar mitigação (cache, index, ajuste de pool) e re-testar baseline.</li>
</ol>


<h3>🔍 Amostras de Outputs</h3>
<p>Você pode comparar suas métricas locais de latência e RPS com a amostra em <code>scripts/perf/examples/k6-summary-sample.json</code> ou ver o modelo de relatório HTML do JMeter em <code>scripts/perf/examples/jmeter-report-placeholder/index.html</code>.</p>

<h3>🔍 Por que isso importa</h3>
<p>Os gargalos em APIs e servidores de aplicação geralmente surgem de uma combinação de consultas de banco lentas, gerenciamento ineficiente de conexões (pool esgotado) ou falta de CPU. Compreender estes problemas ajuda o time de QA a sugerir melhorias diretamente no código ou na arquitetura, em vez de apenas reportar que "o sistema caiu".</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Execute um teste k6 local de 2 minutos simulando 30 usuários virtuais.</li>
  <li>Monitore a latência média e a latência de percentil 95 (p95).</li>
  <li>Proponha duas hipóteses de melhoria de código caso a latência p95 ultrapasse 1 segundo (ex: adicionar cache na rota de listagem ou paginação nas queries).</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li><strong>Execução esperada:</strong> um cenário simples com `vus: 30` e `duration: '2m'` deve mostrar latência média e p95 em console/relatório.</li>
  <li><strong>Interpretação:</strong> se p95 ultrapassar 1s, isso sugere gargalo real de API, banco ou rendering secundário; o resultado precisa ser contextualizado com a jornada de usuário crítica.</li>
  <li><strong>Hipóteses de melhoria:</strong> cache de listagens, paginação nas consultas, reduzir payloads e evitar joins pesados em rotas sem necessidade.</li>
</ul>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://k6.io/docs/using-k6/scenarios/" target="_blank">Criação de Cenários e Workloads no k6</a></li>
  <li><a href="https://jmeter.apache.org/usermanual/build-web-test-plan.html" target="_blank">Construindo planos de teste de API no JMeter</a></li>
</ul>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos abordar <strong>Testes de Performance - Frontend e Realidade de Dispositivos Reais</strong>.</p>
