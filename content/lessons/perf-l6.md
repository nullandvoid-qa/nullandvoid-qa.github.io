---
title: Testes de Performance - Integração de CI e Observabilidade
duration: 60 min
---

<h2>Testes de Performance - Integração de CI e Observabilidade</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Integrar testes automatizados de carga k6 diretamente em pipelines de Integração Contínua (CI).</li>
  <li>Enviar métricas em tempo real para ferramentas de monitoramento como Prometheus e Grafana.</li>
  <li>Configurar limites (thresholds) e gatilhos de qualidade para bloquear builds instáveis ou lentas de forma automática.</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Executar testes de performance manualmente na máquina local fornece dados isolados. O verdadeiro valor surge ao integrar testes de performance nos pipelines de CI/CD de forma recorrente. Ao automatizar a execução de um teste regressivo a cada alteração ou pull request, garantimos que problemas de lentidão não cheguem até o ambiente de produção.</p>

<h3>💻 Exemplo de Pipeline com GitHub Actions</h3>
<p>O snippet abaixo demonstra como criar uma etapa no GitHub Actions para clonar o projeto, baixar dependências, instalar o k6 e executar o teste de regressão, coletando os relatórios de resultados no final:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
name: Testes de Carga Regressivos

on:
  pull_request:
    branches: [ main ]

jobs:
  perf:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup k6
        uses: grafana/setup-k6-action@v1

      - name: Run k6 Performance Test
        run: k6 run scripts/k6/basic-script.js
</pre>

<h3>📦 Artefatos e retenção</h3>
<p>Armazene artefatos gerados pelo teste para investigação e auditoria:</p>
<ul>
  <li><strong>Relatórios k6 (JSON/HTML):</strong> salvar o resumo `k6-summary.json` e o HTML interativo para inspeção posterior.</li>
  <li><strong>HAR / Netlogs e Screenshots:</strong> especialmente para cenários que envolvem browser ou endpoints que retornam payloads assincrônicos.</li>
  <li><strong>Métricas de infra:</strong> exportar séries temporais essenciais (CPU, memoria, latência de DB, pool de conexões) durante o teste.</li>
  <li><strong>Retenção:</strong> conservar artefatos por pelo menos 30 dias para regressões e auditoria; para releases maiores, manter por 90 dias.</li>
</ul>

<h3>🚦 Thresholds como Quality Gates</h3>
<p>Defina thresholds no k6 e use o código de saída do `k6 run` para falhar o job. Exemplos de gates:</p>
<ul>
  <li>`http_req_failed: ['rate<0.01']` — mais de 1% de erros deve falhar o job.</li>
  <li>`http_req_duration: ['p(95)<500']` — p95 maior que 500ms falha o job.</li>
  <li>Combine thresholds com verificações adicionais: monitorar aumento de CPU > 80% durante sustentação pode também acionar falha automática via script que consulta Prometheus.</li>
</ul>

<h3>🔗 Correlacionando métricas k6 com infraestrutura</h3>
<p>Para diagnosticar rapidamente, correlacione p95/p99 do k6 com métricas infra em janelas temporais iguais:</p>
<ol>
  <li>Durante o período de sustentação do teste, extraia métricas de CPU, memória, latência de banco e hit-rate de cache do Prometheus para a mesma janela.</li>
  <li>Visualize em Grafana sobrepondo p95 do k6 com CPU e latência de DB; picos simultâneos indicam provável causa.</li>
  <li>Use `X-Request-Id` para unir logs e traces de aplicação com a requisição específica que apresentou alta latência.</li>
</ol>

