---
title: Testes de Performance - k6 e testes de API
duration: 75 min
---

<h2>Testes de Performance - k6 e testes de API</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<ul>
  <li>Instalar e criar um script básico de teste de performance usando o k6 em JavaScript/TypeScript.</li>
  <li>Configurar cenários com múltiplos usuários virtuais (VUs) e tempos de ramp-up.</li>
  <li>Definir critérios de sucesso e falha (limites, chamados thresholds) para integrar com o pipeline.</li>
  <li>Executar testes locais e analisar as principais latências (p50, p95 e p99).</li>
</ul>

<h3>💡 Por que isso importa</h3>
<p>O k6 é uma ferramenta moderna de testes de carga focada em desenvolvedores e QAs técnicos. Desenvolvido em Go, mas programado em JavaScript, ele é leve, rápido e se integra perfeitamente a pipelines de CI/CD. Diferente do JMeter, o k6 permite configurar cenários complexos de carga e critérios de qualidade (como limites de erro ou latência) diretamente via código.</p>

<h3>🛠️ Como funcionam os Limites (Thresholds) no k6?</h3>
<p>Um dos recursos mais importantes do k6 para automação e DevOps são os <strong>Thresholds</strong> (limites de tolerância). Eles funcionam como "assertions" para testes de performance, permitindo que a execução termine com status de falha (e aborte um deploy, por exemplo) caso os SLAs do sistema sejam violados.</p>

<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    // 1. Taxa de falha nas requisições HTTP deve ser inferior a 1%
    http_req_failed: ['rate<0.01'],
    // 2. 95% das requisições devem responder em menos de 500ms
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts/1');
  sleep(1);
}
</pre>

<h3>📊 Percentis (p50 / p95 / p99) e interpretação</h3>
<p>Percentis descrevem a distribuição de latências — p50 é a mediana, p95 significa que 95% das requisições responderam naquele tempo ou menos, e p99 é o extremo. Para decisões operacionais prefira p95/p99 (indicadores de experiência da cauda), enquanto p50 ajuda a entender o comportamento típico.</p>

<h3>✅ Verificações em API: checar status e corpo</h3>
<p>Além de medir latência, um teste de API deve validar status e consistência do corpo. Use `check()` do k6 para essas validações:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
import { check } from 'k6';
let res = http.get('https://api.exemplo.local/lessons/42');
check(res, {
  'status is 200': (r) => r.status === 200,
  'body has id and title': (r) => r.json().id === 42 && !!r.json().title,
});
</pre>

<h3>⚖️ Justificando thresholds</h3>
<p>Defina thresholds com base em SLAs reais e capacidade da infra. Exemplo: se o serviço precisa responder 95% das requisições em <500ms em horário de pico, use `http_req_duration: ['p(95)<500']`. Justifique thresholds com dados históricos (logs, APM) e comece conservadoramente.</p>

<h3>🧪 Dados de teste e massa</h3>
<p>Use massas de dados representativas: IDs que reflitam cargas reais, payloads com tamanhos variados, e autenticação quando aplicável. Para endpoints de leitura, prefira datasets grandes; para escrita, verifique idempotência ou limpar dados entre runs.</p>

<h3>🔬 Exemplo aplicado ao projeto</h3>
<p>Teste de API exemplo para o catálogo de aulas:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
// cenário: leitura de aula por ID
// threshold justificado: p95 < 400ms (baseado em SLA de navegação)
let res = http.get(`${__ENV.BASE_URL}/api/lessons/42`);
check(res, { 'status 200': (r) => r.status === 200 });
</pre>

<h3>📈 Interpretação de resultados</h3>
<ul>
  <li>Se p95 ultrapassa threshold: investigar latências de backend, cache-misses e aumento de erros.</li>
  <li>Aumentos em p99 indicam problemas esparsos (ex.: GC, locks) — correlacione com APM e logs.</li>
  <li>Se taxa de erro sobe, reproduza com foco em payloads usados no teste para isolar dados problemáticos.</li>
</ul>

<h3>🚀 Início rápido: Executando o k6 localmente</h3>
<p>O k6 pode ser instalado de forma simples em qualquer sistema operacional (via Homebrew, Chocolatey ou pacotes de instalação direta). Após a instalação, a execução de um script é feita de forma declarativa:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
# Instalar k6 (instruções completas em https://k6.io/docs/getting-started/installation/)

# Criar o script básico
# Salve o código acima em um arquivo chamado `meu-teste.js`

# Executar o teste localmente
k6 run meu-teste.js
</pre>

<h3>💻 Exemplo e Integração com CI</h3>
<p>Um exemplo funcional de script k6 do curso está disponível em <code>scripts/k6/basic-script.js</code>. Se você já tem o k6 instalado, pode rodar o teste local com o comando:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
k6 run scripts/k6/basic-script.js
</pre>
<p>Também disponibilizamos um workflow estruturado no GitHub Actions em <code>.github/workflows/perf-k6.yml</code> que executa esse teste via contêiner Docker a cada alteração ou de forma agendada.</p>

<h3>💡 Amostras e Relatórios Consolidados</h3>
<p>Você pode inspecionar uma saída típica estruturada do k6 no arquivo <code>scripts/perf/examples/k6-summary-sample.json</code>. Além disso, a aplicação gera um resumo estatístico interativo local em <code>scripts/perf/summary.html</code> contendo os dados consolidados das simulações locais.</p>

<h3>📝 Exercício Prático</h3>
<ol>
  <li>Crie um script k6 local configurado para disparar requisições contra <code>https://jsonplaceholder.typicode.com/posts</code>.</li>
  <li>Configure opções com 20 usuários virtuais (VUs) e duração de 45 segundos.</li>
  <li>Adicione um threshold para garantir que 90% das requisições (`p(90)`) respondam em menos de 400ms. Rode o teste e analise se o threshold passou ou falhou no relatório de console do k6.</li>
</ol>

<h3>✅ Gabarito (exercício)</h3>
<ul>
  <li><strong>Script mínimo:</strong> deve usar `http.get()` para `https://jsonplaceholder.typicode.com/posts`, com `vus: 20`, `duration: '45s'` e threshold para `p(90)<400`.</li>
  <li><strong>Resultado esperado:</strong> o console do k6 deve indicar se a execução passou ou falhou; se falhar, o threshold evidencia a degradação de latência.</li>
  <li><strong>Aplicação prática:</strong> a ideia é tornar a execução de performance um substituto simples para gates automatizados, com SLA visível e rastreável em CI.</li>
</ul>

<h3>📚 Recursos</h3>
<ul>
  <li><a href="https://k6.io/docs/" target="_blank">Documentação Oficial do k6</a></li>
  <li><a href="https://k6.io/docs/using-k6/thresholds/" target="_blank">Entendendo e Configurando Thresholds no k6</a></li>
  <li><a href="https://github.com/grafana/k6" target="_blank">Repositório Oficial do k6 no GitHub</a></li>
</ul>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, veremos <strong>Testes de Performance - Testes de Carga em APIs e Servidores de Aplicação</strong>.</p>
