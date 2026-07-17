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
            content: "<h3>QA é mais que encontrar bugs</h3><p>Qualidade de software é criar <strong>confiança</strong> no produto antes dele chegar ao usuário. Um QA competente não corre atrás de bugs — ele previne que eles apareçam.</p><h3>O que um QA profissional faz</h3><ul><li><strong>Entende risco:</strong> 'Qual funcionalidade, se quebrar, machuca o negócio mais?'</li><li><strong>Cria cenários:</strong> Não só 'happy path' — pensa em edge cases, erros, concorrência</li><li><strong>Colabora cedo:</strong> Participa de requisitos, design, code review</li><li><strong>Protege o usuário final:</strong> Cada bug que escapa custa reputação + dinheiro</li></ul><h3>Diferença: QA vs Tester vs QC</h3><ul><li><strong>QA (Quality Assurance):</strong> Estratégia, processos, prevenção — 'como garantimos qualidade?'</li><li><strong>Tester:</strong> Executa testes, reporta bugs — prático</li><li><strong>QC (Quality Control):</strong> Verifica o produto — reativo</li></ul><h3>Por que QA importa para o negócio</h3><p>Segundo Gartner, o custo de um bug em produção é <strong>6x mais caro</strong> que corrigir em desenvolvimento. Um QA que previne bugs escapa está gerando ROI direto.</p><h3>Exemplo real</h3><p>Uma plataforma de e-commerce sem QA rigoroso pode vazar dados de pagamento → LGPD, processos judiciais, perda de clientes. Um QA que testa integração segura e validações de input previne isso.</p>",
            resources: [
              { label: "ISTQB: Tester vs QA", url: "https://www.istqb.org/" },
              { label: "Gartner: Cost of Quality", url: "https://www.gartner.com" }
            ]
          },
          {
            id: "l2",
            title: "Papéis: QA, QC e Tester",
            duration: "35 min",
            content: "<h3>Clareza de papéis = eficiência</h3><p>Muitas organizações confundem esses termos. Entender a diferença é crucial para definir responsabilidades e estruturar o time.</p><h3>QA — Quality Assurance (Proativo)</h3><ul><li><strong>O quê:</strong> Estratégia, processos, prevenção</li><li><strong>Quando:</strong> Desde o início do projeto</li><li><strong>Como:</strong> Participa de requisitos, design, mentoria</li><li><strong>Exemplo:</strong> 'Vamos definir os critérios de aceite? Como testamos para concorrência? Que edge cases faltam?'</li></ul><h3>QC — Quality Control (Verificador)</h3><ul><li><strong>O quê:</strong> Verifica se o produto atende especificações</li><li><strong>Quando:</strong> Após desenvolvimento (reativo)</li><li><strong>Como:</strong> Valida contra specs, reporta conformidade</li><li><strong>Exemplo:</strong> 'Este campo deve ser obrigatório? Está validando?'</li></ul><h3>Tester (Executor)</h3><ul><li><strong>O quê:</strong> Executa planos de teste</li><li><strong>Quando:</strong> Durante a fase de teste</li><li><strong>Como:</strong> Manual ou automação</li><li><strong>Exemplo:</strong> 'Vou rodar 50 casos de teste neste campo'</li></ul><h3>A realidade moderna</h3><p>Em times Agile/DevOps, esses papéis se mesclam. <strong>Um QA moderno faz tudo:</strong> estratégia + execução + automação. A diferença é <strong>mentalidade:</strong> QA pensa 'como prevenimos?' enquanto Tester pensa 'como encontramos?'</p>",
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
            content: "<h3>O SDLC (Software Development Lifecycle)</h3><p>Existem diferentes modelos, mas todos têm fases comuns:</p><ul><li><strong>1. Planejamento:</strong> Visão do produto, escopo inicial</li><li><strong>2. Requisitos:</strong> O que o sistema deve fazer (specs, user stories)</li><li><strong>3. Design:</strong> Como implementar (arquitetura, UI/UX)</li><li><strong>4. Desenvolvimento:</strong> Developers escrevem código</li><li><strong>5. Testes:</strong> QA valida contra requisitos</li><li><strong>6. Deploy:</strong> Release para produção</li><li><strong>7. Manutenção:</strong> Suporte, patches, melhorias</li></ul><h3>Onde QA se encaixa (tradicional)</h3><p>Historicamente QA estava só na fase 5 (Testes) — reativo, encontrando bugs já criados.</p><h3>Shift-left: QA desde o início</h3><p><strong>Shift-left = trazer QA para perto do início.</strong> Isso significa:</p><ul><li><strong>Em Requisitos:</strong> QA faz perguntas: 'Como testamos isso? Que edge cases faltam? Qual é o critério de aceite?'</li><li><strong>Em Design:</strong> QA contribui na testabilidade: 'Como vamos automatizar? Precisamos de dados de teste?'</li><li><strong>Em Dev:</strong> QA faz code review (no contexto de testes), propõe test data, setup</li><li><strong>Em Testes:</strong> QA valida com inteligência, não só marca checklist</li></ul><h3>Benefício concreto do Shift-left</h3><p>Um bug encontrado em requisitos custa R$ 100 corrigir. O mesmo bug encontrado em produção custa R$ 10.000. Shift-left reduz bugs em produção em até 80%.</p><h3>Agile muda tudo</h3><p>Em Agile, não existe fase separada de 'testes'. QA trabalha integrado com dev desde o dia 1 da sprint. Testes são parte da DoD (Definition of Done).</p>",
            resources: [
              { label: "IBM: SDLC Models", url: "https://www.ibm.com/topics/sdlc" },
              { label: "Shift-left Testing", url: "https://www.stickyminds.com/shift-left-testing" }
            ]
          },
          {
            id: "l4",
            title: "Testes funcionais vs não-funcionais",
            duration: "45 min",
            content: "<h3>Dimensão 1: Testes Funcionais</h3><p><strong>Pergunta:</strong> O sistema faz o que foi prometido?</p><ul><li><strong>O quê:</strong> Validam comportamentos específicos</li><li><strong>Exemplos:</strong><ul><li>'Usuário consegue fazer login com email válido?'</li><li>'Compra com descupo aplica corretamente?'</li><li>'API retorna 404 para ID inexistente?'</li></ul></li><li><strong>Como testar:</strong> Casos de teste, manual ou automação</li><li><strong>Métrica:</strong> % de funcionalidades validadas</li></ul><h3>Dimensão 2: Testes Não-Funcionais</h3><p><strong>Pergunta:</strong> Como o sistema se comporta em condições especiais?</p><ul><li><strong>Performance:</strong> 'Página carrega em < 2 segundos com 1000 usuários?'</li><li><strong>Segurança:</strong> 'Dados sensíveis estão criptografados? Resiste a SQL Injection?'</li><li><strong>Acessibilidade:</strong> 'Usuário cego consegue usar com screen reader?'</li><li><strong>Usabilidade:</strong> 'Interface é intuitiva? Botões são clicáveis?'</li><li><strong>Confiabilidade:</strong> 'Sistema se recupera de falhas? Dados são consistentes?'</li><li><strong>Escalabilidade:</strong> 'Funciona com 100x mais dados?'</li></ul><h3>A Pirâmide</h3><p>Em um projeto típico:</p><ul><li>70% testes funcionais (a base — o produto funciona)</li><li>20% testes de performance/segurança (camada média)</li><li>10% testes de usabilidade/acessibilidade (topo — qualidade premium)</li></ul><h3>Exemplo real</h3><p>Um app bancário pode ter funcionalidade perfeita (transferir dinheiro) mas falhar em não-funcional (dados criptografados?). Ambos importam — ambos são testes.</p>",
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
            content: "<h3>Definição</h3><p>Teste Exploratório (ET) é um estilo de teste onde <strong>aprendizado, design de testes e execução acontecem simultaneamente</strong>. Você não segue um script pronto — você descobre o sistema.</p><h3>Contrastando com Testes Scripted</h3><ul><li><strong>Scripted (tradicional):</strong> Caso de teste pré-definido → executar → verificar resultado. Ótimo para regressão.</li><li><strong>Exploratório:</strong> Entro com uma missão (charter) → exploro → descubro → reporto. Ótimo para encontrar bugs reais.</li></ul><h3>Por que Exploratório?</h3><ul><li><strong>Criatividade:</strong> Você usa intuição e conhecimento para testar 'caminhos não óbvios'</li><li><strong>Aprendizado real:</strong> Cada minuto você aprende mais sobre o produto</li><li><strong>Encontra bugs scripts não acham:</strong> Porque você não segue um caminho previsível</li><li><strong>Rápido:</strong> Sem burocracia de casos de teste — ação direta</li></ul><h3>Mito: 'Exploratório = Sem Planejamento'</h3><p>ERRADO. Exploratório é altamente estruturado — mas a estrutura é <strong>flexível</strong> e baseada em <strong>missão (charter)</strong>, não em check-list rígido.</p><h3>Exemplo Real</h3><p>Você recebe: 'Gaste 90 minutos explorando o fluxo de checkout. Foco: edge cases de pagamento.' Você começa com 'Happy path' (sucesso), depois testa 3 cartões inválidos diferentes, tenta cancel no meio, muda de abas, volta, etc. Tudo <strong>naqueles 90 minutos</strong>.</p><h3>Quando Usar</h3><ul><li>Produto novo (não há spec completa ainda)</li><li>Mudanças grandes (não dá tempo de escrever 50 casos de teste)</li><li>Bugs reais e criativos (não repetitivos)</li><li>QA com experiência (precisa de bom conhecimento de domínio)</li></ul><h3>Guild Master Note</h3><p>Grandes empresas (Google, Meta, Microsoft) usam muita automação + teste exploratório. Automação valida regressão; exploratório encontra novos bugs. Ambos importam.</p>",
            resources: [
              { label: "Exploratory Testing manifesto", url: "https://www.satisfice.com/articles/et-manifesto" },
              { label: "Jon Bach - ET Heuristics", url: "https://www.satisfice.com/articles/sbtm" }
            ]
          },
          {
            id: "exp-l2",
            title: "Charters: A Bíblia do Exploratório",
            duration: "50 min",
            content: "<h3>O que é uma Charter?</h3><p>Uma <strong>charter é uma missão de teste com objetivo claro e tempo limitado</strong>. Formato básico:</p><blockquote style='background: rgba(236, 72, 153, 0.1); padding: 1rem; border-left: 3px solid #ec4899; border-radius: 4px;'><strong>Explore [área] com foco em [aspecto] por [tempo].</strong></blockquote><h3>Exemplos de Charters</h3><ul><li>'Explore o fluxo de login por 60 min. Foco: validações de email (SQL injection, XSS, edge cases).'</li><li>'Teste o carrinho de compras em mobile por 45 min. Foco: sincronização entre abas.'</li><li>'Explore relatórios por 90 min. Foco: performance com 100k+ registros.'</li><li>'Teste integrações com API de pagamento por 120 min. Foco: erros de timeout e retry.'</li></ul><h3>Estrutura Ótima de Charter</h3><p><strong>Charter = Objetivo + Foco + Tempo</strong></p><ul><li><strong>Objetivo:</strong> O que você vai testar (ex: 'checkout')</li><li><strong>Foco:</strong> Aspecto específico (ex: 'validações de cartão')</li><li><strong>Tempo:</strong> Limite (ex: '60 minutos')</li><li><strong>Opcional - Contexto:</strong> Por que (ex: 'novo fluxo, nenhum teste escrito ainda')</li></ul><h3>Por que Tempo Limitado?</h3><ul><li>Cria urgência → você testa mais criatividade</li><li>Força priorização → você testa pontos altos primeiro</li><li>Encoraja logging → você anota tudo antes de esquecer</li><li>Facilita métricas → 'em 60 min encontramos 5 bugs'</li></ul><h3>Session-based Test Management (SBTM)</h3><p>SBTM é o modelo de usar charters com tempo limitado, logging e revisão de resultado. Passos:</p><ol><li><strong>Crie charter</strong> claro</li><li><strong>Execute</strong> por X minutos</li><li><strong>Anote</strong> tudo (bugs, discoveries, perguntas)</li><li><strong>Reporte</strong> (bugs + métricas)</li><li><strong>Revise</strong> com time (o que aprendemos?)</li></ol><h3>Exemplo Prático</h3><p>Charter: 'Explore integração com Firebase por 90 minutos. Foco: offline behavior e sync conflito.'</p><p>Você começa:</p><ul><li>0-10 min: Happy path (online, cria documento)</li><li>10-20 min: Desliga internet, tenta editar</li><li>20-30 min: Volta online, confere sync</li><li>30-45 min: Testa edição simultânea em 2 abas</li><li>45-60 min: Testa mobile (rede lenta, turnoff+turnon rápido)</li><li>60-90 min: Testes criados: tenta delete offline, tenta share offline, etc</li></ul><p>Resultado: 5 bugs encontrados, 8 heuristics testadas, 3 perguntas para time</p>",
            resources: [
              { label: "SBTM: Session-based Test Management", url: "https://www.satisfice.com/articles/sbtm" },
              { label: "Charter Templates", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          },
          {
            id: "exp-l3",
            title: "SFDIPOT & Heuristics: Ferramentas Mentais",
            duration: "45 min",
            content: "<h3>SFDIPOT — Tipos de Teste Exploratório</h3><p>Quando você explora, que tipos de teste você cobre? SFDIPOT é uma mnemônica:</p><ul><li><strong>S — Structure:</strong> Como o sistema está organizado? Navegação, fluxos, hierarquia.</li><li><strong>F — Function:</strong> O que o sistema faz? Comportamentos, cálculos, lógica.</li><li><strong>D — Data:</strong> Como dados são criados, armazenados, recuperados? Integridade, formato.</li><li><strong>I — Integrations:</strong> Como comunica com outros sistemas? APIs, plugins, externa.</li><li><strong>P — Platform:</strong> Como se comporta em diferentes ambientes? Browsers, SO, dispositivos.</li><li><strong>O — Operations:</strong> Como se comporta sob carga? Failover, recuperação, performance.</li><li><strong>T — Time:</strong> Como se comporta ao longo do tempo? Cache, sessões, timeout.</li></ul><h3>Como Usar SFDIPOT</h3><p>Quando cria uma charter, pense em quais dimensões você cobrirá. Exemplo:</p><p><strong>Charter: 'Explore checkout por 90 min. Foco: pagamento.'</strong></p><ul><li>Structure: Posso navegar para back/forward? Fluxo faz sentido?</li><li>Function: Calcula total corrigível? Aplica cupom? Arredonda?</li><li>Data: Dados de cartão são salvos? Que tipo de validação?</li><li>Integrations: Comunica com gateway externo? Trata erro?</li><li>Platform: Funciona em Safari, Chrome, Mobile?</li><li>Operations: Timeout em conexão lenta?</li><li>Time: Session expira se eu demorar? Cache velha?</li></ul><h3>Heuristics — 'Regras de Ouro' do Teste</h3><p>Heuristics são padrões/tendências que ajudam a encontrar bugs. Exemplos:</p><ul><li>'Bugs adoram limites' → teste 0, -1, null, vazio, 100%, etc</li><li>'Off-by-one é comum' → teste 99, 100, 101</li><li>'Usuários não fazem happy path' → teste cancelamento, voltar, abas, etc</li><li>'Concorrência quebra tudo' → teste 2+ usuários simultâneos</li><li>'Cache engancha' → teste mudança, limpa cache, testa novo</li><li>'Dados sensíveis vazam' → procure por passwords em logs, URLs, responses</li></ul><h3>Heuristics Comuns de Teste</h3><blockquote style='background: rgba(236, 72, 153, 0.1); padding: 1rem; border-left: 3px solid #ec4899; border-radius: 4px;'><strong>FUCS CUTS VIDS</strong> (mnemônico popular):<br/>• F: First, Last, Middle<br/>• U: Unusual<br/>• C: Covered (todos branches), Crashed<br/>• S: Size, SQL<br/>• C: Case sensitivity<br/>• U: Unit test<br/>• T: Trivial, Trigger<br/>• S: Security<br/>• V: Values<br/>• I: Interface<br/>• D: Database<br/>• S: Security</blockquote><h3>Prática: Apply SFDIPOT</h3><p>Pegue um app simples (Sauce Demo, seu próprio). Para cada letra de SFDIPOT, gaste 10 minutos testando. O que você descobrir?</p>",
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
            content: "<h3>Pré-Sessão: Preparar Charter</h3><p>Antes de começar, responda:</p><ul><li><strong>O que vou testar?</strong> (feature/área)</li><li><strong>Qual é meu foco?</strong> (aspecto importante)</li><li><strong>Quanto tempo tenho?</strong> (real: 60-90 min é ideal)</li><li><strong>Que tipo de bugs espero?</strong> (edge cases, performance, segurança?)</li><li><strong>Que ambiente?</strong> (staging? qual navegador/SO?)</li></ul><h3>Template de Charter</h3><pre style='background: var(--surface-2); padding: 1rem; border-radius: 4px; overflow-x: auto;'><strong>Charter:</strong> Explore [ÁREA] por [TEMPO]\n<strong>Foco:</strong> [ASPECTO IMPORTANTE]\n<strong>Contexto:</strong> [Por que estamos testando isso?]\n<strong>Heuristics a usar:</strong> [Ex: SFDIPOT: F, D, I]</pre><h3>Iniciando a Sessão</h3><ul><li><strong>Limpe seu estado mental:</strong> Esqueça casos de teste anteriores. Você é um usuário novo.</li><li><strong>Comece com happy path:</strong> Use normalmente por 5-10 min. Aprenda o sistema.</li><li><strong>Depois vire criativo:</strong> Teste edge cases, combinações estranhas, concorrência.</li><li><strong>Anote TUDO:</strong> Bugs, descobries, perguntas. Não confia em memória.</li></ul><h3>Durante a Sessão: Ciclo OCTOPLUS</h3><p>Modelo para ajudar exploração:</p><ul><li><strong>O</strong>bserve: Como sistema behaves normalmente?</li><li><strong>C</strong>riticize: O que eu acho estranho?</li><li><strong>T</strong>arget: Qual área foco?</li><li><strong>O</strong>perate: Execute ação para testar</li><li><strong>P</strong>erform: Observe resultado</li><li><strong>L</strong>ook for bugs: Corresponde expectativa?</li><li><strong>U</strong>nderstand: O que aprendi? Próxima ação?</li><li><strong>S</strong>ummarize: Documente discovery</li></ul><h3>Técnicas de Exploração Criativa</h3><ul><li><strong>Teste o oposto:</strong> Se esperado = 'válido', testar = 'inválido'. Texto → números. Positivo → negativo.</li><li><strong>Teste limites:</strong> Min, Max, just-over, just-under.</li><li><strong>Teste combinações:</strong> Dois bugs raros não acontecem sozinhos — teste juntos.</li><li><strong>Teste concorrência:</strong> 2 abas abertas. Edita Tab A, Tab B vê?</li><li><strong>Teste estado:</strong> Logout/login. Cache limpo/sujo. Online/offline.</li><li><strong>Teste pressão:</strong> Conexão lenta. Muita memória. Sem JS. Sem cookies.</li></ul><h3>Pós-Sessão: Logging & Reporting</h3><p>Após 60 min:</p><ul><li><strong>Bugs encontrados:</strong> Número, severidade, passos</li><li><strong>Areas exploradas:</strong> Quais dimensões de SFDIPOT cobriste?</li><li><strong>Coverage:</strong> Aproveitaste o tempo?</li><li><strong>Preguntas:</strong> O que deixou dúvida?</li><li><strong>Sugestões:</strong> Pra próxima sessão</li></ul>",
            resources: [
              { label: "Session Notes Template", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          },
          {
            id: "exp-l5",
            title: "Casos Reais & Boas Práticas",
            duration: "50 min",
            content: "<h3>Caso Real 1: E-commerce Checkout</h3><p><strong>Charter:</strong> Explore checkout por 90 min. Foco: validações de entrada e edge cases.</p><p><strong>O que explorar:</strong></p><ul><li>Happy path: Compra normal</li><li>Inválido: Cartão expirado, CVV inválido, nome vazio</li><li>Edge cases: Cartão com caracteres especiais no nome, CEP invalido, preço zerado</li><li>Concorrência: 2 abas, uma adiciona produto, outra tira</li><li>Performance: Muitos itens, página carrega?</li></ul><p><strong>Bugs encontrados em 90 min:</strong></p><ul><li>Cupom aplicado 2x se clicar 'apply' rápido</li><li>Não valida CEP antes de chamar API</li><li>Total se corrompe se remover item durante loading</li><li>XSS no campo 'nome do cartão'</li></ul><h3>Caso Real 2: API REST</h3><p><strong>Charter:</strong> Teste API de usuários por 75 min. Foco: tratamento de erros e casos de contorno.</p><p><strong>Exploração:</strong></p><ul><li>Happy path: GET /users, GET /users/:id, POST, PUT, DELETE</li><li>Inválido: ID inexistente, formato inválido, sem auth</li><li>Edge cases: ID = 0, -1, muito grande, null, vazio</li><li>Concorrência: PUT simultâneo, DELETE enquanto ler</li><li>Performance: GET com 10k+ registros</li></ul><p><strong>Bugs encontrados:</strong></p><ul><li>DELETE /users/:id retorna 200 mesmo ID inexistente</li><li>POST sem required fields retorna 500 em vez de 400</li><li>GET /users?skip=999999 trava o server</li><li>Auth token não validado em DELETE</li></ul><h3>Boas Práticas</h3><ul><li><strong>1. Respeita Charter — mas sê flexível:</strong> Se descobrir coisa inesperada, segue. Charter é guia, não jaula.</li><li><strong>2. Anota enquanto explora:</strong> Não deixa pra depois. Memória humana é fraca.</li><li><strong>3. Testa o obvio + o criativo:</strong> 50% happy path, 50% criativo.</li><li><strong>4. Pede ajuda:</strong> Stuck? Pergunta a colega. Às vezes trazem ideia nova.</li><li><strong>5. Varia velocidade:</strong> Às vezes explora rápido (encontrar mais bugs). Às vezes devagar (entender bem um aspecto).</li><li><strong>6. Reproduz bugs:</strong> 1 vez é sorte. 3x é pattern. Reproduz sempre antes de reportar.</li><li><strong>7. Sabe quando parar:</strong> Não vale testar tudo. Foca na área mais crítica ou desconhecida.</li></ul><h3>Anti-padrões (O que NÃO fazer)</h3><ul><li>❌ Explorar sem charter (vira caos)</li><li>❌ Não anotar descoberies (esquece)</li><li>❌ Só happy path (encontra pouco)</li><li>❌ Ignorar hints (dev disse 'tenho dúvida nesta lógica', explore ali!)</li><li>❌ Testar sem entender contexto (por que essa feature existe?)</li><li>❌ Reportar bugs sem reproduzir (QA chora)</li></ul><h3>Métricas de Sucesso</h3><p>Em 60 minutos de exploração:</p><ul><li>Idealmente 2-5 bugs reais (criativo, não óbvio)</li><li>3-5 heuristics aplicadas</li><li>80%+ de charter coberto</li><li>Learning: Você aprende 10+ coisas sobre o sistema</li></ul>",
            resources: [
              { label: "Real Bug Stories", url: "https://www.satisfice.com/articles/et-manifesto" },
              { label: "ET Documentation", url: "https://www.satisfice.com/articles/et-manifesto" }
            ]
          }
        ]
      }
    ]
  }
];


