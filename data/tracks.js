window.TG_QAWAY_TRACKS = [
  {
    id: "starter",
    slug: "guild-initiation",
    title: "🚀 Iniciação da Guilda",
    icon: "🚀",
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
            duration: "40 min",
            content: "<h3>QA é mais que encontrar bugs</h3><p>Qualidade de software é criar <strong>confiança</strong> no produto antes dele chegar ao usuário. Um QA competente não corre atrás de bugs — ele previne que eles apareçam.</p><h3>O que um QA profissional faz</h3><ul><li><strong>Entende risco:</strong> 'Qual funcionalidade, se quebrar, machuca o negócio mais?&apos;</li><li><strong>Cria cenários:</strong> Não só 'happy path' — pensa em edge cases, erros, concorrência</li><li><strong>Colabora cedo:</strong> Participa de requisitos, design, code review</li><li><strong>Protege o usuário final:</strong> Cada bug que escapa custa reputação + dinheiro</li></ul><h3>Diferença: QA vs Tester vs QC</h3><ul><li><strong>QA (Quality Assurance):</strong> Estratégia, processos, prevenção — 'como garantimos qualidade?&apos;</li><li><strong>Tester:</strong> Executa testes, reporta bugs — prático</li><li><strong>QC (Quality Control):</strong> Verifica o produto — reativo</li></ul><h3>Por que QA importa para o negócio</h3><p>Segundo Gartner, o custo de um bug em produção é <strong>6x mais caro</strong> que corrigir em desenvolvimento. Um QA que previne bugs escapa está gerando ROI direto.</p><h3>Exemplo real</h3><p>Uma plataforma de e-commerce sem QA rigoroso pode vazar dados de pagamento → LGPD, processos judiciais, perda de clientes. Um QA que testa integração segura e validações de input previne isso.</p>",
            resources: [
              { label: "ISTQB: Tester vs QA", url: "https://www.istqb.org/" },
              { label: "Gartner: Cost of Quality", url: "https://www.gartner.com" }
            ]
          },
          {
            id: "l2",
            title: "Papéis: QA, QC e Tester",
            duration: "35 min",
            content: "<h3>Clareza de papéis = eficiência</h3><p>Muitas organizações confundem esses termos. Entender a diferença é crucial para definir responsabilidades e estruturar o time.</p><h3>QA — Quality Assurance (Proativo)</h3><ul><li><strong>O quê:</strong> Estratégia, processos, prevenção</li><li><strong>Quando:</strong> Desde o início do projeto</li><li><strong>Como:</strong> Participa de requisitos, design, mentoria</li><li><strong>Exemplo:</strong> 'Vamos definir os critérios de aceite? Como testamos para concorrência? Que edge cases faltam?&apos;</li></ul><h3>QC — Quality Control (Verificador)</h3><ul><li><strong>O quê:</strong> Verifica se o produto atende especificações</li><li><strong>Quando:</strong> Após desenvolvimento (reativo)</li><li><strong>Como:</strong> Valida contra specs, reporta conformidade</li><li><strong>Exemplo:</strong> 'Este campo deve ser obrigatório? Está validando?&apos;</li></ul><h3>Tester (Executor)</h3><ul><li><strong>O quê:</strong> Executa planos de teste</li><li><strong>Quando:</strong> Durante a fase de teste</li><li><strong>Como:</strong> Manual ou automação</li><li><strong>Exemplo:</strong> 'Vou rodar 50 casos de teste neste campo&apos;</li></ul><h3>A realidade moderna</h3><p>Em times Agile/DevOps, esses papéis se mesclam. <strong>Um QA moderno faz tudo:</strong> estratégia + execução + automação. A diferença é <strong>mentalidade:</strong> QA pensa 'como prevenimos?' enquanto Tester pensa 'como encontramos?'</p>",
            resources: [
              { label: "ISTQB Glossário", url: "https://www.istqb.org/certification-path-root/istqb-glossary.html" }
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
            duration: "45 min",
            content: "<h3>O SDLC (Software Development Lifecycle)</h3><p>Existem diferentes modelos, mas todos têm fases comuns:</p><ul><li><strong>1. Planejamento:</strong> Visão do produto, escopo inicial</li><li><strong>2. Requisitos:</strong> O que o sistema deve fazer (specs, user stories)</li><li><strong>3. Design:</strong> Como implementar (arquitetura, UI/UX)</li><li><strong>4. Desenvolvimento:</strong> Developers escrevem código</li><li><strong>5. Testes:</strong> QA valida contra requisitos</li><li><strong>6. Deploy:</strong> Release para produção</li><li><strong>7. Manutenção:</strong> Suporte, patches, melhorias</li></ul><h3>Onde QA se encaixa (tradicional)</h3><p>Historicamente QA estava só na fase 5 (Testes) — reativo, encontrando bugs já criados.</p><h3>Shift-left: QA desde o início</h3><p><strong>Shift-left = trazer QA para perto do início.</strong> Isso significa:</p><ul><li><strong>Em Requisitos:</strong> QA faz perguntas: 'Como testamos isso? Que edge cases faltam? Qual é o critério de aceite?&apos;</li><li><strong>Em Design:</strong> QA contribui na testabilidade: 'Como vamos automatizar? Precisamos de dados de teste?&apos;</li><li><strong>Em Dev:</strong> QA faz code review (no contexto de testes), propõe test data, setup</li><li><strong>Em Testes:</strong> QA valida com inteligência, não só marca checklist</li></ul><h3>Benefício concreto do Shift-left</h3><p>Um bug encontrado em requisitos custa R$ 100 corrigir. O mesmo bug encontrado em produção custa R$ 10.000. Shift-left reduz bugs em produção em até 80%.</p><h3>Agile muda tudo</h3><p>Em Agile, não existe fase separada de 'testes'. QA trabalha integrado com dev desde o dia 1 da sprint. Testes são parte da DoD (Definition of Done).</p>",
            resources: [
              { label: "IBM: SDLC Models", url: "https://www.ibm.com/topics/sdlc" },
              { label: "Shift-left Testing", url: "https://www.stickyminds.com/shift-left-testing" }
            ]
          },
          {
            id: "l4",
            title: "Testes funcionais vs não-funcionais",
            duration: "45 min",
            content: "<h3>Dimensão 1: Testes Funcionais</h3><p><strong>Pergunta:</strong> O sistema faz o que foi prometido?</p><ul><li><strong>O quê:</strong> Validam comportamentos específicos</li><li><strong>Exemplos:</strong><ul><li>&apos;Usuário consegue fazer login com email válido?&apos;</li><li>&apos;Compra com descupo aplica corretamente?&apos;</li><li>&apos;API retorna 404 para ID inexistente?&apos;</li></ul></li><li><strong>Como testar:</strong> Casos de teste, manual ou automação</li><li><strong>Métrica:</strong> % de funcionalidades validadas</li></ul><h3>Dimensão 2: Testes Não-Funcionais</h3><p><strong>Pergunta:</strong> Como o sistema se comporta em condições especiais?</p><ul><li><strong>Performance:</strong> 'Página carrega em < 2 segundos com 1000 usuários?&apos;</li><li><strong>Segurança:</strong> 'Dados sensíveis estão criptografados? Resiste a SQL Injection?&apos;</li><li><strong>Acessibilidade:</strong> 'Usuário cego consegue usar com screen reader?&apos;</li><li><strong>Usabilidade:</strong> 'Interface é intuitiva? Botões são clicáveis?&apos;</li><li><strong>Confiabilidade:</strong> 'Sistema se recupera de falhas? Dados são consistentes?&apos;</li><li><strong>Escalabilidade:</strong> 'Funciona com 100x mais dados?&apos;</li></ul><h3>A Pirâmide</h3><p>Em um projeto típico:</p><ul><li>70% testes funcionais (a base — o produto funciona)</li><li>20% testes de performance/segurança (camada média)</li><li>10% testes de usabilidade/acessibilidade (topo — qualidade premium)</li></ul><h3>Exemplo real</h3><p>Um app bancário pode ter funcionalidade perfeita (transferir dinheiro) mas falhar em não-funcional (dados criptografados?). Ambos importam — ambos são testes.</p>",
            resources: [
              { label: "ISO 25010: Quality Model", url: "https://www.iso.org/standard/35733.html" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "intermediate",
    slug: "advanced-testing",
    title: "⚡ Testes Avançados",
    icon: "⚡",
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
            duration: "50 min",
            content: "<h3>Partição de Equivalência</h3><p>Dividir valores em grupos onde todos produzem o mesmo comportamento.</p><h3>Valor Limite</h3><p>Testar nos limites exatos e vizinhos: 0, 1, 100, 101.</p>",
            resources: []
          },
          {
            id: "l6",
            title: "Exploratório Testing",
            duration: "45 min",
            content: "<h3>Teste sem Script</h3><p>Aprendizado e design de testes acontecem simultaneamente.</p><h3>Charter</h3><p>Missão de teste com tempo limitado.</p>",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: "senior",
    slug: "mastery",
    title: "👑 Maestria em QA",
    icon: "👑",
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
            duration: "50 min",
            content: "<h3>Sprint Planning</h3><p>Seleção de histórias e planejamento.</p><h3>Daily Standup</h3><p>Sincronização de 15 minutos.</p><h3>Sprint Review</h3><p>Demonstração do trabalho pronto.</p><h3>Retrospective</h3><p>Reflexão sobre o processo.</p>",
            resources: []
          },
          {
            id: "l8",
            title: "Three Amigos",
            duration: "40 min",
            content: "<h3>PO + Dev + QA</h3><p>Três perspectivas diferentes refinando histórias juntas.</p><h3>Benefícios</h3><p>Elimina ambiguidade, alinha expectativas, reduz retrabalho.</p>",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: "exploratory",
    slug: "exploratory-testing-mastery",
    title: "🔍 Teste Exploratório — Deep Dive",
    icon: "🔍",
    color: "#ec4899",
    description: "Domine testes exploratórios: charter-driven, risk-based, heuristics e descoberta real de bugs.",
    level: "Intermediário+",
    topics: ["Teste Exploratório", "Charters", "Heuristics", "Risk-based", "Bug Discovery"],
    courses: [
      {
        id: "c-exp-1",
        title: "Fundamentos do Teste Exploratório",
        lessons: [
          {
            id: "exp-l1",
            title: "O que é Teste Exploratório?",
            duration: "40 min",
            content: "<h3>Definição</h3><p>Teste Exploratório (ET) é um estilo de teste onde <strong>aprendizado, design de testes e execução acontecem simultaneamente</strong>. Você não segue um script pronto — você descobre o sistema.</p><h3>Contrastando com Testes Scripted</h3><ul><li><strong>Scripted (tradicional):</strong> Caso de teste pré-definido → executar → verificar resultado. Ótimo para regressão.</li><li><strong>Exploratório:</strong> Entro com uma missão (charter) → exploro → descubro → reporto. Ótimo para encontrar bugs reais.</li></ul><h3>Por que Exploratório?</h3><ul><li><strong>Criatividade:</strong> Você usa intuição e conhecimento para testar 'caminhos não óbvios&apos;</li><li><strong>Aprendizado real:</strong> Cada minuto você aprende mais sobre o produto</li><li><strong>Encontra bugs scripts não acham:</strong> Porque você não segue um caminho previsível</li><li><strong>Rápido:</strong> Sem burocracia de casos de teste — ação direta</li></ul><h3>Mito: 'Exploratório = Sem Planejamento'</h3><p>ERRADO. Exploratório é altamente estruturado — mas a estrutura é <strong>flexível</strong> e baseada em <strong>missão (charter)</strong>, não em check-list rígido.</p><h3>Exemplo Real</h3><p>Você recebe: 'Gaste 90 minutos explorando o fluxo de checkout. Foco: edge cases de pagamento.' Você começa com 'Happy path' (sucesso), depois testa 3 cartões inválidos diferentes, tenta cancel no meio, muda de abas, volta, etc. Tudo <strong>naqueles 90 minutos</strong>.</p><h3>Quando Usar</h3><ul><li>Produto novo (não há spec completa ainda)</li><li>Mudanças grandes (não dá tempo de escrever 50 casos de teste)</li><li>Bugs reais e criativos (não repetitivos)</li><li>QA com experiência (precisa de bom conhecimento de domínio)</li></ul><h3>Guild Master Note</h3><p>Grandes empresas (Google, Meta, Microsoft) usam muita automação + teste exploratório. Automação valida regressão; exploratório encontra novos bugs. Ambos importam.</p>",
            resources: [
              { label: "Exploratory Testing manifesto", url: "https://www.satisfice.com/articles/et-manifesto" },
              { label: "Jon Bach - ET Heuristics", url: "https://www.satisfice.com/articles/sbtm" }
            ]
          },
          {
            id: "exp-l2",
            title: "Charters: A Bíblia do Exploratório",
            duration: "50 min",
            content: "<h3>O que é uma Charter?</h3><p>Uma <strong>charter é uma missão de teste com objetivo claro e tempo limitado</strong>. Formato básico:</p><blockquote style="background: rgba(236, 72, 153, 0.1); padding: 1rem; border-left: 3px solid #ec4899; border-radius: 4px;"><strong>Explore [área] com foco em [aspecto] por [tempo].</strong></blockquote><h3>Exemplos de Charters</h3><ul><li>&apos;Explore o fluxo de login por 60 min. Foco: validações de email (SQL injection, XSS, edge cases).&apos;</li><li>&apos;Teste o carrinho de compras em mobile por 45 min. Foco: sincronização entre abas.&apos;</li><li>&apos;Explore relatórios por 90 min. Foco: performance com 100k+ registros.&apos;</li><li>&apos;Teste integrações com API de pagamento por 120 min. Foco: erros de timeout e retry.&apos;</li></ul><h3>Estrutura Ótima de Charter</h3><p><strong>Charter = Objetivo + Foco + Tempo</strong></p><ul><li><strong>Objetivo:</strong> O que você vai testar (ex: &apos;checkout&apos;)</li><li><strong>Foco:</strong> Aspecto específico (ex: &apos;validações de cartão&apos;)</li><li><strong>Tempo:</strong> Limite (ex: &apos;60 minutos&apos;)</li><li><strong>Opcional - Contexto:</strong> Por que (ex: &apos;novo fluxo, nenhum teste escrito ainda&apos;)</li></ul><h3>Por que Tempo Limitado?</h3><ul><li>Cria urgência → você testa mais criatividade</li><li>Força priorização → você testa pontos altos primeiro</li><li>Encoraja logging → você anota tudo antes de esquecer</li><li>Facilita métricas → 'em 60 min encontramos 5 bugs&apos;</li></ul><h3>Session-based Test Management (SBTM)</h3><p>SBTM é o modelo de usar charters com tempo limitado, logging e revisão de resultado. Passos:</p><ol><li><strong>Crie charter</strong> claro</li><li><strong>Execute</strong> por X minutos</li><li><strong>Anote</strong> tudo (bugs, discoveries, perguntas)</li><li><strong>Reporte</strong> (bugs + métricas)</li><li><strong>Revise</strong> com time (o que aprendemos?)</li></ol><h3>Exemplo Prático</h3><p>Charter: 'Explore integração com Firebase por 90 minutos. Foco: offline behavior e sync conflito.'</p><p>Você começa:</p><ul><li>0-10 min: Happy path (online, cria documento)</li><li>10-20 min: Desliga internet, tenta editar</li><li>20-30 min: Volta online, confere sync</li><li>30-45 min: Testa edição simultânea em 2 abas</li><li>45-60 min: Testa mobile (rede lenta, turnoff+turnon rápido)</li><li>60-90 min: Testes criados: tenta delete offline, tenta share offline, etc</li></ul><p>Resultado: 5 bugs encontrados, 8 heuristics testadas, 3 perguntas para time</p>",
            resources: [
              { label: "SBTM: Session-based Test Management", url: "https://www.satisfice.com/articles/sbtm" },
              { label: "Charter Templates", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          },
          {
            id: "exp-l3",
            title: "SFDIPOT & Heuristics: Ferramentas Mentais",
            duration: "45 min",
            content: "<h3>SFDIPOT — Tipos de Teste Exploratório</h3><p>Quando você explora, que tipos de teste você cobre? SFDIPOT é uma mnemônica:</p><ul><li><strong>S — Structure:</strong> Como o sistema está organizado? Navegação, fluxos, hierarquia.</li><li><strong>F — Function:</strong> O que o sistema faz? Comportamentos, cálculos, lógica.</li><li><strong>D — Data:</strong> Como dados são criados, armazenados, recuperados? Integridade, formato.</li><li><strong>I — Integrations:</strong> Como comunica com outros sistemas? APIs, plugins, externa.</li><li><strong>P — Platform:</strong> Como se comporta em diferentes ambientes? Browsers, SO, dispositivos.</li><li><strong>O — Operations:</strong> Como se comporta sob carga? Failover, recuperação, performance.</li><li><strong>T — Time:</strong> Como se comporta ao longo do tempo? Cache, sessões, timeout.</li></ul><h3>Como Usar SFDIPOT</h3><p>Quando cria uma charter, pense em quais dimensões você cobrirá. Exemplo:</p><p><strong>Charter: 'Explore checkout por 90 min. Foco: pagamento.'</strong></p><ul><li>Structure: Posso navegar para back/forward? Fluxo faz sentido?</li><li>Function: Calcula total corrigível? Aplica cupom? Arredonda?</li><li>Data: Dados de cartão são salvos? Que tipo de validação?</li><li>Integrations: Comunica com gateway externo? Trata erro?</li><li>Platform: Funciona em Safari, Chrome, Mobile?</li><li>Operations: Timeout em conexão lenta?</li><li>Time: Session expira se eu demorar? Cache velha?</li></ul><h3>Heuristics — 'Regras de Ouro' do Teste</h3><p>Heuristics são padrões/tendências que ajudam a encontrar bugs. Exemplos:</p><ul><li>&apos;Bugs adoram limites' → teste 0, -1, null, vazio, 100%, etc</li><li>&apos;Off-by-one é comum' → teste 99, 100, 101</li><li>&apos;Usuários não fazem happy path' → teste cancelamento, voltar, abas, etc</li><li>&apos;Concorrência quebra tudo' → teste 2+ usuários simultâneos</li><li>&apos;Cache engancha' → teste mudança, limpa cache, testa novo</li><li>&apos;Dados sensíveis vazam' → procure por passwords em logs, URLs, responses</li></ul><h3>Heuristics Comuns de Teste</h3><blockquote style="background: rgba(236, 72, 153, 0.1); padding: 1rem; border-left: 3px solid #ec4899; border-radius: 4px;"><strong>FUCS CUTS VIDS</strong> (mnemônico popular):<br/>• F: First, Last, Middle<br/>• U: Unusual<br/>• C: Covered (todos branches), Crashed<br/>• S: Size, SQL<br/>• C: Case sensitivity<br/>• U: Unit test<br/>• T: Trivial, Trigger<br/>• S: Security<br/>• V: Values<br/>• I: Interface<br/>• D: Database<br/>• S: Security</blockquote><h3>Prática: Apply SFDIPOT</h3><p>Pegue um app simples (Sauce Demo, seu próprio). Para cada letra de SFDIPOT, gaste 10 minutos testando. O que você descobrir?</p>",
            resources: [
              { label: "SFDIPOT Explained", url: "https://www.satisfice.com/articles/et-manifesto" },
              { label: "Heuristics Mind Map", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          }
        ]
      },
      {
        id: "c-exp-2",
        title: "Exploratory Testing Prático",
        lessons: [
          {
            id: "exp-l4",
            title: "Planejando uma Sessão de Exploração",
            duration: "45 min",
            content: "<h3>Pré-Sessão: Preparar Charter</h3><p>Antes de começar, responda:</p><ul><li><strong>O que vou testar?</strong> (feature/área)</li><li><strong>Qual é meu foco?</strong> (aspecto importante)</li><li><strong>Quanto tempo tenho?</strong> (real: 60-90 min é ideal)</li><li><strong>Que tipo de bugs espero?</strong> (edge cases, performance, segurança?)</li><li><strong>Que ambiente?</strong> (staging? qual navegador/SO?)</li></ul><h3>Template de Charter</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'><strong>Charter:</strong> Explore [ÁREA] por [TEMPO]\n<strong>Foco:</strong> [ASPECTO IMPORTANTE]\n<strong>Contexto:</strong> [Por que estamos testando isso?]\n<strong>Heuristics a usar:</strong> [Ex: SFDIPOT: F, D, I]</pre><h3>Iniciando a Sessão</h3><ul><li><strong>Limpe seu estado mental:</strong> Esqueça casos de teste anteriores. Você é um usuário novo.</li><li><strong>Comece com happy path:</strong> Use normalmente por 5-10 min. Aprenda o sistema.</li><li><strong>Depois vire criativo:</strong> Teste edge cases, combinações estranhas, concorrência.</li><li><strong>Anote TUDO:</strong> Bugs, descobries, perguntas. Não confia em memória.</li></ul><h3>Durante a Sessão: Ciclo OCTOPLUS</h3><p>Modelo para ajudar exploração:</p><ul><li><strong>O</strong>bserve: Como sistema behaves normalmente?</li><li><strong>C</strong>riticize: O que eu acho estranho?</li><li><strong>T</strong>arget: Qual área foco?</li><li><strong>O</strong>perate: Execute ação para testar</li><li><strong>P</strong>erform: Observe resultado</li><li><strong>L</strong>ook for bugs: Corresponde expectativa?</li><li><strong>U</strong>nderstand: O que aprendi? Próxima ação?</li><li><strong>S</strong>ummarize: Documente discovery</li></ul><h3>Técnicas de Exploração Criativa</h3><ul><li><strong>Teste o oposto:</strong> Se esperado = 'válido', testar = 'inválido'. Texto → números. Positivo → negativo.</li><li><strong>Teste limites:</strong> Min, Max, just-over, just-under.</li><li><strong>Teste combinações:</strong> Dois bugs raros não acontecem sozinhos — teste juntos.</li><li><strong>Teste concorrência:</strong> 2 abas abertas. Edita Tab A, Tab B vê?</li><li><strong>Teste estado:</strong> Logout/login. Cache limpo/sujo. Online/offline.</li><li><strong>Teste pressão:</strong> Conexão lenta. Muita memória. Sem JS. Sem cookies.</li></ul><h3>Pós-Sessão: Logging & Reporting</h3><p>Após 60 min:</p><ul><li><strong>Bugs encontrados:</strong> Número, severidade, passos</li><li><strong>Areas exploradas:</strong> Quais dimensões de SFDIPOT cobriste?</li><li><strong>Coverage:</strong> Aproveitaste o tempo?</li><li><strong>Preguntas:</strong> O que deixou dúvida?</li><li><strong>Sugestões:</strong> Pra próxima sessão</li></ul>",
            resources: [
              { label: "Session Notes Template", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          },
          {
            id: "exp-l5",
            title: "Casos Reais & Boas Práticas",
            duration: "50 min",
            content: "<h3>Caso Real 1: E-commerce Checkout</h3><p><strong>Charter:</strong> Explore checkout por 90 min. Foco: validações de entrada e edge cases.</p><p><strong>O que explorar:</strong></p><ul><li>Happy path: Compra normal</li><li>Inválido: Cartão expirado, CVV inválido, nome vazio</li><li>Edge cases: Cartão com caracteres especiais no nome, CEP invalido, preço zerado</li><li>Concorrência: 2 abas, uma adiciona produto, outra tira</li><li>Performance: Muitos itens, página carrega?</li></ul><p><strong>Bugs encontrados em 90 min:</strong></p><ul><li>Cupom aplicado 2x se clicar 'apply' rápido</li><li>Não valida CEP antes de chamar API</li><li>Total se corrompe se remover item durante loading</li><li>XSS no campo 'nome do cartão&apos;</li></ul><h3>Caso Real 2: API REST</h3><p><strong>Charter:</strong> Teste API de usuários por 75 min. Foco: tratamento de erros e casos de contorno.</p><p><strong>Exploração:</strong></p><ul><li>Happy path: GET /users, GET /users/:id, POST, PUT, DELETE</li><li>Inválido: ID inexistente, formato inválido, sem auth</li><li>Edge cases: ID = 0, -1, muito grande, null, vazio</li><li>Concorrência: PUT simultâneo, DELETE enquanto ler</li><li>Performance: GET com 10k+ registros</li></ul><p><strong>Bugs encontrados:</strong></p><ul><li>DELETE /users/:id retorna 200 mesmo ID inexistente</li><li>POST sem required fields retorna 500 em vez de 400</li><li>GET /users?skip=999999 trava o server</li><li>Auth token não validado em DELETE</li></ul><h3>Boas Práticas</h3><ul><li><strong>1. Respeita Charter — mas sê flexível:</strong> Se descobrir coisa inesperada, segue. Charter é guia, não jaula.</li><li><strong>2. Anota enquanto explora:</strong> Não deixa pra depois. Memória humana é fraca.</li><li><strong>3. Testa o obvio + o criativo:</strong> 50% happy path, 50% criativo.</li><li><strong>4. Pede ajuda:</strong> Stuck? Pergunta a colega. Às vezes trazem ideia nova.</li><li><strong>5. Varia velocidade:</strong> Às vezes explora rápido (encontrar mais bugs). Às vezes devagar (entender bem um aspecto).</li><li><strong>6. Reproduz bugs:</strong> 1 vez é sorte. 3x é pattern. Reproduz sempre antes de reportar.</li><li><strong>7. Sabe quando parar:</strong> Não vale testar tudo. Foca na área mais crítica ou desconhecida.</li></ul><h3>Anti-padrões (O que NÃO fazer)</h3><ul><li>❌ Explorar sem charter (vira caos)</li><li>❌ Não anotar descoberies (esquece)</li><li>❌ Só happy path (encontra pouco)</li><li>❌ Ignorar hints (dev disse 'tenho dúvida nesta lógica', explore ali!)</li><li>❌ Testar sem entender contexto (por que essa feature existe?)</li><li>❌ Reportar bugs sem reproduzir (QA chora)</li></ul><h3>Métricas de Sucesso</h3><p>Em 60 minutos de exploração:</p><ul><li>Idealmente 2-5 bugs reais (criativo, não óbvio)</li><li>3-5 heuristics aplicadas</li><li>80%+ de charter coberto</li><li>Learning: Você aprende 10+ coisas sobre o sistema</li></ul>",
            resources: [
              { label: "Real Bug Stories", url: "https://www.satisfice.com/articles/et-manifesto" },
              { label: "ET Documentation", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "testdata",
    slug: "test-data-management",
    title: "📊 Test Data Management",
    icon: "📊",
    color: "#06b6d4",
    description: "Domine gerenciamento de dados de teste: fixtures, factories, seeding, masking e estratégias de data-driven testing.",
    level: "Intermediário+",
    topics: ["Fixtures", "Data Factories", "Database Seeding", "Data Masking", "Data-driven Testing"],
    courses: [
      {
        id: "c-tdm-1",
        title: "Fundamentos de Dados de Teste",
        lessons: [
          {
            id: "tdm-l1",
            title: "Por que Test Data Importa",
            duration: "35 min",
            content: "<h3>O Desafio</h3><p>Teste sem dados bons = teste fraco. Exemplos de problema:</p><ul><li>Usa dados de produção (LGPD viola, dados reais quebram)</li><li>Dados hardcoded (quebra quando produção muda)</li><li>Dados inconsistentes (teste A usa ID=1, teste B usa ID=999)</li><li>Dados corruptados (test A deixa lixo, test B fails)</li><li>Sem isolamento (testes interferem um no outro)</li></ul><h3>Consequências</h3><ul><li><strong>Flaky tests:</strong> Testes instáveis — falham às vezes</li><li><strong>Produção cai:</strong> Dados produção foram alterados durante teste</li><li><strong>Security risk:</strong> Dados sensíveis em test data</li><li><strong>Retrabalho:</strong> Cada teste precisa setup complexo</li></ul><h3>Solução: Test Data Management (TDM)</h3><p>TDM = <strong>Estratégia de criar, gerenciar e destruir dados de teste de forma isolada, consistente e segura</strong>.</p><h3>Princípios Chave</h3><ul><li><strong>1. Isolamento:</strong> Dados de teste separados de produção. Cada teste seu próprio dataset.</li><li><strong>2. Reproductibilidade:</strong> Mesmo comando sempre cria mesmos dados.</li><li><strong>3. Segurança:</strong> Dados sensíveis mascarados ou redacted.</li><li><strong>4. Limpeza:</strong> Após teste, dados deletados ou resetados.</li><li><strong>5. Rastreabilidade:</strong> Sabe de onde cada dado veio.</li></ul><h3>Exemplo Real: E-commerce</h3><p><strong>Cenário sem TDM (BAD):</strong></p><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px;">Teste 1: Cria usuário ID=100\nTeste 2: Cria usuário ID=100 (conflita!)\nTeste 3: USA ID=100 (qual é o usuário certo?)\n→ Testes flaky, hard para debuggar</pre><p><strong>Cenário com TDM (GOOD):</strong></p><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px;">Test Setup: Cria usuário ÚNICO via Factory\nTeste 1: Usa usuário criado\nTeste 2: Usa seu próprio usuário (criado by factory)\nTest Teardown: Deleta usuário\n→ Testes isolados, determinísticos, rápidos</pre><h3>Pilares de TDM</h3><ul><li><strong>Fixtures:</strong> Dados pré-preparados (arquivos JSON, seed scripts)</li><li><strong>Factories:</strong> Código que gera dados sob demanda</li><li><strong>Builders:</strong> Padrão para construir objetos complexos</li><li><strong>Seeding:</strong> Popular BD com dataset base</li><li><strong>Masking:</strong> Ocultar dados sensíveis</li><li><strong>Cleanup:</strong> Garbage collection de dados</li></ul><h3>Guild Master Note</h3><p>Grandes companies (Uber, Spotify, Airbnb) investem pesado em TDM infrastructure. Por quê? Porque dados ruins = testes ruins = bugs in produção = loss of $$$$$. TDM é ROI direto.</p>",
            resources: [
              { label: "Test Data Management Best Practices", url: "https://www.owasp.org/" },
              { label: "Database Seeding Patterns", url: "https://www.martinfowler.com/" }
            ]
          },
          {
            id: "tdm-l2",
            title: "Fixtures: Preparando Dados Estáticos",
            duration: "40 min",
            content: "<h3>O que é uma Fixture?</h3><p>Fixture = <strong>conjunto de dados pré-preparados, armazenados em arquivo ou BD, que você carrega para cada teste</strong>.</p><p>Analogia: Você prepara o cenário (montar palco) antes do ator começar.</p><h3>Tipos de Fixtures</h3><ul><li><strong>1. JSON/YAML Files:</strong> Dados em arquivo estático</li><li><strong>2. SQL Scripts:</strong> INSERT statements</li><li><strong>3. ORM Fixtures:</strong> Arquivo que ORMs entendem (Sequelize, TypeORM)</li><li><strong>4. Database Snapshots:</strong> Restore de BD completa</li></ul><h3>Exemplo: JSON Fixture (Simples)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>// fixtures/users.json\n[\n  { id: 1, email: 'alice@test.com', role: 'admin' },\n  { id: 2, email: 'bob@test.com', role: 'user' },\n  { id: 3, email: 'charlie@test.com', role: 'user' }\n]\n\n// test.js\nconst users = require('./fixtures/users.json&apos;);\ntest('admin pode deletar usuário', () => {\n  const admin = users[0];\n  const userToDelete = users[1];\n  // teste aqui\n});</pre><h3>Exemplo: SQL Fixture (Mais Poderosa)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>-- fixtures/seed.sql\nINSERT INTO users (id, email, role) VALUES\n(1, 'alice@test.com', 'admin&apos;),\n(2, 'bob@test.com', 'user&apos;),\n(3, 'charlie@test.com', 'user&apos;);\n\nINSERT INTO posts (id, user_id, title) VALUES\n(100, 1, 'Alice Post&apos;),\n(101, 2, 'Bob Post&apos;);</pre><h3>Vantagens de Fixtures</h3><ul><li>✅ Simples de usar (load e go)</li><li>✅ Determinístico (sempre mesmos dados)</li><li>✅ Versionável (controle via Git)</li><li>✅ Rápido para pequenos datasets</li></ul><h3>Desvantagens</h3><ul><li>❌ Não escala (arquivos grandes = lento)</li><li>❌ Rígido (mudança em fixture = atualizar arquivo)</li><li>❌ Duplicação (múltiplos testes = fixtures repetidas)</li><li>❌ Conflito de IDs (fixtures hardcoded)</li></ul><h3>Quando Usar Fixtures</h3><p>✓ Datasets pequenos e estáveis<br/>✓ Dados de referência (lista de countries, status)<br/>✓ Seed inicial de BD<br/>✗ Dados gerados dinamicamente<br/>✗ Dados complexos (muitas dependências)</p><h3>Best Practices</h3><ul><li><strong>1. Organize em diretório:</strong> /fixtures/users.json, /fixtures/posts.json</li><li><strong>2. Nomeie claro:</strong> valid-user, admin-with-posts, etc</li><li><strong>3. Documente:</strong> Que aulas/testes usam este fixture?</li><li><strong>4. Versionie:</strong> Git tracking, histórico de mudanças</li><li><strong>5. Limpe após teste:</strong> Fixture = setup, Cleanup = teardown</li></ul>",
            resources: [
              { label: "Test Fixtures Guide", url: "https://www.martinfowler.com/bliki/Fixture.html" }
            ]
          },
          {
            id: "tdm-l3",
            title: "Data Factories: Gerando Dados Dinamicamente",
            duration: "45 min",
            content: "<h3>O Problema com Fixtures Estáticas</h3><p>Fixtures são ótimas mas não escalam:</p><ul><li>Precisa de 100 usuários diferentes? 100 fixtures?</li><li>Precisa de usuário + posts + comments? Dependências complexas?</li><li>Precisa de dados aleatórios (testar com 'cid' inválido)? Hardcoded não dá.</li></ul><h3>Solução: Data Factories</h3><p>Factory = <strong>função/classe que gera dados sob demanda, respeitando constraints</strong>.</p><h3>Exemplo: User Factory (JavaScript)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>// factories/userFactory.js\nconst { faker } = require('@faker-js/faker&apos;);\n\nclass UserFactory {\n  static create(overrides = {}) {\n    return {\n      id: faker.number.int(),\n      email: faker.internet.email(),\n      name: faker.person.fullName(),\n      role: 'user',\n      createdAt: faker.date.past(),\n      ...overrides // permite override\n    };\n  }\n\n  static admin(overrides = {}) {\n    return this.create({ role: 'admin', ...overrides });\n  }\n\n  static batch(count, overrides = {}) {\n    return Array.from({ length: count }, () => \n      this.create(overrides)\n    );\n  }\n}\n\n// test.js\ntest('admin pode editar usuário', () => {\n  const admin = UserFactory.admin();\n  const user = UserFactory.create();\n  // teste\n});\n\ntest('10 usuários simultâneos', () => {\n  const users = UserFactory.batch(10);\n  // stress test\n});</pre><h3>Vantagens de Factories</h3><ul><li>✅ Dinâmico (cria dados sob demanda)</li><li>✅ Flexível (override qualquer campo)</li><li>✅ Sem conflito de ID (gerado automaticamente)</li><li>✅ Reutilizável (um factory para muitos testes)</li><li>✅ Escala (criar 1000 usuários em 1 linha)</li></ul><h3>Padrões Comuns</h3><ul><li><strong>Builder Pattern:</strong> Chainable methods</li><li><strong>Trait Pattern:</strong> Composição de comportamentos</li><li><strong>Sequence Pattern:</strong> Sequência numérica (ID 1, 2, 3...)</li></ul><h3>Exemplo: Builder Pattern</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>class UserBuilder {\n  withEmail(email) { this.email = email; return this; }\n  withRole(role) { this.role = role; return this; }\n  isAdmin() { return this.withRole('admin&apos;); }\n  build() { return new User(this.email, this.role); }\n}\n\n// Uso chainable\nconst admin = new UserBuilder()\n  .withEmail('boss@test.com&apos;)\n  .isAdmin()\n  .build();


            resources: [
              { label: "Factory Bot Guide", url: "https://github.com/thoughtbot/factory_bot" },
              { label: "Faker.js Library", url: "https://fakerjs.dev/" }
            ]
          }
        ]
      },
      {
        id: "c-tdm-2",
        title: "Estratégias Avançadas de TDM",
        lessons: [
          {
            id: "tdm-l4",
            title: "Database Seeding & Cleanup",
            duration: "45 min",
            content: "<h3>Seeding: Populando Base com Dados Base</h3><p>Seeding = carregar dados iniciais na BD antes de testes rodar.</p><h3>Tipos de Seeding</h3><ul><li><strong>1. One-time Seed:</strong> Roda uma vez antes de ALL testes</li><li><strong>2. Per-test Seed:</strong> Roda antes de cada teste</li><li><strong>3. Fresh Seed:</strong> Limpa BD, depois seed (recomendado)</li></ul><h3>Cleanup: Removendo Dados Após Teste</h3><p>Cleanup é crítico para evitar interferência entre testes. Estratégias: Truncate (DELETE tudo), Rollback (transaction), Delete Specific.</p><h3>Transações para Cleanup Instantâneo</h3><p>Melhor prática: Use database transactions. Tudo que roda na transaction é rollback automático em milissegundos.</p><h3>Performance Tips</h3><ul><li><strong>1. Batch inserts:</strong> INSERT 100 rows em 1 query, não 100 queries</li><li><strong>2. Disable constraints:</strong> Durante seed, desabilita foreign keys, depois habilita</li><li><strong>3. Parallel tests:</strong> Cada test usa sua própria transaction (isolado)</li></ul>",
            resources: []
          },
          {
            id: "tdm-l5",
            title: "Data Masking & Segurança",
            duration: "40 min",
            content: "<h3>O Problema: Dados Sensíveis em Teste</h3><p>Cenários perigosos: Developers vendo dados de produção durante debug, Test data contém SSN/cartão real, LGPD violação.</p><h3>Solução: Data Masking</h3><p>Masking = substituir dados sensíveis por fakes mas realísticos. Tipos: Substitution (trocar), Redaction (remover), Hashing, Encryption.</p><h3>Boas Práticas</h3><ul><li>✓ Use faker libraries (Faker.js, Bogus, factory_bot)</li><li>✓ NUNCA copie dados de produção para teste</li><li>✓ Se precisa real-like data, gera com Faker</li><li>✓ Documente sensibilidade de cada campo</li><li>✓ Audita test data antes de commit</li></ul>",
            resources: []
          },
          {
            id: "tdm-l6",
            title: "Data-driven Testing & Test Matrices",
            duration: "40 min",
            content: "<h3>O que é Data-driven Testing?</h3><p>Ao invés de escrever um teste para cada input, você escreve UM teste + múltiplos datasets. O teste roda para cada dataset.</p><h3>Exemplo: Sem Data-driven (BAD)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>test('validar email válido', () => {\n  expect(validateEmail('john@example.com&apos;)).toBe(true);\n});\ntest('validar email inválido1', () => {\n  expect(validateEmail('johnexample.com&apos;)).toBe(false);\n});\ntest('validar email inválido2', () => {\n  expect(validateEmail('@example.com&apos;)).toBe(false);\n});\n// 3 testes = código duplicado!

<h3>Exemplo: Com Data-driven (GOOD)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>const testCases = [\n  { email: 'john@example.com', expected: true },\n  { email: 'johnexample.com', expected: false },\n  { email: '@example.com', expected: false },\n  { email: 'john+tag@example.com', expected: true }\n];\n\ntestCases.forEach(({ email, expected }) => {\n  test(`validar email: ${email}`, () => {\n    expect(validateEmail(email)).toBe(expected);\n  });\n});

<h3>Vantagens de Data-driven</h3><ul><li>✅ DRY: 1 teste, múltiplos cenários</li><li>✅ Fácil adicionar casos: Só adiciona row em array</li><li>✅ Documentação automática: Array mostra todos os casos</li><li>✅ Mantível: Mudança na lógica = muda em 1 lugar</li></ul><h3>Exemplo Avançado: Matriz de Teste (API)</h3><pre style="background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'>const apiTestMatrix = [\n  // { method, url, payload, expectedStatus, expectedBody }\n  { method: 'GET', url: '/users', payload: null, expectedStatus: 200 },\n  { method: 'POST', url: '/users', payload: {}, expectedStatus: 400 }, // missing fields\n  { method: 'POST', url: '/users', payload: { email: 'john@test.com' }, expectedStatus: 201 },\n  { method: 'GET', url: '/users/999', payload: null, expectedStatus: 404 },\n  { method: 'DELETE', url: '/users/1', payload: null, expectedStatus: 204 }\n];\n\napiTestMatrix.forEach(({ method, url, payload, expectedStatus }) => {\n  test(`${method} ${url} → ${expectedStatus}`, async () => {\n    const response = await makeRequest(method, url, payload);\n    expect(response.status).toBe(expectedStatus);\n  });\n});

<h3>Boas Práticas de Data-driven</h3><ul><li><strong>1. Organize dados:</strong> Separa em arquivo (CSV, JSON) vs hardcode</li><li><strong>2. Nomeie claro:</strong> testCases = bem descritivo</li><li><strong>3. Comente casos:</strong> Por que este caso existe?</li><li><strong>4. Valida dados:</strong> Schema validation antes de usar</li><li><strong>5. Métricas:</strong> Quantos testes gerados? Coverage?</li></ul><h3>Quando Usar Data-driven</h3><p>✓ Validações de input (emails, phones, zips)<br/>✓ APIs com múltiplos status (200, 400, 404, 500)<br/>✓ Cálculos (desconto, imposto, frete)<br/>✓ Conversões (currency, time zones)<br/>✗ Testes que precisam lógica complexa entre steps<br/>✗ UI workflows (navigate, fill, click)</p><h3>Guild Master Note</h3><p>Data-driven testing + Factories = power combo. Factories geram dados, data-driven executa testes com eles. Juntas, você cobre mais cenários em menos tempo.</p>",
            resources: [
              { label: "Parameterized Testing", url: "https://jestjs.io/docs/parametrized-tests" }
            ]
          }
        ]
      }
    ]
  }
];
