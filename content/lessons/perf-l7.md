---
title: Performance Testing - Análise e Mitigação
duration: 75 min
---

<h2>Análise de resultados e planos de mitigação</h2>

<h3>Objetivos</h3>
<ul>
  <li>Interpretar resultados e priorizar ações</li>
  <li>Criar runbook para regressões de performance</li>
  <li>Comunicar findings para stakeholders técnicos e de produto</li>
</ul>

<h3>Exercício</h3>
<ol>
  <li>Com base em um conjunto de resultados, escreva um runbook curto (3 passos) para mitigar a regressão.</li>
  <li>Crie um template de relatório para stakeholders com métricas-chave e recomendações.</li>
</ol>

<h3>Template de relatório (exemplo rápido)</h3>
<pre style="background:#f5f5f5; padding:1rem">
Title: Load test report — [date]
Summary: short summary and pass/fail vs SLA
Metrics:
- Target RPS: 200
- Achieved RPS: 180
- p95 latency: 620ms
- Error rate: 2.3%
Findings:
- High DB contention observed during ramp-up
- Spike in response time on POST /checkout
Recommendations:
1) Add index on ...
2) Cache heavy endpoint
3) Increase DB connection pool
</pre>

<h3>Distribuição de responsabilidades</h3>
<ul>
  <li>QA: executar testes, analisar resultados e preparar o runbook.</li>
  <li>Dev/Ops: providenciar dados/instrumentação e executar correções.</li>
  <li>PO/PM: priorizar mitigations conforme impacto e custo.</li>
</ul>

<h3>Sample outputs</h3>
<p>Use o template em <code>scripts/perf/perf-report-template.md</code> e compare com a amostra em <code>scripts/perf/examples</code>.</p>

<h3>Why this matters</h3>
<p>QA should close the loop by turning test results into prioritized mitigation plans. This lesson emphasizes communication, accountability, and follow-up after a performance run.</p>

<h3>Resources</h3>
<ul>
  <li><a href="https://www.atlassian.com/agile/retrospectives" target="_blank">Writing effective retrospective summaries</a></li>
  <li><a href="https://blog.k6.io/share-performance-results/" target="_blank">Sharing performance findings</a></li>
</ul>

<h3>Next steps</h3>
<ul>
  <li>Finalize a one-page report and share it with stakeholders.</li>
  <li>Document the top three findings and the proposed fixes.</li>
  <li>Plan a follow-up test after the first fix is implemented.</li>
</ul>