<h3>🛠️ Comportamento do CI ao falhar um gate</h3>
<ul>
  <li>Quando um threshold falha, o job deve: (1) falhar o build com código de saída não-zero; (2) anexar relatórios e logs ao artefato do job; (3) notificar o time responsável (Slack/email) com link para as evidências.</li>
  <li>Evite bloquear a pipeline de merge para falhas em testes noturnos não críticos — em vez disso, crie um bloqueio apenas para regressões em pipelines de PR/merge que coincidam com releases.</li>
  <li>Inclua um mecanismo de triagem automática: um pequeno script que, ao detectar uma falha, tenta re-executar o teste de forma reduzida para confirmar flakiness antes de abrir um ticket automático.</li>
</ul>

<h3>📚 Exercício prático (implemente um gate)</h3>
<ol>
  <li>Edite `.github/workflows/perf-k6.yml` para executar `k6 run --out=json=reports/k6-summary.json scripts/k6/basic-script.js` e faça o upload do `reports/k6-summary.json` como artefato do job.</li>
  <li>Adicione um passo que verifica `k6-summary.json` e falha o job se `http_req_failed` &gt; 0.01 ou `p(95)` &gt; 500ms.</li>
  <li>Configure um alerta simples no Grafana ou um webhook que publique no Slack quando um job falhar por threshold.</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li>Pipeline atualizado com `--out=json` e etapa de upload de artefatos.</li>
  <li>Script de verificação que parseia `k6-summary.json` e retorna exit code 1 se thresholds forem violados.</li>
  <li>Notificação configurada (ex: Slack) com link para o job e artefatos.</li>
</ul>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos ver <strong>Testes de Performance - Análise e Mitigação</strong>.</p>

<h3>💡 Por que isso importa</h3>
<p>Executar o teste de carga no pipeline não é suficiente; precisamos enxergar o comportamento da máquina que hospeda o sistema. A observabilidade permite correlacionar o tráfego do teste (RPS e latência) com as métricas de infraestrutura:</p>
<ul style="margin:1rem 0; padding-left:1.2rem">
  <li><strong>Prometheus:</strong> Banco de dados de séries temporais que coleta e armazena métricas de sistemas e serviços.</li>
  <li><strong>Grafana:</strong> Interface gráfica altamente customizável que exibe gráficos de consumo de CPU, vazamentos de memória e taxas de requisição recebidas pelos contêineres em tempo real.</li>
</ul>

<h3>🔍 Amostras de Resumo</h3>
<p>Veja o arquivo <code>scripts/perf/examples/k6-summary-sample.json</code> para analisar a estrutura estatística gerada de forma automatizada pelo pipeline para validação de thresholds.</p>

<h3>🏛️ Por que isso importa?</h3>
<p>Erros de performance em produção custam caro e desgastam a imagem da empresa. Integrar testes de regressão de desempenho nos rituais de CI/CD garante que as regressões de latência sejam pegas de forma automática e preventiva (Quality Gates), alertando o time antes que o código chegue ao usuário final.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Consulte o arquivo YAML do GitHub Actions em <code>.github/workflows/perf-k6.yml</code>.</li>
  <li>Identifique as etapas de instalação do k6 e execução de scripts.</li>
  <li>Descreva brevemente como você alteraria esse arquivo para disparar o pipeline de testes de performance de forma agendada (ex: rodar todas as noites à meia-noite usando expressões `cron`).</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li><strong>Pipeline básico:</strong> as etapas principais são checkout, setup do k6 e execução do script com `k6 run`.</li>
  <li><strong>Agendamento:</strong> para cron, adicione `on.schedule` com expressão adequada (`0 0 * * *` para meia-noite, por exemplo) e mantenha o mesmo job de performance.</li>
  <li><strong>Valor de observabilidade:</strong> a automação de regressão de performance permite buscar mudanças de comportamento de forma previsível e guardar evidência no pipeline.</li>
</ul>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://k6.io/docs/results-output/real-time/prometheus/" target="_blank">Exportando Métricas do k6 para o Prometheus</a></li>
  <li><a href="https://grafana.com/docs/grafana/latest/" target="_blank">Grafana - Dashboards e Documentação Oficial</a></li>
</ul>
