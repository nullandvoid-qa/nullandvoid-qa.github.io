---
title: Performance Testing - k6 e testes de API
duration: 75 min
---

<h2>k6 para testes de carga modernos</h2>

<h3>Objetivos de Aprendizado</h3>
<ul>
  <li>Instalar e escrever um script básico em k6</li>
  <li>Executar e parametrizar cenários de carga</li>
  <li>Integrar resultados com CI (GitHub Actions, GitLab CI)</li>
</ul>

<h3>Quickstart: script k6 básico</h3>
<pre style="background:#f5f5f5; padding:1rem">
# Instalar k6: https://k6.io/docs/getting-started/installation/
# Exemplo: script.js
import http from 'k6/http';
import { sleep } from 'k6';

export let options = { vus: 50, duration: '30s' };

export default function () {
  http.get('https://test-api.example.com/');
  sleep(1);
}

# Rodar
k6 run script.js
</pre>

<h3>Exercício</h3>
<ol>
  <li>Crie um script k6 que faça autenticação e execute 200 VUs por 1 minuto.</li>
  <li>Armazene resultados em CSV/JSON e analise p95/p99 latencies.</li>
</ol>

<h3>Recursos</h3>
<ul>
  <li><a href="https://k6.io/docs/" target="_blank">k6 Docs</a></li>
  <li><a href="https://k6.io/docs/cloud/" target="_blank">k6 Cloud</a></li>
</ul>
<h3>Exemplo de script e CI</h3>
<p>Um exemplo executável do script k6 está em <code>scripts/k6/basic-script.js</code>. Se você instalou o k6 localmente, execute <code>k6 run scripts/k6/basic-script.js</code>. Há também um workflow de GitHub Actions em <code>.github/workflows/perf-k6.yml</code> que roda este script via Docker como opção adicional.</p>

<h3>Sample outputs</h3>
<p>Veja um exemplo de saída k6 em <code>scripts/perf/examples/k6-summary-sample.json</code>.</p>
<p>Quick local summary: open <code>scripts/perf/summary.html</code> to view a consolidated k6 + JMeter summary (generated from course examples).</p>

