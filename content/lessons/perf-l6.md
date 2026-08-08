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
