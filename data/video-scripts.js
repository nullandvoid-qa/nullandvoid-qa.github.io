/**
 * 50 Video Script Templates for QA Mastery
 * Each video: 5-10 minutes
 * Format: Ready for YouTube/Vimeo upload with scripts
 */

window.TG_VIDEO_SCRIPTS = [
  // ===== STARTER TRACK (12 videos) =====
  {
    id: "v1-1",
    title: "O que é QA? Diferença entre QA, QC e Tester",
    track: "starter",
    duration: "7 min",
    difficulty: "Iniciante",
    script: `Olá! Neste vídeo vamos entender O QUE É QUALIDADE DE SOFTWARE e por que QA importa.

Muitas pessoas confundem os termos: QA, QC, Tester. Vamos clarificar:

[Slide 1: QA vs QC vs Tester]
- QA (Quality Assurance): Estratégia, processos, prevenção. Pergunta: "Como garantimos qualidade?"
- QC (Quality Control): Verifica o produto. Pergunta: "O produto atende specs?"
- Tester: Executa testes. Ação concreta.

[Slide 2: Exemplo real]
Um banco sem QA rigoroso → vaza dados de clientes → LGPD, processos judiciais, perda de confiança.
Um QA que testa segurança de integração previne isso.

[Slide 3: Por que importa]
- Custo: Bug em produção é 6x mais caro que corrigir em dev
- Reputação: App com bugs = usuários saem
- Negócio: Cada bug que escapa = loss de $$

Conclusão: QA não é encontrar bugs. QA é PREVENIR que bugs cheguem ao usuário.`,
    keyPoints: ["QA vs QC", "Papéis", "ROI", "Custo de bugs"],
    youtubeReady: true,
    estimatedViews: "Vídeo pode ir em playlist 'Fundamentos de QA'"
  },
  {
    id: "v1-2",
    title: "Tipos de Teste: Unitário, Integração, E2E",
    track: "starter",
    duration: "8 min",
    difficulty: "Iniciante",
    script: `Neste vídeo, vamos entender a PIRÂMIDE DE TESTES.

[Slide 1: Pirâmide]
- Base (70%): Unit Tests
- Meio (20%): Integration Tests
- Topo (10%): E2E Tests

[Slide 2: Unit Tests]
- O que: Testa 1 função isolada
- Exemplo: função validateEmail('john@test.com') retorna true
- Rápido: 1000 testes em 1 segundo
- Dev faz

[Slide 3: Integration Tests]
- O que: Testa 2+ componentes juntos
- Exemplo: API recebe request → valida → salva BD → retorna 201
- Meio rápido: 100 testes em 10 segundos
- QA + Dev colaboram

[Slide 4: E2E Tests]
- O que: Simula usuário real
- Exemplo: Acesso site → login → compra → vejo confirmação
- Lento: 50 testes em 5 minutos
- QA faz (Playwright, Cypress)

Conclusão: Use TODOS os 3. Não é "escolha um". Pirâmide = estratégia.`,
    keyPoints: ["Unit", "Integration", "E2E", "Pirâmide"],
    youtubeReady: true
  },
  {
    id: "v1-3",
    title: "Seu Primeiro Caso de Teste Manual",
    track: "starter",
    duration: "6 min",
    difficulty: "Iniciante",
    script: `Como escrever um BOM caso de teste manual? Vamos aprender!

[Slide 1: Estrutura]
ID | Título | Precondições | Steps | Expected | Actual | Status

[Slide 2: Exemplo Real — Login]
ID: TC001
Título: Login com credenciais válidas
Precondições: Usuário existe, navegador aberto em /login
Steps:
1. Digite email: john@test.com
2. Digite password: secret123
3. Clique "Login"
Expected: Redirecionado para /dashboard
Actual: [Complete após testar]
Status: ⬜

[Slide 3: Dicas]
- Seja específico (não "clique no botão" = "clique no botão Login (azul, canto direito)")
- Screenshot obrigatório
- Não assuma conhecimento

Conclusão: Bom caso de teste = qualquer um consegue executar e reproduzir resultado.`,
    keyPoints: ["Caso de Teste", "Estrutura", "Especificidade"],
    youtubeReady: true
  },
  {
    id: "v1-4",
    title: "Git Básico para QA: Clone, Commit, Push",
    track: "starter",
    duration: "9 min",
    difficulty: "Iniciante",
    script: `QA precisa de Git! Vamos aprender o essencial.

[Slide 1: Por que Git]
- Controle de versão
- Colaboração com time
- Histórico de mudanças

[Slide 2: Operações Básicas]
git clone: Copia repo para seu PC
git add: Prepara arquivos
git commit: Salva mudanças
git push: Envia para servidor

[Slide 3: Exemplo Prático]
$ git clone https://github.com/sua-repo
$ cd sua-repo
$ git add test-cases.md
$ git commit -m "Adiciona 5 casos de teste para login"
$ git push

[Slide 4: Workflow QA]
1. Clone repo
2. Edita arquivo de testes
3. Commit com mensagem clara
4. Push
5. Time vê mudanças

Conclusão: Git = colaboração. Essencial em qualquer time.`,
    keyPoints: ["Git", "Clone", "Commit", "Push"],
    youtubeReady: true
  },
  {
    id: "v1-5",
    title: "BDD e Gherkin: Escrevendo Testes em Português",
    track: "starter",
    duration: "8 min",
    difficulty: "Iniciante",
    script: `Teste em Português? SIM! Com BDD e Gherkin.

[Slide 1: O que é BDD]
- Behavior Driven Development
- Escreve testes em linguagem natural
- Dev + QA + PO entendem

[Slide 2: Gherkin Syntax]
Dado (Given): Precondição
Quando (When): Ação
Então (Then): Resultado esperado

[Slide 3: Exemplo]
Funcionalidade: Login de usuário
  Cenário: Login com credenciais válidas
    Dado que estou na página de login
    Quando digito email "john@test.com" e password "secret123"
    E clico no botão "Login"
    Então sou redirecionado para o dashboard

[Slide 4: Ferramentas]
- Cucumber (Java, Node, Python)
- SpecFlow (.NET)
- Todas entendem Gherkin

Conclusão: BDD = ponte entre negócio e código.`,
    keyPoints: ["BDD", "Gherkin", "Dado-Quando-Então"],
    youtubeReady: true
  },
  {
    id: "v1-6",
    title: "Encontrando e Reportando Bugs",
    track: "starter",
    duration: "7 min",
    difficulty: "Iniciante",
    script: `Como reportar um BUG que devs vão LEVAR A SÉRIO?

[Slide 1: Estrutura Profissional]
- ID
- Título (claro e direto)
- Severidade (Critical/High/Medium/Low)
- Steps to Reproduce
- Expected vs Actual
- Screenshot/Evidence

[Slide 2: Exemplo BAD]
Título: "App não funciona"
Descrição: "Cliquei em algo e deu erro"
→ Dev: "Qual algo? Qual erro?"

[Slide 3: Exemplo GOOD]
Título: "Checkout: Cupom aplicado 2x se clicar rápido"
Steps:
1. Adicione produto ao carrinho
2. Vá para checkout
3. Aplique cupom "SAVE10"
4. Clique "Apply" rapidamente 2x
Expected: Desconto aplicado UMA VEZ
Actual: Desconto aplicado 2x (desconto dobra)
Severidade: HIGH

[Slide 4: Por que importa]
- Bug claro = dev corrige rápido
- Bug vago = dev pede clarificação = delay

Conclusão: Você não encontra bug = dev não consegue corrigir.`,
    keyPoints: ["Bug Report", "Steps", "Evidence", "Severidade"],
    youtubeReady: true
  },
  {
    id: "v1-7",
    title: "Checklist de Teste: Sua Arma Secreta",
    track: "starter",
    duration: "6 min",
    difficulty: "Iniciante",
    script: `Checklists não são manuais chatos. São SALVADORES.

[Slide 1: O que é]
Lista de itens a verificar. Cada item = "☐" ou "☑"

[Slide 2: Checklist Simples — Login]
☐ Email válido + password válida = sucesso
☐ Email válido + password inválida = erro
☐ Email inválido + password válida = erro
☐ Email vazio = erro
☐ Password vazio = erro

[Slide 3: Por que funciona]
- Força você testar tudo
- Previne esquecer cenários
- Documenta o que foi testado
- Rápido de executar

[Slide 4: Melhor prática]
- Grupo por feature (não por tipo de teste)
- Keep it small (5-10 itens ideal)
- Revisa regularmente

Conclusão: Checklist = consciência testadeira.`,
    keyPoints: ["Checklist", "Cobertura", "Documentação"],
    youtubeReady: true
  }
];
