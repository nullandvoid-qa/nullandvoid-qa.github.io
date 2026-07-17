/**
 * Performance Testing Track — Arena de Carga
 * Complete performance testing curriculum with K6 & JMeter
 */

window.TG_PERFORMANCE_TRACK = {
  id: "performance",
  slug: "performance-testing",
  title: "📊 Arena de Carga",
  icon: "📊",
  color: "#f59e0b",
  description: "Domine testes de performance: load testing, stress testing, profiling e otimização com K6, JMeter e ferramentas reais.",
  level: "Sênior",
  topics: ["Load Testing", "K6", "JMeter", "Performance Analysis", "SLAs"],
  courses: [
    {
      id: "c-perf-1",
      title: "Fundamentos de Performance Testing",
      lessons: [
        {
          id: "perf-l1",
          title: "Por que Performance Importa",
          duration: "40 min",
          content: "<h3>O Custo Real</h3><p>Cada segundo que sua app demora = usuários deixam. Dados:</p><ul><li>1 seg delay → 7% perda de conversão</li><li>3 seg delay → 40% de bounce</li><li>Página lenta no mobile → 50% deixam antes de abrir</li></ul><h3>Exemplos Reais</h3><ul><li><strong>Amazon:</strong> 100ms de delay = 1% perda de vendas</li><li><strong>Google:</strong> Adicionou 0.5sec ao search = tráfego caiu 20%</li><li><strong>Walmart:</strong> Melhorou load time em 1sec = conversão +2%</li></ul><h3>Performance Testing = Prevenção</h3><p>Testa antes que usuários reais sofram.</p><h3>Tipos de Teste</h3><ul><li><strong>Load Test:</strong> Comportamento normal (1000 usuários)</li><li><strong>Stress Test:</strong> Quebra o sistema (10000 usuários)</li><li><strong>Endurance Test:</strong> Longo prazo (8 horas de tráfego)</li><li><strong>Spike Test:</strong> Pico súbito (1000 → 10000 usuários instant)</li><li><strong>Soak Test:</strong> Vazamento de memória (roda 24h)</li></ul><h3>SLA = Service Level Agreement</h3><p>Seu compromisso: 'Página carrega em &lt;2sec com &lt;1% erro'. Performance testing valida SLA.</p>",
          resources: [
            { label: "Performance Testing Guide", url: "https://www.perfmatrix.com/performance-testing/" },
            { label: "Google: Web Performance", url: "https://web.dev/performance/" }
          ]
        },
        {
          id: "perf-l2",
          title: "Load, Stress e Endurance Testing",
          duration: "45 min",
          content: "<h3>Load Test: Sob Carga Normal</h3><p>Simula carga esperada: 'Página carrega &lt;2sec com 1000 usuários simultâneos?'</p><h3>Stress Test: Até o Limite</h3><p>Aumenta carga até quebrar: 'Quando explode? Em 5000? 10000?'</p><h3>Endurance Test: Resistência</h3><p>Testa por horas: 'Memory leak? Performance degrada over time?'</p><h3>Spike Test: Pico Súbito</h3><p>Traffic jump: Black Friday de 100 para 10000 users em segundos. Sistema aguenta?</p><h3>Exemplo Real: E-commerce Black Friday</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>Load Test: 5000 usuários simultâneos → esperado\nStress Test: aumenta até 50000 → encontra breaking point\nSpike Test: 100 → 10000 em 10 segundos → falha?\nEndurance: roda 8 horas → memory saudável?</pre>",
          resources: []
        },
        {
          id: "perf-l3",
          title: "Métricas: Latência, Throughput, Taxa de Erro",
          duration: "40 min",
          content: "<h3>Latência (Response Time)</h3><p>Quanto tempo leva para responder?</p><ul><li>Min: melhor caso</li><li>Max: pior caso</li><li>P95: 95% das respostas abaixo deste valor</li><li>P99: 99% abaixo (mede outliers)</li></ul><h3>Throughput (RPS — Requests Per Second)</h3><p>Quantas requisições por segundo?</p><p>Exemplo: API aguenta 500 RPS? Depois degrada?</p><h3>Taxa de Erro</h3><p>% de requisições que falham.</p><p>Esperado: &lt;1%. Se 2%, problema.</p><h3>Exemplo de Relatório</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>Load Test Results:\nThroughput: 1500 RPS\nLatência média: 150ms\nP95: 300ms\nP99: 800ms\nTaxa de erro: 0.5%\n\nVeredito: ✓ OK (dentro de SLA: &lt;2sec, &lt;1% erro)
",
          resources: []
        }
      ]
    },
    {
      id: "c-perf-2",
      title: "K6: Load Testing Moderno",
      lessons: [
        {
          id: "perf-l4",
          title: "K6 Basics: Seu Primeiro Script",
          duration: "45 min",
          content: "<h3>O que é K6?</h3><p>K6 = ferramenta de performance testing com scripting em JavaScript. Leve, rápida, moderna.</p><h3>Por que K6?</h3><ul><li>✓ JavaScript (fácil para QA)</li><li>✓ Rápido (escrita clara)</li><li>✓ Cloud-ready (K6 Cloud)</li><li>✓ Open source</li></ul><h3>Instalação</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'># macOS\nbrew install k6\n\n# Linux\napt-get install k6\n\n# Verify\nk6 version</pre><h3>Seu Primeiro Script</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>import http from 'k6/http';\nimport { check } from 'k6';\n\nexport const options = {\n  vus: 10,          // 10 virtual users\n  duration: '30s',  // por 30 segundos\n};\n\nexport default function() {\n  const res = http.get('https://httpbin.org/delay/1');\n  check(res, {\n    'status is 200': (r) => r.status === 200,\n    'latency < 2s': (r) => r.timings.duration < 2000,\n  });\n}</pre><h3>Rodando</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>k6 run script.js</pre><h3>Output Esperado</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>✓ status is 200: 300/300\n✓ latency < 2s: 300/300\nHTTP 200: 300/300 (100%)\n\nResultado: PASSOU</pre>",
          resources: [
            { label: "K6 Official Docs", url: "https://k6.io/docs/" },
            { label: "K6 Script Examples", url: "https://k6.io/docs/examples/" }
          ]
        },
        {
          id: "perf-l5",
          title: "Load Test Real: Simulando Black Friday",
          duration: "50 min",
          content: "<h3>Cenário: E-commerce Black Friday</h3><p>Você precisa testar se seu checkout aguenta Black Friday.</p><h3>Script K6 Realista</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>import http from 'k6/http';\nimport { check, sleep } from 'k6';\n\nexport const options = {\n  stages: [\n    { duration: '2m', target: 100 },   // ramp-up\n    { duration: '5m', target: 100 },   // steady\n    { duration: '2m', target: 200 },   // spike\n    { duration: '5m', target: 200 },   // steady\n    { duration: '2m', target: 0 },     // ramp-down\n  ],\n  thresholds: {\n    'http_req_duration': ['p(95)<2000'], // P95 < 2sec\n    'http_req_failed': ['<0.01'],       // < 1% error\n  }\n};\n\nexport default function() {\n  // 1. Acessa homepage\n  http.get('https://seu-ecommerce.com/');\n  sleep(1);\n  \n  // 2. Clica em produto\n  let res = http.get('https://seu-ecommerce.com/products/123');\n  check(res, { 'product loads': (r) => r.status === 200 });\n  sleep(2);\n  \n  // 3. Adiciona ao carrinho\n  res = http.post('https://seu-ecommerce.com/api/cart', {\n    product_id: 123,\n    qty: 1\n  });\n  check(res, { 'add to cart: 200': (r) => r.status === 200 });\n  sleep(1);\n  \n  // 4. Vai para checkout\n  res = http.get('https://seu-ecommerce.com/checkout');\n  check(res, { 'checkout loads': (r) => r.status === 200 });\n}</pre><h3>Rodando</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>k6 run black-friday.js</pre><h3>Analisando Resultado</h3><p>Se P95 > 2sec ou error > 1%: FALHA. Precisa otimizar infraestrutura.</p>",
          resources: []
        }
      ]
    },
    {
      id: "c-perf-3",
      title: "JMeter: Teste Distribuído em Escala",
      lessons: [
        {
          id: "perf-l6",
          title: "JMeter Basics: GUI e Componentes",
          duration: "45 min",
          content: "<h3>O que é JMeter?</h3><p>JMeter = ferramenta Apache para testes de carga distribuídos. Mais robusta que K6 para testes MUITO grandes.</p><h3>Estrutura Básica</h3><ul><li><strong>Test Plan:</strong> Container tudo</li><li><strong>Thread Group:</strong> Usuários simultâneos</li><li><strong>Samplers:</strong> HTTP Request, JDBC, etc</li><li><strong>Listeners:</strong> Resultados (gráficos, tabelas)</li><li><strong>Assertions:</strong> Validações</li></ul><h3>Setup Básico</h3><p>1. Download JMeter de apache.org<br/>2. Abra jmeter.bat (Windows) ou jmeter.sh (Mac/Linux)<br/>3. Crie Test Plan</p><h3>Adicionar Thread Group</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>Test Plan\n└── Thread Group (Number of Threads: 100, Ramp-up: 60s, Duration: 300s)
",
          resources: [
            { label: "JMeter Official", url: "https://jmeter.apache.org/" },
            { label: "JMeter Tutorial", url: "https://www.perfmatrix.com/jmeter-tutorial/" }
          ]
        },
        {
          id: "perf-l7",
          title: "Monitoramento e Análise de Resultados",
          duration: "45 min",
          content: "<h3>Listeners: Vendo Resultados</h3><ul><li><strong>Summary Report:</strong> Resumo rápido (recomendado)</li><li><strong>View Results Tree:</strong> Cada requisição (muito dados)</li><li><strong>Graph Results:</strong> Gráfico de latência over time</li><li><strong>Response Time Graph:</strong> Visualiza P95, P99</li></ul><h3>Analisando Relatório</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>Label    | # Samples | Avg  | Min  | Max  | Error %\n---------|-----------|------|------|------|--------\nlogin    | 1000      | 250ms| 100ms| 800ms| 0%\ncheckout | 1000      | 1500ms| 500ms| 3000ms| 2%\nproduct  | 1000      | 300ms| 50ms | 2000ms| 0%\n\nProblema: checkout está lento (1500ms avg, 3000ms max)
",
          resources: []
        }
      ]
    }
  ]
};

// ===== K6 EXAMPLE SCRIPTS =====
window.TG_K6_SCRIPTS = [
  {
    id: "k6-simple",
    name: "Teste Simples — 10 usuários",
    code: `import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  const res = http.get('https://httpbin.org/get');
  check(res, {
    'status 200': (r) => r.status === 200,
  });
}`
  },
  {
    id: "k6-rampup",
    name: "Ramp-up Test — Carga gradual",
    code: `import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};

export default function() {
  http.get('https://httpbin.org/delay/1');
}`
  },
  {
    id: "k6-post",
    name: "POST Request — API Testing",
    code: `import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 20,
  duration: '1m',
};

export default function() {
  const payload = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com'
  });
  
  const res = http.post('https://httpbin.org/post', payload);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}`
  }
];
