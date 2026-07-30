---
title: Performance Testing - Browser/Frontend e Realidade do Real Device
duration: 60 min
---

<h2>Performance do Frontend e testes em Browsers reais</h2>

<h3>Objetivos</h3>
<ul>
  <li>Medir tempo de carregamento (TTFB, FCP, LCP)</li>
  <li>Usar Lighthouse e WebPageTest para diagnósticos de frontend</li>
  <li>Entender limitações de emuladores vs dispositivos reais para testes de frontend</li>
</ul>

<h3>Ferramentas recomendadas</h3>
<ul>
  <li>Lighthouse (CLI e Chrome DevTools)</li>
  <li>WebPageTest</li>
  <li>Browser-based load via Playwright/puppeteer + k6/browser</li>
</ul>

<h3>Exercício</h3>
<ol>
  <li>Execute Lighthouse em uma página crítica e capture LCP/CLS/TTFB.</li>
  <li>Compare resultados em Desktop vs Mobile emulador vs device real (se disponível).</li>
  <li>Liste as três maiores oportunidades de melhoria de frontend com base no relatório.</li>
</ol>

<h3>Comandos de exemplo</h3>
<pre style="background:#f5f5f5; padding:1rem">
# Lighthouse (CLI)
npx @lhci/cli@0.8.0 autorun --url=https://example.com --chrome-flags="--no-sandbox"

# WebPageTest (simplificado via API) - use a integração do serviço
</pre>

<h3>Checklist de análise</h3>
<ul>
  <li>Verifique recursos grandes (>150KB) e imagens sem compressão.</li>
  <li>Identifique scripts que bloqueiam o render (render-blocking JS/CSS).</li>
  <li>Compare métricas entre emulador e device real para ver gaps de performance.</li>
</ul>

<h3>Sample outputs</h3>
<p>Use os exemplos em <code>scripts/perf/examples/</code> para referência quando comparar device vs emulator.</p>

<h3>Why this matters</h3>
<p>Frontend performance shapes the first impression of a product. Measuring page load metrics and testing across device types helps QA identify what users actually feel.</p>

<h3>Resources</h3>
<ul>
  <li><a href="https://web.dev/measure/" target="_blank">Measure performance with Lighthouse</a></li>
  <li><a href="https://www.webpagetest.org/" target="_blank">WebPageTest</a></li>
</ul>

<h3>Next steps</h3>
<ul>
  <li>Capture at least one Lighthouse and one WebPageTest report for the same page.</li>
  <li>Note the differences between emulator and real-device metrics.</li>
  <li>Use the findings to create a small list of frontend improvements.</li>
</ul>
