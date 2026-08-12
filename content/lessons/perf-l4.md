---
title: Testes de Performance - Frontend e Realidade de Dispositivos Reais
duration: 60 min
---

<h2>Testes de Performance - Frontend e Realidade de Dispositivos Reais</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Medir o tempo de carregamento percebido pelo usuário por meio das métricas Core Web Vitals (TTFB, FCP, LCP e CLS).</li>
  <li>Usar ferramentas de diagnóstico como Lighthouse (DevTools e CLI) e WebPageTest.</li>
  <li>Entender a diferença de comportamento entre simuladores móveis, emuladores e dispositivos móveis reais.</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>A performance não acontece apenas no servidor. O frontend é o responsável pela primeira impressão do usuário. Mesmo que a API responda em 50ms, se o cliente JavaScript for pesado ou o CSS bloquear a renderização, a experiência parecerá lenta. Testar o frontend envolve medir os tempos de carregamento visual e a interatividade da página diretamente no navegador do usuário.</p>

<h3>📈 Principais Métricas de Performance do Frontend (Core Web Vitals)</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>TTFB (Time to First Byte):</strong> Tempo gasto pelo servidor para responder com o primeiro byte da página HTML. Indica velocidade de rede e processamento de servidor.</li>
  <li><strong>FCP (First Contentful Paint):</strong> Tempo decorrido até que o navegador desenhe a primeira imagem ou texto na tela.</li>
  <li><strong>LCP (Largest Contentful Paint):</strong> Tempo necessário para renderizar o maior bloco de conteúdo visual da página (ex: imagem de destaque ou título principal). É a métrica mais associada com a percepção de carregamento completo.</li>
  <li><strong>CLS (Cumulative Layout Shift):</strong> Mede a estabilidade visual. Avalia se elementos se movem na tela de forma inesperada durante o carregamento (gerando cliques incorretos e frustração).</li>
</ul>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, veremos <strong>Testes de Performance - Infraestrutura e Banco de Dados</strong>.</p>

<h3>🛠️ Ferramentas Recomendadas</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Lighthouse:</strong> Ferramenta integrada ao Chrome DevTools útil para auditorias locais rápidas e geração de scores de acessibilidade, SEO e performance.</li>
  <li><strong>WebPageTest:</strong> Plataforma de auditoria em nuvem avançada que permite testar em conexões simuladas de rede (ex: 3G instável) e em dispositivos reais localizados em diferentes regiões do mundo.</li>
  <li><strong>k6/browser:</strong> Extensão do k6 para testar a renderização visual e injetar carga rodando browsers reais via protocolo CDP.</li>
</ul>

<h3>💻 Comandos de Exemplo</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
# Executando Auditoria de Lighthouse via CLI localmente
npx @lhci/cli@0.8.0 autorun --url=http://localhost:8000 --chrome-flags="--no-sandbox"
</pre>

<h3>📋 Checklist de Análise de Frontend</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Otimização de Imagens:</strong> Imagens muito grandes ou sem compressão (WebP/AVIF são os formatos recomendados) aumentam drasticamente o LCP.</li>
  <li><strong>Bloqueios de Renderização (Render-Blocking):</strong> Scripts de terceiros (como trackers, analytics) e arquivos CSS gigantes colocados no topo do cabeçalho que impedem o carregamento visual da página.</li>
  <li><strong>Emuladores vs Dispositivos Reais:</strong> Testes em emuladores Chrome do computador rodam no processador potente do seu PC. Em celulares reais de baixo custo, a renderização do JavaScript pode demorar até 10 vezes mais.</li>
</ul>

<h3>📊 Interpretando métricas e thresholds</h3>
<p>A leitura de uma métrica isolada não basta. O QA precisa comparar o resultado com o contexto de negócio, a experiência do usuário e os limites de SLA.</p>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>LCP:</strong> abaixo de 2,5s costuma ser considerado bom para a maioria das páginas; acima disso, a percepção de lentidão cresce rapidamente.</li>
  <li><strong>CLS:</strong> valores abaixo de 0,1 são desejáveis; mudanças visuais inesperadas geram frustração e cliques errados.</li>
  <li><strong>TTFB:</strong> um valor acima de 600ms pode indicar gargalo de servidor, rede ou cache ruim, especialmente em páginas com conteúdo dinâmico.</li>
  <li><strong>FCP:</strong> idealmente abaixo de 1,8s para a primeira impressão visual ser considerada fluida.</li>
  <li><strong>SLA e thresholds:</strong> defina limites claros como LCP < 2.5s, CLS < 0.1 e TTFB < 600ms; use esses limites para avaliar se a página precisa de otimização antes de publicar.</li>
</ul>
<p>Quando uma métrica piora, a pergunta correta não é apenas “o número subiu?” mas “o que mudou no frontend, no backend ou na rede para gerar esse impacto?”.</p>

<h3>📍 Exemplos de thresholds de frontend</h3>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>LCP:</strong> p95 abaixo de 2,5s em uma conexão de 4G lenta.</li>
  <li><strong>CLS:</strong> menos de 0,1 em uma jornada de carregamento inicial.</li>
  <li><strong>TTFB:</strong> abaixo de 600ms para páginas HTML dinâmicas.</li>
</ul>

<h3>🔍 Amostras e Outputs</h3>
<p>Consulte a pasta <code>scripts/perf/examples/</code> para visualizar relatórios estatísticos de comparação entre emulador móvel e dispositivo real para análise de performance de rede e renderização.</p>

<h3>🔍 Por que isso importa</h3>
<p>O tempo de carregamento visual dita o sucesso ou fracasso de um produto digital. Medir as métricas de Core Web Vitals e realizar validações cruzadas entre emuladores locais e aparelhos reais ajuda o time de QA a identificar problemas de lentidão que seriam ignorados se testados apenas em computadores potentes de desenvolvimento.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Abra o Chrome DevTools, vá na aba <strong>Lighthouse</strong> e execute um relatório para qualquer portal de notícias ou e-commerce local.</li>
  <li>Localize as métricas FCP, LCP e CLS e anote os scores.</li>
  <li>Identifique nas recomendações do relatório os scripts ou imagens que mais estão atrasando a renderização visual.</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li><strong>Saída esperada:</strong> o relatório de Lighthouse deve expor pontuações e diagnósticos de performance e acessibilidade, com foco nas métricas FCP, LCP e CLS.</li>
  <li><strong>Diagnóstico:</strong> scripts de terceiros, imagens pesadas ou bloqueios de renderização tendem a causar picos de LCP e CLS, principalmente com layout instável.</li>
  <li><strong>Plano de ação:</strong> compressão de imagens, lazy loading e remoção de blocos de renderização desnecessários ajudam a melhorar a percepção de carregamento e usabilidade.</li>
</ul>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://web.dev/explore/vitals" target="_blank">Core Web Vitals - Documentação do web.dev</a></li>
  <li><a href="https://www.webpagetest.org/" target="_blank">WebPageTest - Ferramenta de Testes Online</a></li>
</ul>
