---
title: Performance Testing - CI Integration e Observability
duration: 60 min
---

<h2>CI e Observability para Performance</h2>

<h3>Objetivos</h3>
<ul>
  <li>Integrar testes de carga em pipelines (GHA, GitLab CI)</li>
  <li>Enviar métricas para Prometheus/Grafana ou serviços SaaS</li>
  <li>Configurar alertas para regressões de performance</li>
</ul>

<h3>Exercício</h3>
<ol>
  <li>Configure um job de CI que roda um teste k6 rápido e falha se p95 latência > 500ms.</li>
  <li>Conecte resultados a um dashboard (ex: Grafana) e capture um snapshot após o teste.</li>
  <li>Execute o mesmo teste localmente e compare os resultados com a versão em CI.</li>
</ol>

<h3>Exemplo GitHub Actions (snippet)</h3>
<pre style="background:#f5f5f5; padding:1rem">
jobs:
  perf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run k6
        run: k6 run scripts/k6/basic-script.js
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: results
</pre>

<h3>Observability tips</h3>
<ul>
  <li>Envie métricas do sistema (node exporter) para Prometheus.</li>
  <li>Correlacione latências com spikes de CPU/GC nos hosts.</li>
</ul>

<h3>Sample outputs</h3>
<p>Veja <code>scripts/perf/examples/k6-summary-sample.json</code> para entender o formato de resumo que o pipeline produz.</p>

<h3>Why this matters</h3>
<p>Performance failures are only useful if they are visible to the team. This lesson shows how to integrate tests into CI and expose regressions before they reach production.</p>

<h3>Resources</h3>
<ul>
  <li><a href="https://k6.io/docs/using-k6/scenarios/" target="_blank">k6 CI integration</a></li>
  <li><a href="https://grafana.com/docs/grafana/latest/" target="_blank">Grafana documentation</a></li>
</ul>

<h3>Next steps</h3>
<ul>
  <li>Implement the CI job in a branch and validate it fails on bad latency.</li>
  <li>Record a dashboard snapshot and save it with the test artifact.</li>
  <li>Review the alert rules with the team and agree on thresholds.</li>
</ul>
