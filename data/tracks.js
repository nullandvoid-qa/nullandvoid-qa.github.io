window.TG_QAWAY_TRACKS = [
  {
    id: "starter",
    slug: "guild-initiation",
    title: "Testes Básicos",
    icon: "starter",
    color: "#10b981",
    description: "Sua jornada como recruta da Guilda. Fundamentos de QA, testes manuais e primeiros passos em automação.",
    level: "Iniciante",
    topics: ["Fundamentos de QA", "Testes manuais", "BDD/Gherkin", "Agile", "Git"],
    courses: [
      {
        id: "c1",
        title: "Introdução à Qualidade de Software",
        lessons: [
          {
            id: "l1",
            title: "O que é QA e por que importa",
            duration: "50 min",
            content: `<h2>O que é QA e por que importa</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Definir QA e entender seu escopo real</li>
  <li>Explicar por que QA é <strong>prevenção</strong>, não apenas busca de bugs</li>
  <li>Reconhecer os 5 pilares da qualidade de software</li>
  <li>Entender o impacto financeiro de um bug</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p><strong>QA não é encontrar bugs</strong> — essa é apenas 20% do trabalho. QA é <strong>criar confiança no produto antes dele chegar ao usuário</strong>. Um bom QA trabalha desde o momento em que a ideia é apenas uma conversa, questionando cenários impossíveis antes do código existir. Isso economiza <strong>50-70% do tempo de desenvolvimento</strong>.</p>

<h3>🔍 Entendendo o Conceito</h3>

<h4>O Mito vs A Realidade</h4>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd">❌ Mito Popular</th>
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd">✅ Realidade na Indústria</th>
  </tr>
  <tr style="border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">"QA é quem encontra bugs"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">QA <strong>previne</strong> bugs. Encontra-los é apenas validação. Prevenir é estratégia.</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">"QA testa tudo"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">QA prioriza por risco. Com 1000 cenários possíveis, testamos ~100 que importam.</td>
  </tr>
  <tr style="border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">"QA atrasa o release"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">QA que não existe atrasa. Um bom QA no refinamento economiza semanas.</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">"Qualquer um consegue ser QA"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Qualquer um consegue executar testes. QA profissional entende risco, estratégia e engenharia.</td>
  </tr>
  <tr style="border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">"QA é coisa de final de projeto"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Melhor QA está no início, no planejamento. Isso chama-se "shift-left testing".</td>
  </tr>
</table>

<h3>💼 Um Dia Real de QA</h3>
<blockquote style="border-left:4px solid #10b981; padding-left:1rem; margin:1rem 0; font-style:italic; color:#555">
<strong>8:00 - Refinement com PO e Dev:</strong> "Como vamos testar a integração Stripe? Quais são os cenários de erro? E se a conexão cair no meio da transação?"
<br/><br/>
<strong>10:00 - Code Review:</strong> Revisando os testes que o dev escreveu. Faltam casos de borda? A cobertura está ok?
<br/><br/>
<strong>13:00 - Automação:</strong> Escrevendo testes para CI/CD. Esses testes rodam toda vez que alguém faz push.
<br/><br/>
<strong>15:00 - Mentoring:</strong> Revisando testes do QA júnior. "Por que testou esse cenário? Ele é importante para o usuário?"
<br/><br/>
<strong>16:00 - Bug Triage:</strong> 15 bugs foram reportados. Quais são críticos? Quais podem esperar? Qual deve ir para a próxima sprint?
</blockquote>

<h3>🏗️ Os 5 Pilares da Qualidade</h3>
<p>Quando falamos "qualidade de software", precisamos definir o quê estamos medindo:</p>

<ol style="margin:1rem 0">
  <li><strong style="color:#10b981">Funcionalidade:</strong> O produto faz exatamente o que foi prometido? Um app de banco que não transfere dinheiro = 0 funcionalidade.
  
  <li><strong style="color:#f59e0b">Confiabilidade:</strong> O produto funciona consistentemente? Funciona hoje mas quebra amanhã = confiabilidade baixa.
  
  <li><strong style="color:#3b82f6">Performance:</strong> É rápido o suficiente? Seu app carrega em 10 segundos num 4G? Usuários saem.
  
  <li><strong style="color:#ef4444">Segurança:</strong> Os dados estão protegidos? Um app bancário sem SSL = tudo é roubado.
  
  <li><strong style="color:#8b5cf6">Usabilidade:</strong> Os usuários conseguem usar facilmente? Seu avó consegue fazer login? Se não, usabilidade falha.
</ol>

<p><strong>Exemplo Real:</strong> Um app de e-commerce funciona (pillar 1 ✓), mas leva 5 segundos para carregar (pillar 3 ✗) e tem UI confusa (pillar 5 ✗) = 60% de qualidade = usuários vão pro concorrente.</p>

<h3>💰 O Custo de NÃO Ter QA</h3>
<p>Onde você identifica um bug muda DRASTICAMENTE o custo de corrigir:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
Bug Pego Em...          Custo para Corrigir
═════════════════════════════════════════════
Requirements            $100
Design                  $1,000
Development             $5,000
QA / Testes             $25,000
Produção (real)         $150,000 - $1,000,000
                        (reputação, usuários, processos legais)
</pre>

<p><strong>Conclusão:</strong> Um QA que custa $50k/ano pode economizar $500k de bugs que iriam para produção. ROI de 10x.</p>

<h3>🤔 Uma Pergunta Importante</h3>
<p><strong>Qual é o produto mais crítico que você usa todo dia?</strong> Seu banco? Seu app de saúde? Seu carro?</p>
<p>Agora imagine: <strong>faltou um teste e falharam os dados do seu cartão</strong> ou <strong>a dosagem do seu remédio apareceu errada</strong>. Você processaria?</p>
<p>É <strong>isso</strong> que um QA previne todos os dias. É <strong>isso</strong> que você vai aprender a fazer.</p>

<h3>✏️ Seu Primeiro Exercício</h3>
<p>Abra qualquer app que você usa regularmente (Instagram, Spotify, seu banco, etc).</p>
<p>Encontre e anote <strong>3 cenários onde algo não deveria funcionar</strong> (edge cases):</p>
<ul>
  <li>❓ Exemplo: "E se eu tentar fazer login sem internet?"</li>
  <li>❓ Exemplo: "E se minha senha tem caracteres especiais tipo @#$?"</li>
  <li>❓ Exemplo: "E se eu rapidamente clico 10x no botão de enviar?"</li>
</ul>
<p><strong>Parabéns!</strong> Você já está pensando como QA. Anotar perguntas de "e se" é 50% do trabalho.</p>

<h3>📚 Recursos (Leitura Extra)</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.istqb.org/certifications/foundation-level" target="_blank">📖 Syllabus ISTQB Foundation</a> - A certificação mais reconhecida no mundo em QA. Seção 1 cobre QA basics.</li>
  <li><a href="https://martinfowler.com/articles/qa-in-agile.html" target="_blank">📖 Martin Fowler: QA in Agile</a> - Um dos arquitetos mais respeitados explica o papel de QA moderno.</li>
  <li><a href="https://testcraft.io/blog/shift-left-testing/" target="_blank">📖 Shift-Left Testing Explained</a> - Por quê QA no início economiza tempo e dinheiro.</li>
  <li><a href="https://www.youtube.com/watch?v=X6kyD2ksKpc" target="_blank">🎥 Vídeo (7min): O que QA NÃO é</a> - Demolindo misconceptions comuns.</li>
</ul>

<h3>🤔 Perguntas para Você Refletir</h3>
<ol style="margin:1rem 0">
  <li><strong>Qual é o produto mais crítico que você depende?</strong> Qual seria o impacto se falhasse completamente?</li>
  <li><strong>Na sua opinião, quando deveria começar o teste?</strong> No final do desenvolvimento ou no planejamento?</li>
  <li><strong>Se você fosse criar um app de operação bancária, qual pilar (funcionalidade, confiabilidade, performance, segurança, usabilidade) seria o mais importante?</strong></li>
</ol>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos diferenciar <strong>QA</strong>, <strong>QC</strong> (Quality Control) e <strong>Tester</strong>. Você vai descobrir que não são a mesma coisa — e essa diferença pode determinar seu salário.</p>

<p style="margin-top:2rem; padding-top:1rem; border-top:1px solid #ddd; color:#666; font-size:0.9rem">
✅ <strong>Você completou L1!</strong> Parabéns. Você agora pode explicar para um leigo por quê qualidade de software importa.
</p>

<h3>✏️ Exercício Prático — Gabarito</h3>
<p>Escolha um app e liste 3 edge cases. Compare com o exemplo abaixo.</p>
<details><summary>Gabarito exemplo</summary>
<pre>1) Login sem internet — resultado esperado: mensagem de erro clara e opção de tentar novamente.
2) Senha com caracteres especiais — resultado esperado: aceitar caracteres UTF-8 e validar corretamente.
3) Clique repetido no botão enviar — resultado esperado: botão desabilitado durante requisição para evitar duplicação.</pre>
</details>`,
            resources: [
              { label: "ISTQB Foundation Syllabus", url: "https://www.istqb.org/certifications/foundation-level" },
              { label: "Martin Fowler: QA in Agile", url: "https://martinfowler.com/articles/qa-in-agile.html" },
              { label: "Shift-Left Testing Explained", url: "https://testcraft.io/blog/shift-left-testing/" },
              { label: "Vídeo: O que QA NÃO é", url: "https://www.youtube.com/watch?v=X6kyD2ksKpc" }
            ]
          },
          {
            id: "l2",
            title: "Papéis: QA, QC e Tester",
            duration: "50 min",
            content: `<h2>Diferenças: QA vs QC vs Tester (São 3 Coisas!)</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Explicar a diferença fundamental entre QA, QC e Testing</li>
  <li>Identificar qual papel executa cada atividade</li>
  <li>Entender por que confundir esses papéis custa caro</li>
  <li>Saber qual role aplica para sua carreira</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p><strong>QA, QC e Tester são 3 coisas diferentes</strong> que frequentemente são confundidas. A confusão não é culpa sua — muitas empresas usam errado.</p>
<ul>
  <li><strong>QA (Quality Assurance):</strong> Garante que o PROCESSO de desenvolvimento produz qualidade. Preventivo.</li>
  <li><strong>QC (Quality Control):</strong> Verifica se o PRODUTO final tem qualidade. Reativo.</li>
  <li><strong>Tester:</strong> Executa testes manualmente ou automação. É uma ferramenta.</li>
</ul>

<p><strong>Analogia:</strong> Se software fosse comida:</p>
<ul style="margin:1rem 0">
  <li><strong>QA</strong> = Gerente da cozinha que define: "vamos usar ingredientes frescos, vamos treinar chefs, vamos ter checklist de higiene"</li>
  <li><strong>QC</strong> = Inspector que prova o prato antes de sair: "esse está com muito sal"</li>
  <li><strong>Tester</strong> = Pessoa que prova o prato e registra: "testei com sal, testei sem sal, testei quente, testei frio"</li>
</ul>

<h3>🔍 Entendendo Cada Papel</h3>

<h4>🛡️ QA (Quality Assurance)</h4>
<p><strong>O que é:</strong> Garante que o <strong>processo</strong> está correto. Trabalha ANTES do código existir.</p>

<p><strong>Atividades:</strong></p>
<ul style="margin:1rem 0">
  <li>📋 Define <strong>critérios de aceitação</strong> junto com PO: "como vamos validar que isso funciona?"</li>
  <li>🗣️ Participa do <strong>refinement</strong> de histórias: "isso é testável? há ambiguidade?"</li>
  <li>📊 Define <strong>estratégia de teste</strong>: "vamos precisar teste E2E? Performance? Segurança?"</li>
  <li>🛠️ Cria <strong>templates de teste</strong> e <strong>checklists</strong> para o time reutilizar</li>
  <li>🎓 <strong>Treina</strong> devs e QA juniores em técnicas de teste</li>
  <li>📈 Monitora <strong>métricas de qualidade</strong>: % testes passando, # bugs por sprint, etc</li>
</ul>

<p><strong>Quando trabalha:</strong> Desde o Planning (Sprint 0) até Retrospectiva</p>

<p><strong>Salário tipicamente:</strong> $80k-150k (sênior) | $50k-80k (mid)</p>

<p><strong>Em uma frase:</strong> "QA pergunta 'como vamos validar que isso funciona' ANTES do dev escrever código."</p>

<hr style="margin:2rem 0; border:none; border-top:1px solid #ddd">

<h4>🔍 QC (Quality Control)</h4>
<p><strong>O que é:</strong> Verifica se o <strong>produto final</strong> tem qualidade. Trabalha DEPOIS do código ser escrito.</p>

<p><strong>Atividades:</strong></p>
<ul style="margin:1rem 0">
  <li>🧪 <strong>Executa testes</strong> baseado em plano QA: "testei login, testei checkout, testei logout"</li>
  <li>🐛 <strong>Encontra bugs</strong> e cria tickets detalhados: "passos para reproduzir, resultado esperado vs obtido"</li>
  <li>✅ <strong>Valida correções</strong>: dev corrigiu? Vou testar novamente</li>
  <li>📝 <strong>Documenta testes</strong>: casos de teste, resultados, evidence</li>
  <li>🤖 Pode <strong>automatizar testes</strong> para reutilizar</li>
  <li>🎯 <strong>Prioriza testes</strong> por risco: "o que é mais crítico? Testo primeiro"</li>
</ul>

<p><strong>Quando trabalha:</strong> Durante desenvolvimento, principalmente na fase de testes (T phase)</p>

<p><strong>Salário tipicamente:</strong> $60k-100k (sênior) | $40k-60k (mid)</p>

<p><strong>Em uma frase:</strong> "QC pergunta 'isso funciona?' DEPOIS que o dev diz que terminou."</p>

<hr style="margin:2rem 0; border:none; border-top:1px solid #ddd">

<h4>🧑‍💻 Tester (O Executor)</h4>
<p><strong>O que é:</strong> A pessoa que <strong>executa</strong> os testes. Pode ser manual ou automação.</p>

<p><strong>Atividades:</strong></p>
<ul style="margin:1rem 0">
  <li>▶️ <strong>Executa casos de teste</strong> manual: clica, digita, valida</li>
  <li>⚙️ <strong>Escreve automação</strong> (scripts que testam automaticamente)</li>
  <li>📊 <strong>Reporta resultados</strong>: passou, falhou, bloqueado</li>
  <li>🔄 <strong>Reutiliza testes</strong> em versões novas (regressão)</li>
  <li>📸 <strong>Coleta evidências</strong>: screenshots, logs, vídeos</li>
</ul>

<p><strong>Quando trabalha:</strong> Primariamente na fase de testes, depois na regressão</p>

<p><strong>Salário tipicamente:</strong> $50k-80k (sênior) | $35k-50k (mid)</p>

<p><strong>Em uma frase:</strong> "Tester segue um roteiro e valida: passa ou falha?"</p>

<h3>📊 Comparação Rápida</h3>
<table style="width:100%; border-collapse:collapse; margin:1.5rem 0">
  <tr style="background:#f5f5f5">
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd"><strong>Aspecto</strong></th>
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd"><strong>QA</strong></th>
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd"><strong>QC</strong></th>
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd"><strong>Tester</strong></th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd"><strong>Foco</strong></td>
    <td style="padding:0.75rem; border:1px solid #ddd">Processo</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Produto</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Execução</td>
  </tr>
  <tr style="background:#f9f9f9">
    <td style="padding:0.75rem; border:1px solid #ddd"><strong>Quando</strong></td>
    <td style="padding:0.75rem; border:1px solid #ddd">Antes/Durante</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Durante/Depois</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Durante</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd"><strong>Abordagem</strong></td>
    <td style="padding:0.75rem; border:1px solid #ddd">Preventiva</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Reativa</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Executiva</td>
  </tr>
  <tr style="background:#f9f9f9">
    <td style="padding:0.75rem; border:1px solid #ddd"><strong>Pergunta-chave</strong></td>
    <td style="padding:0.75rem; border:1px solid #ddd">"Como testamos?"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">"Isso funciona?"</td>
    <td style="padding:0.75rem; border:1px solid #ddd">"Passou?"</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd"><strong>Skill Primário</strong></td>
    <td style="padding:0.75rem; border:1px solid #ddd">Pensamento estratégico</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Análise crítica</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Atenção ao detalhe</td>
  </tr>
</table>

<h3>💼 Exemplo Real: Uma Feature no Time</h3>
<blockquote style="border-left:4px solid #f59e0b; padding-left:1rem; margin:1.5rem 0; background:#fffbf0; padding:1rem">

<p><strong>Feature:</strong> "Adicionar Dark Mode ao app"</p>

<p><strong>Seg (Planning):</strong>
<br/>👤 <strong>QA:</strong> "Pessoal, dark mode afeta segurança (contrast de credenciais)? Como testamos acessibilidade? Que elementos viram preto vs branco? Vamos precisar teste com deficientes visuais?"
<br/>✅ Resultado: Critérios de teste claros antes de dev começar

<p><strong>Ter-Qua (Dev):</strong>
<br/>👤 <strong>Dev:</strong> Implementa dark mode
<br/>👤 <strong>QC:</strong> Testa conforme o plano QA preparou. Encontra: "logo fica invisível no dark mode"
<br/>✅ Resultado: Bug pego antes de produção ($100 custo, vs $100k depois)

<p><strong>Qui:</strong>
<br/>👤 <strong>Dev:</strong> Corrige logo
<br/>👤 <strong>QC (Tester):</strong> Roda teste de regressão. Valida a correção

<p><strong>Sex:</strong>
<br/>👤 <strong>QA:</strong> Coleta métricas: "quantos elementos foram testados? Qual % de coverage?"
<br/>✅ Resultado: Documentação para próximas features de dark mode

</blockquote>

<h3>❓ Na Entrevista: O que Responder?</h3>
<p><strong>Pergunta:</strong> "Qual a diferença entre QA e Tester?"</p>

<p><strong>Resposta Esperada:</strong></p>
<blockquote style="border-left:4px solid #10b981; padding-left:1rem; margin:1rem 0; background:#f0fdf4; padding:1rem">
"QA é estratégico — define COMO vamos validar que algo funciona, antes de ser desenvolvido. Tester é executivo — segue o plano e executa os testes. Confundir os dois é como confundir um arquiteto com um pedreiro: ambos são importantes, mas fazem coisas muito diferentes. Um QA bom economiza horas de retrabalho porque identifica problemas no design, não só na implementação."
</blockquote>

<h3>✏️ Exercício Prático</h3>
<p><strong>Classifique estas 10 atividades:</strong> QA? QC? Tester?</p>

<ol style="margin:1rem 0; list-style-position:inside">
  <li>Escrever um teste de Cypress que valida o login</li>
  <li>Participar do refinement dizendo "isso é ambíguo, como testamos?"</li>
  <li>Executar manualmente um teste no app</li>
  <li>Reportar um bug: "passos para reproduzir, resultado esperado, resultado obtido"</li>
  <li>Criar template de "caso de teste" para o time reutilizar</li>
  <li>Treinar devs em "partição de equivalência"</li>
  <li>Executar automação e reportar: "5/10 testes passaram"</li>
  <li>Monitorar % de testes passando ao longo do tempo</li>
  <li>Validar que dev corrigiu o bug que foi reportado</li>
  <li>Definir que os testes devem rodar em Chrome, Firefox e Safari</li>
</ol>

<p><strong>Gabarito:</strong> 1=Tester | 2=QA | 3=Tester | 4=QC | 5=QA | 6=QA | 7=Tester | 8=QA | 9=QC | 10=QA</p>

<h3>🎖️ Guild Master Notes (Para Sêniors)</h3>
<blockquote style="border-left:4px solid #8b5cf6; padding-left:1rem; margin:1.5rem 0; background:#faf5ff; padding:1rem">
<p><strong>Se você já domina esses conceitos:</strong></p>

<p>Hoje a indústria está <strong>eliminando a separação rígida</strong> entre QA/QC. Em times modernos (Agile/DevOps), um único profissional faz:</p>
<ul>
  <li>✓ QA (design de testes)</li>
  <li>✓ QC (validação)</li>
  <li>✓ Automação (tester role)</li>
</ul>

<p>Isso é chamado "test engineer" ou "QA engineer". Exige mais skills (estratégia + programação + análise), mas é o futuro.</p>

<p><strong>Sua tarefa como líder:</strong> se seu time ainda tem papéis separados, começar a unir. Mas cuidado — um tester não pode virar QA da noite pro dia. Leva treinamento.</p>

</blockquote>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.istqb.org/certifications/foundation-level" target="_blank">📖 ISTQB Foundation Syllabus</a> - Capítulo sobre papéis define isso oficialmente</li>
  <li><a href="https://www.coursera.org/articles/qa-vs-qc" target="_blank">📖 Coursera: QA vs QC Explained</a> - Artigo prático com exemplos</li>
  <li><a href="https://www.atlassian.com/continuous-delivery/quality" target="_blank">📖 Atlassian: Quality in Software</a> - Como Agile mudou esses papéis</li>
  <li><a href="https://youtu.be/GXJxC9EZjuE" target="_blank">🎥 Vídeo (5min): QA vs QC vs Testing Explained</a> - Visual bem didático</li>
</ul>

<h3>🤔 Reflexão Final</h3>
<ol style="margin:1rem 0">
  <li><strong>Na sua carreira, qual papel você quer ser?</strong> QA (estratégico), QC (analítico), ou Tester (executivo)?</li>
  <li><strong>Em uma entrevista, como você explicaria a diferença com suas próprias palavras?</strong></li>
  <li><strong>Seu time atual usa esses papéis separados ou já está unificado?</strong></li>
</ol>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, vamos entender <strong>O SDLC (Software Development Lifecycle)</strong> e por que QA deve estar <strong>desde o começo</strong>, não no final. Prepare-se para aprender sobre "shift-left testing".</p>

<p style="margin-top:2rem; padding-top:1rem; border-top:1px solid #ddd; color:#666; font-size:0.9rem">
✅ <strong>Você completou L2!</strong> Agora você sabe diferenciar os três papéis. Isso impressiona em entrevistas e te prepara para escolher sua carreira em QA.
</p>

<h3>✏️ Exercício Prático — Gabarito</h3>
<p>Classifique as 10 atividades do exercício como QA, QC ou Tester e compare com o gabarito.</p>
<details><summary>Gabarito exemplo</summary>
<pre>1=Tester | 2=QA | 3=Tester | 4=QC | 5=QA | 6=QA | 7=Tester | 8=QA | 9=QC | 10=QA</pre>
</details>`,
            resources: [
              { label: "ISTQB Foundation Syllabus", url: "https://www.istqb.org/certifications/foundation-level" },
              { label: "QA vs QC Explained", url: "https://www.coursera.org/articles/qa-vs-qc" },
              { label: "Atlassian: Quality in Software", url: "https://www.atlassian.com/continuous-delivery/quality" },
              { label: "Vídeo: QA vs QC vs Testing Explained", url: "https://www.youtube.com/watch?v=GXJxC9EZjuE" }
            ]
          }
            ,
            {
              id: "l9",
              title: "Critérios de Aceitação e Definição de Pronto",
              duration: "50 min",
              content: `<h2>Critérios de Aceitação e Definição de Pronto</h2>

  <h3>🎯 Objetivos de Aprendizado</h3>
  <p>Após esta aula, você será capaz de:</p>
  <ul>
    <li>Entender a importância dos critérios de aceitação</li>
    <li>Escrever critérios claros, completos e testáveis</li>
    <li>Conectar aceitação de histórias com a Definição de Pronto</li>
    <li>Avaliar se uma história está realmente pronta para ser entregue</li>
  </ul>

  <h3>📊 Resumo Executivo</h3>
  <p>Critérios de aceitação não são apenas uma formalidade. Eles são a linguagem que transforma expectativas do cliente em testes reais. Uma história sem critérios bem definidos é um convite ao retrabalho e à interpretação errada.</p>

  <h3>🧩 O que é Critério de Aceitação?</h3>
  <p>É uma condição que a história precisa satisfazer para ser considerada concluída. Devem ser:</p>
  <ul style="margin:1rem 0">
    <li><strong>Claros</strong> — qualquer pessoa deve entender o resultado esperado</li>
    <li><strong>Testáveis</strong> — não podem ser ambíguos ou genéricos</li>
    <li><strong>Completos</strong> — cobrem comportamento normal e exceções importantes</li>
  </ul>

  <h3>📌 Exemplo</h3>
  <p>História: “Como usuário, quero cadastrar meu cartão para pagar compras”.</p>
  <ul>
    <li>O usuário deve ver uma mensagem de confirmação ao salvar o cartão</li>
    <li>Se o número do cartão for inválido, o sistema deve mostrar erro específico</li>
    <li>A data de validade deve ser aceita apenas em formato MM/AA</li>
  </ul>

  <h3>✅ Definição de Pronto (Definition of Done)</h3>
  <p>A Definição de Pronto é a checklist que garante que o trabalho está finalizado. Não é apenas o código entregue: é o comportamento validado, a documentação atualizada e a qualidade confirmada.</p>

  <h3>🛠️ Exemplo de itens de DoD</h3>
  <ul style="margin:1rem 0">
    <li>Código revisado e aprovado</li>
    <li>Testes automatizados adicionados para comportamento crítico</li>
    <li>Critérios de aceitação validados manualmente</li>
    <li>Documentação de uso atualizada quando necessário</li>
    <li>Bugfixes verificados e regressão executada</li>
  </ul>

  <h3>✏️ Exercício Prático</h3>
  <p>Escolha uma história simples e escreva três critérios de aceitação e três itens de Definição de Pronto. Compare com seu time e veja se sobrou algo ambiguo.</p>

  <h4>Gabarito (exemplo)</h4>
  <details><summary>Exemplo preenchido</summary>
  <pre>Critérios de aceitação:
- O usuário deve ver confirmação ao salvar cartão
- Número do cartão validado por algoritmo Luhn
- Data de validade no formato MM/AA

Definição de Pronto:
- Código revisado
- Testes automatizados adicionados para fluxo de pagamento
- Documentação atualizada
</pre>
  </details>`,
              resources: [
                { label: "Definição de Pronto na Prática", url: "https://www.scrum.org/resources/what-is-done" },
                { label: "Critérios de Aceitação Testáveis", url: "https://www.mountaingoatsoftware.com/blog/writing-better-acceptance-criteria" }
              ]
            }
        ]
      },
      {
        id: "c2",
        title: "Ciclo de Vida e Tipos de Teste",
        lessons: [
          {
            id: "l3",
            title: "SDLC e onde o QA se encaixa",
            duration: "55 min",
            content: `<h2>SDLC e onde o QA se encaixa</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Descrever as fases do SDLC</li>
  <li>Explicar onde QA atua em cada fase</li>
  <li>Definir o que é "shift-left"</li>
  <li>Identificar oportunidades de QA no início do ciclo</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>O SDLC (Software Development Lifecycle) é o caminho que um produto percorre desde a ideia até a produção. QA deve estar presente em todas as fases, mas quanto mais cedo entrar, maior a chance de evitar retrabalho e bugs caros. Esse movimento se chama <strong>shift-left</strong>.</p>

<h3>🔁 As Fases do SDLC</h3>
<ol style="margin:1rem 0">
  <li><strong>Iniciação / Ideação</strong> – entender problema, público e objetivos.</li>
  <li><strong>Requisitos</strong> – documentar o que o produto deve fazer.</li>
  <li><strong>Design</strong> – definir arquitetura, fluxos e interfaces.</li>
  <li><strong>Desenvolvimento</strong> – escrever código e implementar a solução.</li>
  <li><strong>Testes</strong> – validar o produto antes do deploy.</li>
  <li><strong>Deploy / Produção</strong> – entregar ao usuário final.</li>
  <li><strong>Manutenção</strong> – corrigir bugs e evoluir o produto.</li>

  </ol>

  <h3>✏️ Exercício Prático — Gabarito</h3>
  <p>Use o exemplo abaixo para responder as três perguntas do exercício.</p>
  <details><summary>Gabarito exemplo</summary>
  <pre>1) Fase: Desenvolvimento
2) QA antes do desenvolvimento: revisão de requisitos e critérios de aceitação
3) Maior oportunidade de shift-left: validar critérios de aceitação no refinement</pre>
  </details>

<h3>🧩 Onde o QA Atua</h3>
<p>Veja como QA agrega valor em cada etapa do ciclo de vida:</p>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; border:1px solid #ddd">Fase</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Atividade de QA</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Valor</th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Iniciação</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Validar objetivo do produto, sucesso do usuário e risco inicial.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Reduz requisitos errados.</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Requisitos</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Refinar critérios de aceitação e requisitos testáveis.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Elimina ambiguidade.</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Design</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Revisar fluxos, arquitetura e UX sob perspectiva de teste.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Descobre problemas antes da implementação.</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Desenvolvimento</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Apoiar o time com casos de teste, automação inicial e revisão de código.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Acelera entrega com menos bugs.</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Testes</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Executar e automatizar testes, validar correções.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Garante qualidade antes do release.</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Deploy</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Verificar readiness, smoke test e monitoramento inicial.</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Evita falhas em produção.</td>
  </tr>
</table>

<h3>⚡ O que é Shift-Left?</h3>
<p><strong>Shift-left</strong> significa mover QA para a esquerda no ciclo de vida: antes do desenvolvimento, no planejamento e no design. Assim, problemas são encontrados mais cedo e custam menos para corrigir.</p>

<h3>📌 Exemplo Prático</h3>
<p>Imagine um app de e-commerce:</p>
<ul>
  <li><strong>Sem shift-left:</strong> O time implementa o carrinho e só depois descobre que o desconto não se aplica em promoções.</li>
  <li><strong>Com shift-left:</strong> QA pergunta no refinement: "como o desconto deve funcionar com promoções e cupons?"</li>
</ul>

<p>Resultado: o bug é evitado antes do dev escrever a primeira linha.</p>

<h3>📉 Custo de Bugs por Fase</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
Bug encontrado em...    Custo relativo
══════════════════════════════
Requisitos             1x
Design                 5x
Desenvolvimento        10x
Testes                 20x
Produção               100x
</pre>

<h3>✏️ Exercício Prático</h3>
<p>Escolha um app que você conhece bem (por exemplo WhatsApp, Instagram ou seu banco) e responda:</p>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Em qual fase do SDLC ele está agora?</li>
  <li>Que tipo de QA poderia ter sido feito antes do desenvolvimento?</li>
  <li>Qual foi a maior oportunidade de shift-left nesse app?</li>
</ol>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.agilealliance.org/glossary/sdlc/" target="_blank">📖 SDLC definition - Agile Alliance</a></li>
  <li><a href="https://testcraft.io/blog/shift-left-testing/" target="_blank">📖 Shift-Left Testing Explained</a></li>
  <li><a href="https://martinfowler.com/bliki/TestPyramid.html" target="_blank">📖 Martin Fowler: Test Pyramid</a></li>
  <li><a href="https://www.atlassian.com/continuous-delivery" target="_blank">📖 Atlassian: Continuous Delivery and QA</a></li>
</ul>

<h3>🤔 Reflexão Final</h3>
<ol style="margin:1rem 0">
  <li>Qual fase do SDLC mais precisa de QA no seu projeto atual?</li>
  <li>Se você pudesse adicionar QA a uma fase antes do desenvolvimento, qual seria?</li>
  <li>Qual bug do seu app seria mais barato evitar do que consertar?</li>
</ol>

<h3>⏭️ Próxima Aula</h3>
<p>Na próxima aula, você verá como distinguir claramente entre testes funcionais e não-funcionais e quando usar cada um.</p>

<h3>🎬 Roteiro de vídeo</h3>
<ul style="margin:1rem 0">
  <li><strong>00:00–00:20</strong> — Abertura: apresentação do tema e objetivos da aula.</li>
  <li><strong>00:20–01:30</strong> — Explicar o SDLC com animação de linha do tempo.</li>
  <li><strong>01:30–03:00</strong> — Exemplos práticos de shift-left no e-commerce (narração + tela).</li>
  <li><strong>03:00–04:00</strong> — Mostrar a tabela de fases e atividades de QA (zoom in).</li>
  <li><strong>04:00–04:40</strong> — Conclusão: resumo das ações que o aluno pode aplicar hoje.</li>
</ul>

<h3>✏️ Exercício Prático — Gabarito</h3>
<p>Para a feature escolhida, veja o exemplo de matriz preenchida abaixo.</p>
<details><summary>Matriz exemplo</summary>
<pre>Funcionalidade: Pagamento | Impacto: Alto | Probabilidade: Médio | Prioridade: Alto
Funcionalidade: Login | Impacto: Alto | Probabilidade: Baixo | Prioridade: Médio</pre>
</details>
`,
            resources: [
              { label: "SDLC definition - Agile Alliance", url: "https://www.agilealliance.org/glossary/sdlc/" },
              { label: "Shift-Left Testing Explained", url: "https://testcraft.io/blog/shift-left-testing/" },
              { label: "Martin Fowler: Test Pyramid", url: "https://martinfowler.com/bliki/TestPyramid.html" },
              { label: "Atlassian: Continuous Delivery and QA", url: "https://www.atlassian.com/continuous-delivery" }
            ]
          },
          {
            id: "l4",
            title: "Testes funcionais vs não-funcionais",
            duration: "55 min",
            content: `<h2>Testes funcionais vs não-funcionais</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Diferenciar testes funcionais de não-funcionais</li>
  <li>Listar exemplos práticos de cada tipo</li>
  <li>Identificar como escolher o tipo correto para um cenário</li>
  <li>Planejar um conjunto equilibrado de testes para uma feature</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Testes funcionais validam o <strong>comportamento</strong> do sistema: se ele faz o que promete. Testes não-funcionais validam <strong>como</strong ele faz: desempenho, segurança, usabilidade, acessibilidade e escalabilidade.</p>

<h3>🔍 Testes Funcionais</h3>
<ul style="margin:1rem 0">
  <li><strong>O que são:</strong> Testam a funcionalidade do produto.</li>
  <li><strong>Pergunta-chave:</strong> "Isso funciona como esperado?"</li>
  <li><strong>Exemplos:</strong> login, cadastro, compra, busca, filtros.</li>
  <li><strong>Técnicas:</strong> casos de uso, critérios de aceitação, equivalência.</li>
</ul>

<h3>⚙️ Testes Não-Funcionais</h3>
<ul style="margin:1rem 0">
  <li><strong>Performance:</strong> tempo de resposta, carga, stress.</li>
  <li><strong>Segurança:</strong> autenticação, autorização, proteção de dados.</li>
  <li><strong>Usabilidade:</strong> facilidade de uso, clareza, navegação.</li>
  <li><strong>Acessibilidade:</strong> compatibilidade com leitores de tela, contraste, navegação por teclado.</li>
  <li><strong>Confiabilidade:</strong> estabilidade sob condições reais.</li>
</ul>

<h3>📌 Exemplo na Prática</h3>
<p>Feature: checkout de um e-commerce</p>
<ul>
  <li><strong>Funcional:</strong> usuário consegue adicionar item ao carrinho, editar quantidade e finalizar compra.</li>
  <li><strong>Performance:</strong> a página de checkout carrega em menos de 2 segundos.</li>
  <li><strong>Segurança:</strong> dados do cartão são enviados via HTTPS e nunca aparecem no front-end.</li>
  <li><strong>Usabilidade:</strong> o formulário de endereço é claro e não confunde o usuário.</li>
  <li><strong>Acessibilidade:</strong> labels são associadas aos campos e o teclado percorre todos os controles.</li>
</ul>

<h3>📊 Matriz de Testes</h3>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; border:1px solid #ddd">Tipo</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Foco</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Exemplos</th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Funcional</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Comportamento</td>
    <td style="padding:0.75rem; border:1px solid #ddd">login, checkout, cadastro</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Performance</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Velocidade</td>
    <td style="padding:0.75rem; border:1px solid #ddd">tempo de resposta, carga</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Segurança</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Proteção</td>
    <td style="padding:0.75rem; border:1px solid #ddd">autenticação, injeção, dados</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Usabilidade</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Experiência</td>
    <td style="padding:0.75rem; border:1px solid #ddd">layout, navegação, clareza</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Acessibilidade</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Inclusão</td>
    <td style="padding:0.75rem; border:1px solid #ddd">teclado, leitores de tela, contraste</td>
  </tr>
</table>

<h3>✏️ Exercício Prático</h3>
<p>Para uma feature simples, escreva:</p>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>2 testes funcionais</li>
  <li>1 teste de performance</li>
  <li>1 teste de segurança</li>
  <li>1 teste de usabilidade ou acessibilidade</li>
</ol>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.guru99.com/functional-vs-non-functional-testing.html" target="_blank">📖 Functional vs Non-Functional Testing</a></li>
  <li><a href="https://www.softwaretestinghelp.com/types-of-non-functional-testing/" target="_blank">📖 Types of Non-Functional Testing</a></li>
  <li><a href="https://www.w3.org/WAI/tutorials/" target="_blank">📖 W3C Web Accessibility Tutorials</a></li>
  <li><a href="https://www.youtube.com/watch?v=k3z3d5w5B1U" target="_blank">🎥 Video: Functional vs Non-Functional Testing</a></li>
</ul>

<h3>🤔 Reflexão Final</h3>
<ol style="margin:1rem 0">
  <li>Qual tipo de teste seu time faz melhor agora?</li>
  <li>Qual tipo de teste é mais fácil de esquecer?</li>
  <li>Qual destes testes teria o maior impacto para seu app agora?</li>
</ol>

<h3>⏭️ Próxima Aula</h3>
<p>Agora que você conhece os tipos de teste, vamos aplicar isso em uma estratégia de automação real. Você verá como escolher o melhor teste para cada cenário.</p>

<h3>🎬 Roteiro de vídeo</h3>
<ul style="margin:1rem 0">
  <li><strong>00:00–00:20</strong> — Abertura: apresentar funcional vs não-funcional.</li>
  <li><strong>00:20–01:30</strong> — Mostrar exemplos reais (checkout): funcionalidade vs performance.</li>
  <li><strong>01:30–02:30</strong> — Demonstração rápida: como priorizar tipos de teste para uma feature.</li>
  <li><strong>02:30–03:00</strong> — Chamado à ação: exercício prático e próximo passo.</li>
</ul>
`,
            resources: [
              { label: "Functional vs Non-Functional Testing", url: "https://www.guru99.com/functional-vs-non-functional-testing.html" },
              { label: "Types of Non-Functional Testing", url: "https://www.softwaretestinghelp.com/types-of-non-functional-testing/" },
              { label: "W3C Web Accessibility Tutorials", url: "https://www.w3.org/WAI/tutorials/" },
              { label: "Video: Functional vs Non-Functional Testing", url: "https://www.youtube.com/watch?v=k3z3d5w5B1U" }
            ]
          }
          ,
          {
            id: "l10",
            title: "Matriz de Risco e Estratégia de Teste",
            duration: "55 min",
            content: `<h2>Matriz de Risco e Estratégia de Teste</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender as dimensões de risco em um projeto</li>
  <li>Construir uma matriz de risco simples</li>
  <li>Priorizar testes com base em impacto e probabilidade</li>
  <li>Definir estratégia de teste alinhada ao negócio</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Nem todos os recursos têm o mesmo valor ou o mesmo risco. A matriz de risco ajuda o time a decidir onde concentrar testes: o que pode falhar com maior impacto e o que tem maior chance de falhar.</p>

<h3>🔍 Como montar a matriz</h3>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Liste os principais fluxos e funcionalidades</li>
  <li>Avalie o impacto de uma falha em cada item</li>
  <li>Avalie a probabilidade de ocorrer uma falha</li>
  <li>Classifique em alto, médio ou baixo</li>
</ol>

<h3>📌 Exemplo</h3>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; border:1px solid #ddd">Funcionalidade</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Impacto</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Probabilidade</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Prioridade</th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Pagamento</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Alto</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Médio</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Alto</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Login</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Alto</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Baixo</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Médio</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Configuração de perfil</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Médio</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Baixo</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Baixo</td>
  </tr>
</table>

<h3>⚙️ Como usar na estratégia de teste</h3>
<ul style="margin:1rem 0">
  <li>Alto risco = testes automáticos e manuais prioritários</li>
  <li>Médio risco = cobertura por casos moldáveis e regressão core</li>
  <li>Baixo risco = validação mínima e uso de testes exploratórios</li>
</ul>

<h3>✏️ Exercício Prático</h3>
<p>Crie uma matriz de risco para um produto que você conhece e identifique três testes que devem ser feitos primeiro.</p>
`,
            resources: [
              { label: "Risk-Based Testing", url: "https://www.tutorialspoint.com/software_testing_dictionary/risk_based_testing.htm" },
              { label: "Prioridade de Teste com Matriz", url: "https://www.guru99.com/risk-based-testing.html" }
            ]
          }
        ]
      },
      {
        id: "c7",
        title: "Automação e Frameworks",
        lessons: [
          {
            id: "l19",
            title: "Escolhendo frameworks e arquiteturas de teste",
            duration: "45 min",
            content: `<h2>Escolhendo frameworks e arquiteturas de teste</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Comparar trade-offs entre Cypress, Playwright, Selenium e headless tools</li>
  <li>Mapear responsabilidades entre unit/integration/E2E</li>
  <li>Escolher padrões que reduzem custo de manutenção</li>
</ul>

<h3>📌 Tópicos</h3>
<ul>
  <li>Critérios de escolha: velocidade, stability, tooling, ecosystem</li>
  <li>Arquiteturas: Page Objects, Screen Objects, Service Layer, Modular suites</li>
  <li>Organização de suites por objetivo (smoke, regression, critical flows)</li>
</ul>

<h3>🔗 Recursos</h3>
<ul>
  <li><a href="https://playwright.dev">Playwright docs</a></li>
  <li><a href="https://www.cypress.io">Cypress docs</a></li>
  <li><a href="https://www.selenium.dev">Selenium</a></li>
</ul>

<h3>✏️ Exercício</h3>
<p>Analise um projeto simples (demo app) e proponha uma arquitetura de testes com justificativa.</p>`
          },
          {
            id: "l20",
            title: "Design de testes para automação sustentável",
            duration: "50 min",
            content: `<h2>Design de testes para automação sustentável</h2>

<h3>✅ Pontos-chave</h3>
<ul>
  <li>Separar claramente unit, integration e E2E</li>
  <li>Priorizar testes rápidos e determinísticos no CI</li>
  <li>Uso de fixtures, mocks e dados parametrizados para reduzir fragilidade</li>
</ul>

<h3>📘 Boas práticas</h3>
<ul>
  <li>Focar em validação de comportamento, não em textos exatos</li>
  <li>Evitar dependências entre testes; tornar cada teste idempotente</li>
  <li>Adicionar retries somente com causa investigada</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Refatore 2 testes E2E de um projeto demo para reduzir flakiness usando fixtures e waits explícitos.</p>`
          }
        ]
      },
      {
        id: "c8",
        title: "Performance Testing",
        lessons: [
          {
            id: "l21",
            title: "Fundamentos de teste de performance",
            duration: "40 min",
            content: `<h2>Fundamentos de teste de performance</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Entender tipos de teste: load, stress, soak, spike</li>
  <li>Definir métricas de sucesso (p95, error rate, throughput)</li>
  <li>Projetar um cenário simples de carga e interpretar resultados</li>
</ul>

<h3>🔍 Ferramentas</h3>
<ul>
  <li>K6/Grafana para scripts e visualização</li>
  <li>JMeter para cargas mais extensas</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Crie um script k6 que simule 50 usuários realizando um fluxo crítico e analise latência p95.</p>`
          }
        ]
      },
      {
        id: "c9",
        title: "Security Testing Basics",
        lessons: [
          {
            id: "l22",
            title: "Noções básicas de segurança para QA",
            duration: "45 min",
            content: `<h2>Noções básicas de segurança para QA</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Conhecer OWASP Top 10 e exemplos práticos</li>
  <li>Integrar scanners básicos (ZAP) em pipeline</li>
  <li>Priorizar vulnerabilidades por risco de negócio</li>
</ul>

<h3>📌 Checklist</h3>
<ul>
  <li>Input validation on server-side</li>
  <li>Auth & session management checks</li>
  <li>Basic XSS and SQLi probes</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Execute OWASP ZAP against a demo app and summarize the top 3 findings with remediation suggestions.</p>`
          }
        ]
      }
    ]
  },
  {
    id: "intermediate",
    slug: "advanced-testing",
    title: "Testes Avançados",
    icon: "bolt",
    color: "#f59e0b",
    description: "Técnicas de teste mais sofisticadas: automação, performance, segurança.",
    level: "Intermediário",
    topics: ["Automação", "Performance", "Segurança", "API Testing"],
    courses: [
      {
        id: "c3",
        title: "Técnicas de Teste",
        lessons: [
          {
            id: "l5",
            title: "Partição de Equivalência e Valor Limite",
            duration: "55 min",
            content: `<h2>Partição de Equivalência e Valor Limite</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Transformar regras de negócio em classes de teste claras e úteis</li>
  <li>Escolher os casos mais valiosos sem perder cobertura</li>
  <li>Encontrar falhas em bordas, limites e condições de transição</li>
  <li>Pensar como um QA estratégico, não apenas como alguém que “preenche tabela”</li>
</ul>

<h3>📊 Por que isso importa</h3>
<p>Boa estratégia de teste não é fazer mais casos. É fazer os casos certos. Partição de equivalência e valor limite ajudam você a concentrar esforço onde há maior risco de falha e onde pequenas decisões de produto podem causar grandes problemas.</p>
<p><strong>Regra prática:</strong> para cada regra, teste um valor representativo válido, um inválido e pelo menos dois valores na borda.</p>

<h3>🧠 O pensamento certo</h3>
<p>Em vez de testar todos os valores possíveis, você agrupa entradas em classes que devem se comportar de forma semelhante. Se uma entrada de uma classe funciona, a maioria das outras da mesma classe tende a funcionar do mesmo jeito. Depois, você valida os pontos de transição entre classes.</p>

<h3>🔍 Como montar as partições</h3>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Entenda a regra de negócio e os limites explícitos ou implícitos</li>
  <li>Separe entradas válidas, inválidas e limites de comportamento</li>
  <li>Escolha um valor representativo de cada classe</li>
  <li>Adicione valores imediatamente abaixo, no limite e acima do limite</li>
</ol>

<h3>📌 Exemplo prático</h3>
<p>Regra: a idade deve estar entre 18 e 65 anos.</p>
<ul style="margin:1rem 0">
  <li><strong>Classe válida:</strong> 18, 25, 65</li>
  <li><strong>Classe inválida:</strong> 17, 66</li>
  <li><strong>Valores limite:</strong> 17, 18, 19, 64, 65, 66</li>
</ul>

<h3>📊 Exemplo de matriz de decisão</h3>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; border:1px solid #ddd">Categoria</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Valores</th>
    <th style="padding:0.75rem; border:1px solid #ddd">Esperado</th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Válido</td>
    <td style="padding:0.75rem; border:1px solid #ddd">25</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Cadastro aceito</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Inválido</td>
    <td style="padding:0.75rem; border:1px solid #ddd">17</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Mensagem de erro exibida</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Limite</td>
    <td style="padding:0.75rem; border:1px solid #ddd">18, 19, 64, 65</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Comportamento consistente e previsível</td>
  </tr>
</table>

<h3>⚠️ Erros comuns</h3>
<ul style="margin:1rem 0">
  <li>Testar apenas valores "bonitos" ou fáceis de lembrar</li>
  <li>Ignorar as bordas entre classes válidas e inválidas</li>
  <li>Esquecer regras adicionais, como formato, obrigatoriedade e dependências</li>
  <li>Confundir “muitos casos” com “boa cobertura”</li>
</ul>

<h3>🧪 Caso de teste guiado</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
Regra: quantidade do pedido deve estar entre 1 e 100.
Casos prioritários:
- 0 -> esperado: bloqueado
- 1 -> esperado: aceito
- 2 -> esperado: aceito
- 99 -> esperado: aceito
- 100 -> esperado: aceito
- 101 -> esperado: bloqueado
</pre>

<h3>✅ O que um QA sênior faz aqui</h3>
<p>Um bom QA não só cria casos. Ele pergunta: qual é o risco real? Quais entradas podem quebrar a regra? Onde o sistema provavelmente falhará primeiro? Essa é a diferença entre testar por hábito e testar com propósito.</p>

<h3>🧪 Exemplo mais realista</h3>
<p>Imagine um fluxo de checkout onde o valor do pedido deve estar entre 1 e 1000 reais para liberar o desconto de primeira compra.</p>
<ul style="margin:1rem 0">
  <li><strong>Classe válida:</strong> 50, 250, 1000</li>
  <li><strong>Classe inválida:</strong> 0, 1001</li>
  <li><strong>Valores de borda:</strong> 0, 1, 2, 999, 1000, 1001</li>
</ul>
<p>Se esse regra estiver implementada de forma inconsistente, o tipo de bug que você provavelmente vai encontrar é: desconto aceito em 1001, bloqueado em 1000 ou mensagem de erro confusa em 999.</p>

<h3>✏️ Exercício Prático</h3>
<p>Escolha uma regra de negócio do seu projeto atual e escreva:</p>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>As classes válidas e inválidas</li>
  <li>Quatro valores de teste em borda</li>
  <li>Um caso que provavelmente revelaria um bug real</li>
</ol>
<p><strong>Desafio extra:</strong> transforme sua resposta em uma tabela de teste pronta para compartilhar com o time.</p>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.guru99.com/equivalence-partitioning.html" target="_blank">📖 Equivalence Partitioning in Software Testing</a></li>
  <li><a href="https://www.softwaretestinghelp.com/boundary-value-analysis/" target="_blank">📖 Boundary Value Analysis Guide</a></li>
  <li><a href="https://www.softwaretestinghelp.com/equivalence-partitioning-boundary-value-analysis/" target="_blank">📖 Equivalence Partitioning + BVA Comparison</a></li>
</ul>
`,
            resources: [
              { label: "Equivalence Partitioning in Software Testing", url: "https://www.guru99.com/equivalence-partitioning.html" },
              { label: "Boundary Value Analysis Guide", url: "https://www.softwaretestinghelp.com/boundary-value-analysis/" },
              { label: "Equivalence Partitioning + BVA Comparison", url: "https://www.softwaretestinghelp.com/equivalence-partitioning-boundary-value-analysis/" }
            ]
          },
          {
            id: "l6",
            title: "Teste Exploratório",
            duration: "60 min",
            content: `<h2>Teste Exploratório</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Saber quando usar exploração livre e quando usar roteiros formais</li>
  <li>Planejar uma sessão com charter claro, escopo e foco em risco</li>
  <li>Usar heurísticas para encontrar defeitos reais de usabilidade, fluxo e integração</li>
  <li>Transformar observações em achados úteis para o time</li>
</ul>

<h3>📊 Por que isso importa</h3>
<p>Testes exploratórios são fundamentais quando o sistema é novo, o fluxo é complexo ou o risco é alto. Eles ajudam a descobrir problemas que não aparecem em cenários padronizados, sobretudo em áreas onde o usuário real tende a agir de forma inesperada.</p>
<p><strong>Regra prática:</strong> nunca entre em uma sessão sem uma hipótese. Pergunte: “o que pode dar errado aqui?” e “onde eu esperaria um comportamento estranho?”</p>

<h3>🧭 O ciclo de uma sessão exploratória</h3>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Defina um charter: o que você vai explorar e por quê</li>
  <li>Teste com hipóteses e curiosidade, não apenas com passos fixos</li>
  <li>Observe comportamento, mensagens, tempos de resposta e estados inesperados</li>
  <li>Registre achados com contexto, impacto e evidência</li>
  <li>Feche com aprendizado, próximos passos e gaps de cobertura</li>
</ol>

<h3>✨ Quando usar</h3>
<ul style="margin:1rem 0">
  <li>Em funcionalidades novas ou pouco conhecidas</li>
  <li>Quando há pouco tempo para uma cobertura inicial</li>
  <li>Para investigar bugs intermitentes ou falhas de experiência</li>
  <li>Para validar fluxos reais de usuário, não apenas requisitos escritos</li>
</ul>

<h3>📌 Exploratório vs Roteirizado</h3>
<table style="width:100%; border-collapse:collapse; margin:1rem 0">
  <tr style="background:#f5f5f5; border:1px solid #ddd">
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd">Exploratória</th>
    <th style="padding:0.75rem; text-align:left; border:1px solid #ddd">Roteirizada</th>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Descoberta e aprendizado</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Validação contra requisitos</td>
  </tr>
  <tr style="background:#f9f9f9; border:1px solid #ddd">
    <td style="padding:0.75rem; border:1px solid #ddd">Flexível e adaptativa</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Repetível e auditável</td>
  </tr>
  <tr>
    <td style="padding:0.75rem; border:1px solid #ddd">Boa para explorar o desconhecido</td>
    <td style="padding:0.75rem; border:1px solid #ddd">Boa para regressão e compliance</td>
  </tr>
</table>

<h3>📌 Exemplo de charter</h3>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
Charter: explorar o fluxo de pagamento em um cenário de falha de cartão.
Objetivo: encontrar problemas de validação, feedback e recuperação de erro.
Escopo: página de pagamento, seleção de cupom e retorno após falha.
Critério de sucesso: identificar pelo menos 3 riscos ou bugs com impacto real.
</pre>

<h3>🧭 Heurísticas úteis</h3>
<ul style="margin:1rem 0">
  <li><strong>CRUD</strong>: criar, ler, atualizar, excluir</li>
  <li><strong>SFDPOT</strong>: estrutura, função, dados, plataforma, operações, tempo</li>
  <li><strong>FEW HICCUPPS</strong>: feedback, erro, workflow, compatibilidade, complexidade, performance, permissões, segurança</li>
  <li><strong>Ambiente</strong>: navegador diferente, rede lenta, sessão expirada, usuário sem permissão</li>
</ul>

<h3>📝 Como registrar achados</h3>
<p>Documente o que importa: o passo feito, o comportamento observado, o risco e a evidência. Evite relatórios vagos como “não funcionou”.</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
Sessão: checkout
Passo: tentar pagar com CVV vazio
Observação: a mensagem de erro é genérica e o botão continua ativo
Impacto: confusão do usuário e possível envio indevido
Prioridade: alta
</pre>

<h3>✅ O que um QA sênior faz aqui</h3>
<p>Ele não apenas testa. Ele usa a sessão para aprender sobre o produto, desafiar suposições e encontrar riscos antes que eles se tornem bugs caros em produção. A melhor exploração gera insight, não só relatório.</p>

<h3>🧭 Exemplo de sessão real</h3>
<p>Supor que você esteja explorando um fluxo de login com MFA. Um charter forte seria: “Validar a experiência de recuperação de conta quando o código de verificação é enviado com atraso e o usuário tenta reutilizar o mesmo código.”</p>
<p>Em uma sessão assim, você provavelmente vai olhar para:</p>
<ul style="margin:1rem 0">
  <li>Mensagens de erro confusas ou inconsistentes</li>
  <li>Comportamento após múltiplos tentativos</li>
  <li>Tempo limite do código e recuperação de estado</li>
  <li>Experiência do usuário em celular e desktop</li>
</ul>

<h3>✏️ Exercício Prático</h3>
<p>Escreva um charter para uma funcionalidade de login com MFA e responda:</p>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Quais áreas você exploraria primeiro?</li>
  <li>Que risco de segurança ou usabilidade você tentaria encontrar?</li>
  <li>Que evidência você registraria para o time?</li>
</ol>
<p><strong>Desafio extra:</strong> escreva 3 hipóteses de teste antes de começar a sessão.</p>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.ministryoftesting.com/dojo/lessons/exploratory-testing" target="_blank">📖 Exploratory Testing Guide</a></li>
  <li><a href="https://www.satisfice.com/blog/archives/104" target="_blank">📖 James Bach: Exploratory Testing</a></li>
  <li><a href="https://www.youtube.com/watch?v=8lTMatA8ega" target="_blank">🎥 Vídeo: Exploratory Testing Explained</a></li>
</ul>

<h3>🤔 Reflexão</h3>
<p>Exploração bem feita é uma forma de aprendizado acelerado. Ela revela não só bugs, mas também lacunas de entendimento e oportunidades de melhoria.</p>
`,
            resources: [
              { label: "Exploratory Testing Guide", url: "https://www.ministryoftesting.com/dojo/lessons/exploratory-testing" },
              { label: "James Bach Exploratory Testing", url: "https://www.satisfice.com/blog/archives/104" },
              { label: "Vídeo: Exploratory Testing Explained", url: "https://www.youtube.com/watch?v=8lTMatA8ega" }
            ]
          }
          ,
          {
            id: "l11",
            title: "Testes de Regressão e Automação Inteligente",
            duration: "55 min",
            content: `<h2>Testes de Regressão e Automação Inteligente</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender o propósito dos testes de regressão</li>
  <li>Decidir quais casos merecem automação</li>
  <li>Evitar automação excessiva e de baixo valor</li>
  <li>Construir uma suite de regressão sustentável</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Teste de regressão é a prova de que as mudanças não quebraram o que já funcionava. Automação ajuda, mas só se for aplicada nos casos mais estáveis, críticos e repetitivos.</p>

<h3>🔍 Quando automatizar</h3>
<ul style="margin:1rem 0">
  <li>Fluxos críticos do negócio que são executados a cada release</li>
  <li>Casos repetitivos e fáceis de parametrizar</li>
  <li>Configurações estáveis que não mudam constantemente</li>
  <li>Testes com alto custo manual e baixo custo de manutenção</li>
</ul>

<h3>⚠️ Quando evitar automação</h3>
<ul style="margin:1rem 0">
  <li>Fluxos muito instáveis ou em constante mudança</li>
  <li>Testes com alto valor exploratório</li>
  <li>Casos de borda esporádicos sem impacto crítico</li>
</ul>

<h3>📌 Estrutura de uma suite de regressão</h3>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Casos críticos que não podem falhar em produção</li>
  <li>Funcionalidades principais com alto volume de uso</li>
  <li>Regras de negócio sensíveis a mudanças</li>
  <li>Testes automatizados para cobertura rápida de regressão</li>
</ol>

<h3>✏️ Exercício Prático</h3>
<p>Liste cinco casos de regressão para um checkout online e classifique quais devem ser automatizados e quais devem permanecer manuais.</p>
`,
            resources: [
              { label: "Regression Testing Best Practices", url: "https://www.guru99.com/regression-testing.html" },
              { label: "Automation Strategy", url: "https://www.tutorialspoint.com/software_testing_dictionary/automation_testing.htm" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "mobile",
    slug: "mobile-testing",
    title: "Trilha de Testes Mobile",
    icon: "mobile",
    color: "#22c55e",
    description: "Trilha única para testes mobile em emuladores, simuladores e dispositivos reais, com foco em Appium, WebdriverIO e qualidade em produção.",
    level: "Intermediário",
    topics: ["Appium", "WebdriverIO", "Android", "iOS", "Emuladores", "Dispositivos reais"],
    courses: [
      {
        id: "c5",
        title: "Fundamentos de Testes Mobile",
        lessons: [
          {
            id: "l13",
            title: "Por que testes mobile são diferentes",
            duration: "45 min",
            content: `<h2>Por que testes mobile são diferentes</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender as diferenças entre web, desktop e mobile</li>
  <li>Reconhecer riscos específicos de apps mobile</li>
  <li>Usar uma estratégia de teste adequada para dispositivos e sistemas operacionais</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Mobile é uma camada de complexidade extra: você precisa pensar em orientação, resolução, teclado virtual, conectividade, bateria, notificações, permissões e comportamento real do sistema operacional. O QA que ignora isso tende a testar apenas o “happy path” e perder erros importantes.</p>

<h3>🔍 O que muda em mobile</h3>
<ul style="margin:1rem 0">
  <li><strong>Layout responsivo:</strong> o mesmo app muda em tela, tamanho de fonte e sensores</li>
  <li><strong>Input e gesto:</strong> swipes, tap, long press e keyboard virtual são centrais</li>
  <li><strong>Contextos de execução:</strong> emulador, simulador, device real, rede instável e modo avião</li>
  <li><strong>Confiabilidade:</strong> um bug em mobile pode aparecer apenas em um dispositivo específico</li>
</ul>

<h3>✅ Estratégia prática</h3>
<p>Seu plano de testes deve incluir:</p>
<ul>
  <li>Fluxo principal</li>
  <li>Fluxo com interrupção (ligar/desligar rede, notificações, chamada)</li>
  <li>Orientação portrait/landscape</li>
  <li>Permissões e retorno do app</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Escolha um app mobile que você usa e liste 3 cenários em que o comportamento pode variar entre device, OS ou rede.</p>
`,
            resources: [
              { label: "Appium Concepts", url: "https://appium.io/docs/en/latest/" },
              { label: "Mobile testing checklist", url: "https://www.browserstack.com/guide/mobile-testing" }
            ]
          },
          {
            id: "l14",
            title: "Appium e locators mobile",
            duration: "50 min",
            content: `<h2>Appium e locators mobile</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender como Appium conecta em dispositivos e emuladores</li>
  <li>Usar locators estáveis em apps nativos e híbridos</li>
  <li>Construir um fluxo de automação mais confiável</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Em mobile, a escolha do locator é uma decisão crítica. O ideal é usar accessibility id quando disponível, seguida de resource-id, content-desc e, por fim, texto ou XPath, quando necessário.</p>

<h3>🧩 Estratégia de locator</h3>
<ul style="margin:1rem 0">
  <li><strong>Accessibility ID:</strong> mais estável para apps nativos</li>
  <li><strong>resource-id:</strong> bom quando a UI tem identificadores estruturados</li>
  <li><strong>text:</strong> útil como fallback, mas frágil para mudanças de copy</li>
  <li><strong>XPath:</strong> última opção; só use se não houver uma estratégia melhor</li>
</ul>

<h3>⚠️ Erros comuns</h3>
<ul>
  <li>Dependência excessiva de texto visível</li>
  <li>Locator baseado em índice da lista</li>
  <li>Automação que não espera o app carregar corretamente</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Compare dois locators em uma tela de login mobile e justifique qual é o melhor para regressão.</p>
`,
            resources: [
              { label: "Appium locator strategy", url: "https://appium.io/docs/en/latest/intro/" },
              { label: "WebdriverIO mobile docs", url: "https://webdriver.io/docs/mobile" }
            ]
          },
          {
            id: "l15",
            title: "Emulador, simulador e device real",
            duration: "40 min",
            content: `<h2>Emulador, simulador e device real</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Diferenciar emulador, simulador e device real</li>
  <li>Escolher o melhor ambiente para cada fase do projeto</li>
  <li>Construir uma estratégia de teste por estágio</li>
</ul>

<h3>📊 Quando usar cada um</h3>
<ul style="margin:1rem 0">
  <li><strong>Emulador:</strong> automação rápida, baixo custo, ideal para CI</li>
  <li><strong>Simulador:</strong> boa aproximação de iOS ou Android em desenvolvimento</li>
  <li><strong>Device real:</strong> valida comportamento real, sensores, rede e usabilidade</li>
</ul>

<h3>✅ Recomendação de qualidade</h3>
<p>Use emuladores na rotina de CI e no dia a dia de desenvolvimento; use devices reais para validar regressão crítica, autenticação, performance e UX real.</p>

<h3>✏️ Exercício</h3>
<p>Descreva uma matriz de cobertura para um app com login, checkout e push notification.</p>
`,
            resources: [
              { label: "Android Emulator docs", url: "https://developer.android.com/studio/run/emulator" },
              { label: "iOS Simulator docs", url: "https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator" }
            ]
          }
        ]
      },
      {
        id: "c6",
        title: "Automação Mobile e CI",
        lessons: [
          {
            id: "l16",
            title: "Gestos, scroll e orientação",
            duration: "45 min",
            content: `<h2>Gestos, scroll e orientação</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Automatizar swipe, tap, long press e scroll</li>
  <li>Trabalhar com orientação portrait e landscape</li>
  <li>Validar comportamento de UI em diferentes estados do app</li>
</ul>

<h3>📌 Cenários críticos</h3>
<ul style="margin:1rem 0">
  <li>Lista longa e scroll de elementos</li>
  <li>Botões fora da área visível</li>
  <li>Troca de orientação durante o fluxo</li>
  <li>Teclado virtual escondendo ações</li>
</ul>

<h3>✅ Boas práticas</h3>
<p>Prefira ações baseadas em estado e estrutura do app em vez de coordenadas absolutas. Isso melhora confiabilidade e reduz flakiness.</p>
`,
            resources: [
              { label: "WebdriverIO touch actions", url: "https://webdriver.io/docs/api/browser/touchAction" }
            ]
          },
          {
            id: "l17",
            title: "CI/CD para apps mobile",
            duration: "50 min",
            content: `<h2>CI/CD para apps mobile</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Adicionar automação mobile em pipelines</li>
  <li>Executar suites em emuladores headless</li>
  <li>Configurar evidências e falhas com boa visibilidade</li>
</ul>

<h3>📊 O que um pipeline mobile precisa ter</h3>
<ul style="margin:1rem 0">
  <li>Ambiente de build estável</li>
  <li>Emuladores ou dispositivos provisionados</li>
  <li>Screenshots e vídeos em falha</li>
  <li>Resumo legível de status e regressão</li>
</ul>

<h3>✅ Regra prática</h3>
<p>Se o teste não produz evidência clara, ele não é um teste de qualidade no CI. Um pipeline sem logs e screenshots perde valor rapidamente.</p>
`,
            resources: [
              { label: "GitHub Actions docs", url: "https://docs.github.com/actions" },
              { label: "Appium CI guide", url: "https://appium.io/docs/en/latest/guides/running-appium-ci/" }
            ]
          },
          {
            id: "l18",
            title: "Qualidade e métricas mobile",
            duration: "45 min",
            content: `<h2>Qualidade e métricas mobile</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Medir qualidade em apps mobile com foco em confiabilidade e UX</li>
  <li>Interpretar falhas reais em produção</li>
  <li>Usar métricas para apoiar decisão de release</li>
</ul>

<h3>📊 Indicadores importantes</h3>
<ul style="margin:1rem 0">
  <li><strong>Crash rate:</strong> falhas em produção</li>
  <li><strong>Tempo de carregamento:</strong> impacta retenção e conversão</li>
  <li><strong>Taxa de sucesso de fluxo crítico:</strong> login, checkout, pagamento</li>
</ul>

<h3>✅ Conclusão</h3>
<p>Mobile testing não é só “clicar no botão”. É garantir que o app funcione em cenários reais, com contexto de usuário e qualidade de experiência. Essa é a diferença entre um app que “abre” e um app que entrega valor.</p>
`,
            resources: [
              { label: "Firebase Performance", url: "https://firebase.google.com/products/performance" },
              { label: "Crashlytics", url: "https://firebase.google.com/products/crashlytics" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "senior",
    slug: "mastery",
    title: "Maestria em QA",
    icon: "crown",
    color: "#8b5cf6",
    description: "Liderança em qualidade, estratégia de testes, mentoring.",
    level: "Sênior",
    topics: ["Liderança", "Estratégia", "CI/CD", "Arquitetura de Testes"],
    courses: [
      {
        id: "c4",
        title: "Agile e Scrum",
        lessons: [
          {
            id: "l7",
            title: "Cerimônias Agile",
            duration: "55 min",
            content: `<h2>Cerimônias Agile</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender por que o QA precisa participar ativamente das cerimônias Agile</li>
  <li>Trazer valor em refinement, planning, review e retrospective</li>
  <li>Usar cada reunião para reduzir risco, retrabalho e divergência de entendimento</li>
  <li>Transformar discussão em ação concreta para a equipe</li>
</ul>

<h3>📊 Por que isso importa</h3>
<p>Em Agile, a qualidade não é algo que acontece no fim. Ela é construída em cada decisão, cada conversa e cada compromisso. O QA sênior ajuda o time a tomar decisões melhores antes de escrever código ou de encerrar uma sprint.</p>
<p><strong>Regra prática:</strong> se a reunião não gera uma ação, ela não resolveu o problema. Cada cerimônia deve terminar com uma decisão, um risco visível ou um próximo passo claro.</p>

<h3>🧩 O papel do QA em cada cerimônia</h3>

<h4>Backlog Refinement</h4>
<p>Objetivo: deixar a história clara antes do planejamento.</p>
<ul style="margin:1rem 0">
  <li>Levantar riscos, dependências e cenários de falha</li>
  <li>Contribuir com critérios de aceitação testáveis</li>
  <li>Questões como “o que pode dar errado?” são tão importantes quanto “o que deve funcionar?”</li>
</ul>

<h4>Sprint Planning</h4>
<p>Objetivo: decidir o que será entregue e como.</p>
<ul style="margin:1rem 0">
  <li>Ajuda a decompor histórias em entregas testáveis</li>
  <li>Identifica o que precisa de automação, regressão ou validação manual</li>
  <li>Contribui para uma definição de pronto mais realista</li>
</ul>

<h4>Daily Standup</h4>
<p>Objetivo: manter o time alinhado e resolver bloqueios rapidamente.</p>
<ul style="margin:1rem 0">
  <li>Compartilha status de teste, ambientes e impedimentos</li>
  <li>Conecta risco técnico a impacto de negócio</li>
  <li>Ajuda a impedir que problemas pequenos se tornem grandes atrasos</li>
</ul>

<h4>Sprint Review</h4>
<p>Objetivo: mostrar valor e aprender com o que foi entregue.</p>
<ul style="margin:1rem 0">
  <li>Apresenta evidências de qualidade com foco em comportamento real</li>
  <li>Mostra onde o produto atende ou não aos critérios de aceitação</li>
  <li>Ajuda stakeholders a entender impacto de bugs, risco e melhorias</li>
</ul>

<h4>Retrospective</h4>
<p>Objetivo: melhorar o processo de forma contínua.</p>
<ul style="margin:1rem 0">
  <li>Mostra onde o time perdeu tempo, repetiu trabalho ou deixou risco passar</li>
  <li>Sugere melhorias concretas para reduzir retrabalho</li>
  <li>Transforma aprendizados em experimentos pequenos e mensuráveis</li>
</ul>

<h3>📌 Artefatos que fazem diferença</h3>
<ul style="margin:1rem 0">
  <li>Checklist de qualidade para cada história</li>
  <li>Mapa breve de riscos e dependências</li>
  <li>Lista de cenários de regressão prioritários</li>
  <li>Resumo claro de bugs e observações para a Review</li>
</ul>

<h3>⚠️ Anti-padrões comuns</h3>
<ul style="margin:1rem 0">
  <li>QA entra muito tarde, quando a história já está quase pronta</li>
  <li>Reuniões viram status sem decisão ou ação</li>
  <li>Critérios de aceitação são vagos e não testáveis</li>
  <li>O time trata qualidade como responsabilidade exclusiva do QA</li>
</ul>

<h3>🧠 O que um QA sênior faz de verdade</h3>
<p>Ele aumenta a qualidade das decisões. Em vez de apenas “validar”, ele ajuda a equipe a enxergar risco, priorizar esforço e evitar retrabalho caro. A melhor contribuição em uma cerimônia raramente é um comentário longo; é uma pergunta certeira.</p>

<h3>✅ Checklist prático</h3>
<ul style="margin:1rem 0">
  <li>História refinada com critérios claros</li>
  <li>Riscos identificados antes do planejamento</li>
  <li>Definição de pronto descrita de forma objetiva</li>
  <li>Evidência de qualidade disponível para a Review</li>
</ul>

<h3>🧩 Exemplo de reunião real</h3>
<p>Imagine uma história de “checkout com parcelamento”. Em uma reunião de refinement, um QA sênior poderia levar perguntas como:</p>
<ul style="margin:1rem 0">
  <li>O parcelamento é aceito apenas em alguns meios de pagamento?</li>
  <li>O sistema mostra o valor correto em todas as etapas?</li>
  <li>O erro de validação é claro quando o usuário escolhe uma opção inválida?</li>
</ul>
<p>Essas perguntas não só melhoram a história; elas evitam retrabalho e bugs caros depois.</p>

<h3>✏️ Exercício Prático</h3>
<p>Para uma sprint típica, responda:</p>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Que artefato de qualidade você levaria para o Planning?</li>
  <li>Que impedimento você traria para o Standup?</li>
  <li>Que evidência de qualidade você mostraria na Review?</li>
</ol>
<p><strong>Desafio extra:</strong> escreva uma mensagem curta que você diria em uma retrospective para melhorar a qualidade da sprint.</p>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.scrum.org/resources/what-is-scrum" target="_blank">📖 Scrum Guide Overview</a></li>
  <li><a href="https://www.atlassian.com/agile/scrum" target="_blank">📖 Atlassian: Scrum Ceremonies</a></li>
  <li><a href="https://www.youtube.com/watch?v=214j6g0iQFQ" target="_blank">🎥 Video: Scrum Ceremonies Explained</a></li>
</ul>

<h3>🤔 Reflexão</h3>
<p>Em Agile, o QA precisa ser parte do entendimento do produto desde o começo. Isso reduz retrabalho e melhora a qualidade do que realmente entra em produção.</p>
`,
            resources: [
              { label: "Scrum Guide Overview", url: "https://www.scrum.org/resources/what-is-scrum" },
              { label: "Atlassian: Scrum Ceremonies", url: "https://www.atlassian.com/agile/scrum" },
              { label: "Video: Scrum Ceremonies Explained", url: "https://www.youtube.com/watch?v=214j6g0iQFQ" }
            ]
          },
          {
            id: "l8",
            title: "Three Amigos",
            duration: "50 min",
            content: `<h2>Three Amigos</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender o propósito do Three Amigos como prática de alinhamento</li>
  <li>Reconhecer o papel de PO, Dev e QA na conversa</li>
  <li>Preparar uma reunião com foco em valor, risco e critérios claros</li>
  <li>Transformar alinhamento em decisões testáveis e acionáveis</li>
</ul>

<h3>📊 Por que isso importa</h3>
<p>Stories mal entendidas custam caro. Elas geram retrabalho, conversas repetidas e bugs que poderiam ter sido evitados com um alinhamento melhor no começo. O Three Amigos é uma forma de reduzir esse custo antes de começar a construir.</p>
<p><strong>Regra prática:</strong> a melhor reunião não é a mais longa; é a que elimina ambiguidade. Se o time sai sem entender o problema, a história ainda não está pronta.</p>

<h3>🧩 Como funciona a dinâmica</h3>
<p>Em um Three Amigos, cada papel traz uma perspectiva diferente:</p>
<ul style="margin:1rem 0">
  <li><strong>PO:</strong> valor do usuário, contexto e critério de sucesso</li>
  <li><strong>Dev:</strong> viabilidade técnica, dependências e esforço</li>
  <li><strong>QA:</strong> risco, bordas, comportamento inesperado e cobertura de teste</li>
</ul>

<h3>📌 O que fazer antes da reunião</h3>
<ul style="margin:1rem 0">
  <li>Leia a história com atenção e anote pontos ambíguos</li>
  <li>Verifique se os critérios de aceitação são claros e testáveis</li>
  <li>Liste 2 ou 3 riscos que merecem discussão</li>
  <li>Prepare uma pergunta que mostre o que você quer aprender</li>
</ul>

<h3>📝 Exemplo real</h3>
<p>História: “Como usuário, quero recuperar minha senha para continuar usando a plataforma.”</p>
<ul>
  <li><strong>PO:</strong> “O usuário deve conseguir redefinir a senha em até 5 minutos e receber confirmação clara.”</li>
  <li><strong>Dev:</strong> “Vamos usar um token temporário e validar expiração de sessão.”</li>
  <li><strong>QA:</strong> “E se o link expirar? E se o usuário tentar usar o mesmo link duas vezes? O fluxo é seguro?”</li>
</ul>

<h3>🎯 O que um QA sênior traz para a mesa</h3>
<ul style="margin:1rem 0">
  <li>Riscos não óbvios: segurança, acessibilidade, performance e dados sensíveis</li>
  <li>Questões de usabilidade e recuperação de erro</li>
  <li>Critérios de aceite que podem ser testados de fato</li>
  <li>Decisões claras para evitar dúvidas depois</li>
</ul>

<h3>🧾 Checklist de saída</h3>
<ul style="margin:1rem 0">
  <li>Critérios de aceitação claros e completos</li>
  <li>Riscos levantados e priorizados</li>
  <li>Dependências técnicas visíveis</li>
  <li>Próximos passos e responsáveis alinhados</li>
</ul>

<h3>⚠️ Problemas comuns</h3>
<ul style="margin:1rem 0">
  <li>Reunião longa demais sem foco em valor</li>
  <li>PO descreve soluções em vez de problemas</li>
  <li>QA pede testes sem entender o fluxo completo</li>
  <li>Dev assume que comportamento óbvio para ele é óbvio para todos</li>
</ul>

<h3>✅ Resultado esperado</h3>
<p>Ao final do Three Amigos, a equipe deve sair com um entendimento compartilhado da história, uma lista clara de riscos e um conjunto de critérios de aceitação mais fortes. Essa é a diferença entre “conversar sobre a tarefa” e “alignar a entrega”.</p>

<h3>🧱 Exemplo de saída do Three Amigos</h3>
<p>Para a história “recuperar minha senha”, um resultado sólido do alinhamento seria:</p>
<ul style="margin:1rem 0">
  <li><strong>PO:</strong> confirmar que o usuário deve receber confirmação visual e um prazo claro para o link</li>
  <li><strong>Dev:</strong> validar a expiração do token e a política de reenvio</li>
  <li><strong>QA:</strong> levantar riscos de segurança, fluxo de erro e experiência em dispositivos móveis</li>
</ul>
<p>Essa saída deixa a história muito mais preparada para implementação.</p>

<h3>✏️ Exercício Prático</h3>
<p>Para a história abaixo, escreva o que cada papel deve levantar:</p>
<pre style="background:#f5f5f5; padding:1rem; border-radius:0.5rem; overflow-x:auto">
História: Como usuário, quero recuperar minha senha para continuar usando a plataforma.
</pre>
<ol style="margin:1rem 0; list-style-position:inside">
  <li>Liste 2 perguntas de QA sobre segurança e usabilidade</li>
  <li>Liste 1 dependência técnica que o Dev deve validar</li>
  <li>Liste 1 critério de aceitação que o PO deve confirmar</li>
</ol>
<p><strong>Desafio extra:</strong> transforme isso em um checklist de alinhamento de 5 pontos.</p>

<h3>📚 Recursos</h3>
<ul style="margin:1rem 0">
  <li><a href="https://www.agilealliance.org/glossary/three-amigos" target="_blank">📖 Agile Alliance: Three Amigos</a></li>
  <li><a href="https://www.atlassian.com/agile/three-amigos" target="_blank">📖 Atlassian: Three Amigos Explained</a></li>
  <li><a href="https://www.youtube.com/watch?v=DsGbknFYUjA" target="_blank">🎥 Video: Three Amigos in Agile</a></li>
</ul>

<h3>🤔 Reflexão</h3>
<p>Three Amigos é uma prática simples, mas poderosa. Quando bem feita, ela reduz retrabalho e melhora muito a qualidade das entregas.</p>
`,
            resources: [
              { label: "Agile Alliance: Three Amigos", url: "https://www.agilealliance.org/glossary/three-amigos" },
              { label: "Atlassian: Three Amigos Explained", url: "https://www.atlassian.com/agile/three-amigos" },
              { label: "Video: Three Amigos in Agile", url: "https://www.youtube.com/watch?v=DsGbknFYUjA" }
            ]
          }
          ,
          {
            id: "l12",
            title: "Definition of Done e Qualidade em Agile",
            duration: "55 min",
            content: `<h2>Definition of Done e Qualidade em Agile</h2>

<h3>🎯 Objetivos de Aprendizado</h3>
<p>Após esta aula, você será capaz de:</p>
<ul>
  <li>Entender o papel do Definition of Done no processo Scrum</li>
  <li>Conectar DoD com qualidade e responsabilidade do time</li>
  <li>Escrever itens de DoD que realmente aumentam confiança</li>
  <li>Aplicar DoD para evitar entregas incompletas ou mal testadas</li>
</ul>

<h3>📊 Resumo Executivo</h3>
<p>Definition of Done é a lista mínima que garante que uma história não só foi concluída, mas também testada, revisada e pronta para ser entregue. Ela estabelece um padrão comum de qualidade para o time.</p>

<h3>📌 Itens comuns de DoD</h3>
<ul style="margin:1rem 0">
  <li>Código revisado e integrado</li>
  <li>Testes automatizados ou manuais executados</li>
  <li>Critérios de aceitação atendidos</li>
  <li>Documentação atualizada se necessário</li>
  <li>Critérios de segurança e performance verificados</li>
</ul>

<h3>🧠 Papel do QA sênior</h3>
<p>O QA sênior ajuda a transformar DoD em medidas práticas e evita itens vagos. Não basta ter “testes feitos”; é preciso saber quais testes entregam valor real.</p>

<h3>⚠️ Anti-padrões</h3>
<ul style="margin:1rem 0">
  <li>DoD muito curto: “código pronto” sem validação</li>
  <li>DoD muito longo: checklist inatingível que atrasa entrega</li>
  <li>Itens que não são verificáveis ou não agregam qualidade</li>
</ul>

<h3>✏️ Exercício Prático</h3>
<p>Escreva cinco itens de Definition of Done para uma história de “recuperar senha” e explique por que cada item protege a qualidade.</p>
`,
            resources: [
              { label: "Definition of Done Guide", url: "https://www.scrum.org/resources/blog/definition-of-done" },
              { label: "Quality in Agile", url: "https://www.atlassian.com/agile/definition-of-done" }
            ]
          }
        ]
      },
      {
        id: "c10",
        title: "Estratégia e Arquitetura de Testes",
        lessons: [
          {
            id: "l23",
            title: "Construindo uma estratégia de testes efetiva",
            duration: "50 min",
            content: `<h2>Construindo uma estratégia de testes efetiva</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Aprender a mapear risco e priorizar cobertura de testes</li>
  <li>Alinhar critérios de aceitação e Definition of Done com Produto</li>
  <li>Definir políticas de automação e níveis de teste</li>
</ul>

<h3>📌 Estrutura</h3>
<ul>
  <li>Risco → prioridade → tipo de teste</li>
  <li>Critérios de aceitação testáveis</li>
  <li>Políticas de revisão e owner dos testes</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Crie um plano de testes de alto nível para uma nova feature e identifique 5 riscos prioritários.</p>`
          }
        ]
      },
      {
        id: "c11",
        title: "Observability e Métricas",
        lessons: [
          {
            id: "l24",
            title: "Métricas úteis para avaliar qualidade",
            duration: "45 min",
            content: `<h2>Métricas úteis para avaliar qualidade</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Entender métricas essenciais: MTTR, defect density, flakiness, coverage</li>
  <li>Usar métricas para tomar decisões, não para punir equipes</li>
  <li>Construir dashboards simples para stakeholders</li>
</ul>

<h3>📊 Exemplos</h3>
<ul>
  <li>MTTR (mean time to recovery)</li>
  <li>Defect escape rate (issues found in production)</li>
  <li>Test reliability / flakiness rate</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Monte um pequeno dashboard com três métricas chave e explique a ação que cada métrica recomenda.</p>`
          }
        ]
      },
      {
        id: "c12",
        title: "Mentoring e Coaching",
        lessons: [
          {
            id: "l25",
            title: "Como mentorar QAs e elevar o time",
            duration: "40 min",
            content: `<h2>Como mentorar QAs e elevar o time</h2>

<h3>🎯 Objetivos</h3>
<ul>
  <li>Aprender técnicas práticas de feedback e coaching</li>
  <li>Praticar pair-testing e pair-programming para transferir conhecimento</li>
  <li>Definir planos de crescimento e habilidades mensuráveis</li>
</ul>

<h3>📌 Atividades</h3>
<ul>
  <li>Sessões de revisão de teste e código com foco em aprendizado</li>
  <li>Planos de desenvolvimento individuais (IDPs)</li>
  <li>Como realizar entrevistas técnicas e avaliar candidatos</li>
</ul>

<h3>✏️ Exercício</h3>
<p>Prepare um roteiro de 30 minutos para uma sessão de mentoring com um QA júnior, incluindo objetivos e follow-ups.</p>`
          }
        ]
      }
    ]
  }
];
