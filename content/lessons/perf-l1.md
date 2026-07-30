---
title: Performance Testing - Introdução e JMeter
duration: 75 min
---

<h2>Performance Testing — Introdução</h2>

<h3>Objetivos de Aprendizado</h3>
<ul>
  <li>Entender conceitos básicos: throughput, latency, concurrency, SLA</li>
  <li>Configurar e executar um teste de carga simples com Apache JMeter</li>
  <li>Interpretar resultados e identificar gargalos iniciais</li>
</ul>

<h3>Resumo Executivo</h3>
<p>Testes de performance medem como o sistema se comporta sob carga. Comece com objetivos claros (SLA, usuários simultâneos, cenário de uso) e cresça a carga em etapas. JMeter é uma ferramenta madura para simular tráfego HTTP, Web APIs e gravação de cenários.</p>

<h3>Quickstart: JMeter (CLI)</h3>
<pre style="background:#f5f5f5; padding:1rem">
# 1. Instale JMeter (https://jmeter.apache.org/)
# 2. Execute um teste não-GUI (recomendado para cargas maiores)
jmeter -n -t test-plan.jmx -l results.jtl -Jusers=50 -Jduration=120

# 3. Gerar relatório HTML
jmeter -g results.jtl -o report-folder
</pre>

<h3>Exercício Prático</h3>
<ol>
  <li>Crie um plano JMeter que execute 100 requisições por segundo contra um endpoint de API simples.</li>
  <li>Capture `response_time` e `error_rate` e gere o relatório HTML.</li>
  <li>Identifique o throughput máximo antes do aumento de erros.</li>
</ol>

<h3>Recursos</h3>
<ul>
  <li><a href="https://jmeter.apache.org/" target="_blank">Apache JMeter</a></li>
  <li><a href="https://www.blazemeter.com/blog/how-to-use-jmeter" target="_blank">JMeter tutorial</a></li>
</ul>
<h3>Exemplo de teste</h3>
<p>Um exemplo de `test-plan.jmx` está disponível em <code>scripts/jmeter/test-plan.jmx</code>. Se você já tem JMeter instalado no seu ambiente local, use os comandos abaixo. Caso contrário, o README em <code>scripts/jmeter/README.md</code> também inclui uma opção Docker opcional.</p>

<h3>Try it (local)</h3>
<pre style="background:#f5f5f5; padding:1rem">
# Execute com JMeter instalado localmente
jmeter -n -t scripts/jmeter/test-plan.jmx -l scripts/jmeter/results.jtl -JBASE_URL="https://test-api.example.com"

# Gerar relatório HTML
jmeter -g scripts/jmeter/results.jtl -o scripts/jmeter/report
</pre>

<h3>Sample outputs</h3>
<p>Sample k6 and JMeter outputs are available in <code>scripts/perf/examples/</code> for comparison, including <code>k6-summary-sample.json</code> and a small JMeter report example.</p>
<p>Combined summary produced by the course pipeline: <code>scripts/perf/summary.html</code> — open this locally to view the consolidated k6 + JMeter pointers.</p>

