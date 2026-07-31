---
title: Performance Testing - Introdução e JMeter
duration: 75 min
---

<h2>Performance Testing — Introdução</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Entender os conceitos fundamentais de performance: vazão (throughput), latência, concorrência e SLA.</li>
  <li>Conhecer os principais tipos de testes de performance (Carga, Estresse, Pico e Resistência).</li>
  <li>Configurar e executar um teste de carga simples usando o Apache JMeter em modo linha de comando (CLI).</li>
  <li>Interpretar relatórios HTML de resultados e identificar gargalos iniciais de desempenho.</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Testes de performance medem como o sistema se comporta sob carga e estresse. Não basta validar se uma funcionalidade funciona (funcional); é preciso saber se ela é rápida e estável quando centenas de usuários a acessam simultaneamente. O Apache JMeter é uma das ferramentas mais maduras da indústria para simular tráfego HTTP em grande escala, testar Web APIs e gerar relatórios visuais detalhados.</p>

<h3>📈 Conceitos Fundamentais</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Vazão (Throughput / RPS):</strong> Mede o número de transações ou requisições que o sistema consegue processar por segundo (ex: 250 RPS).</li>
  <li><strong>Latência / Tempo de Resposta:</strong> O tempo decorrido entre o envio de uma requisição pelo cliente e a resposta do servidor (geralmente medido em milissegundos).</li>
  <li><strong>Concorrência (VUs):</strong> Quantidade de usuários virtuais (Virtual Users) ativos simulando ações simultaneamente no sistema.</li>
  <li><strong>SLA / SLO:</strong> Acordo de Nível de Serviço. Define os limites aceitáveis de performance para o negócio (ex: "95% das requisições de checkout devem responder em menos de 500ms").</li>
</ul>

<h3>🏛️ Tipos de Testes de Performance</h3>
<p>Diferentes cenários exigem diferentes estratégias de carga. Abaixo estão os quatro tipos essenciais:</p>

<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; font-family:monospace; line-height:1.2; overflow-x:auto">
1. Teste de Carga (Load Test)     2. Teste de Estresse (Stress Test)
      Carga Normal                            Carga Extrema
  VU ▲       ┌──────────┐                 VU ▲          ┌───┐
     │      ╱            ╲                   │        ╱     ╲
     │    ╱                ╲                 │      ╱         ╲
     └────┴────────────────┴──► Tempo        └────┴───────────┴──► Tempo

3. Teste de Pico (Spike Test)      4. Teste de Resistência (Soak Test)
     Carga Repentina                           Carga Prolongada
  VU ▲     ┌┐                             VU ▲      ┌───────────────┐
     │    ╱││╲                               │     ╱                 ╲
     │  ╱  ││  ╲                             │   ╱                     ╲
     └─┴───┴┴──┴──────────────► Tempo        └──┴───────────────────────┴► Tempo
</pre>

<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>1. Teste de Carga:</strong> Avalia o comportamento do sistema sob uma carga esperada de uso diário para verificar se atende aos SLAs.</li>
  <li><strong>2. Teste de Estresse:</strong> Aumenta a carga de forma contínua até o sistema falhar ou quebrar, identificando o limite máximo de capacidade (ponto de ruptura).</li>
  <li><strong>3. Teste de Pico (Spike):</strong> Simula um aumento súbito e extremo de usuários (ex: Black Friday, abertura de vendas de ingressos) para testar a velocidade de recuperação e auto-escalabilidade.</li>
  <li><strong>4. Teste de Resistência (Soak):</strong> Mantém uma carga estável por um período prolongado (horas ou dias) para detectar vazamentos de memória (memory leaks), exaustão de conexões com banco e degradação progressiva.</li>
</ul>

<h3>🚀 Quickstart: Apache JMeter via CLI</h3>
<p>Embora o JMeter possua uma interface gráfica (GUI) excelente para criar planos de teste, <strong>nunca utilize a GUI para executar testes de carga volumosos</strong>, pois ela consome muita memória. Use o modo CLI (Command Line Interface):</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
# 1. Instale o JMeter (https://jmeter.apache.org/) e configure o JAVA_HOME
# 2. Execute o teste (modo non-GUI) informando o plano (.jmx) e o arquivo de logs (.jtl)
jmeter -n -t plano-de-teste.jmx -l resultados.jtl -Jusers=50 -Jduration=120

# 3. Gere o relatório estatístico HTML completo a partir do log gerado
jmeter -g resultados.jtl -o relatorio-html/
</pre>

<h3>💻 Exemplo de Execução Local</h3>
<p>Um exemplo de plano de teste funcional está em <code>scripts/jmeter/test-plan.jmx</code>. Caso você já tenha o JMeter instalado localmente, pode executar o script de demonstração contra nossa API de testes:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
# Executando o plano de teste local
jmeter -n -t scripts/jmeter/test-plan.jmx -l scripts/jmeter/results.jtl -JBASE_URL="https://jsonplaceholder.typicode.com"

# Gerando o relatório estatístico em HTML
jmeter -g scripts/jmeter/results.jtl -o scripts/jmeter/report
</pre>
<p>Caso prefira usar Docker ou queira ver alternativas de execução, consulte as instruções em <code>scripts/jmeter/README.md</code>.</p>

<h3>💡 Amostras e Outputs do Projeto</h3>
<p>Amostras prontas de logs e relatórios estão disponíveis na pasta <code>scripts/perf/examples/</code> para comparação. O pipeline do curso consolida os sumários de k6 e JMeter em <code>scripts/perf/summary.html</code>, que você pode abrir no navegador local para analisar os indicadores consolidados.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Abra a pasta do projeto no seu terminal e identifique o script `scripts/jmeter/test-plan.jmx`.</li>
  <li>Execute a query de teste local contra a API utilizando o comando CLI do JMeter detalhado acima.</li>
  <li>Gere o relatório estatístico HTML, abra o arquivo <code>index.html</code> gerado no seu navegador e localize as métricas de tempo de resposta (p95/p99) e a taxa de erros.</li>
</ol>

<h3>📌 SLAs e Thresholds (k6)</h3>
<p>Definir SLAs ajuda a automatizar decisões em pipelines. No <em>k6</em> você declara <strong>thresholds</strong> que fazem a execução falhar quando os limites não são atendidos — ideal para bloquear deploys.</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
// Exemplo mínimo de thresholds em script k6 (ES module)
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50,
  duration: '2m',
  thresholds: {
    // 95% das requisições devem responder em menos de 500ms
    'http_req_duration{type:api}': ['p(95)<500'],
    // Taxa de erro deve ser inferior a 1%
    'http_req_failed': ['rate<0.01']
  }
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');
  check(res, { 'status 200': (r) => r.status === 200 });
}

# Execução no CI (exemplo):
# k6 run --vus 50 --duration 2m scripts/k6/example.js
</pre>

<p>Se qualquer threshold falhar, o k6 retorna código não-zero, permitindo que o job do CI falhe automaticamente. Inclua thresholds que representem os SLAs do seu produto (p95, p99, taxa de erro, throughput).</p>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://jmeter.apache.org/" target="_blank">Site Oficial do Apache JMeter</a></li>
  <li><a href="https://jmeter.apache.org/usermanual/get-started.html" target="_blank">Manual de Usuário do JMeter - Primeiros Passos</a></li>
  <li><a href="https://testautomationu.applitools.com/jmeter-tutorial/" target="_blank">Test Automation University - Curso Gratuito de JMeter</a></li>
</ul>
