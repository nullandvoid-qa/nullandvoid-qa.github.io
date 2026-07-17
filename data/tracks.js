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
  }
];
