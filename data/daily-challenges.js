/**
 * Daily QA Challenges for Discord Bot
 * Each challenge: unique ID, question, answer, points, difficulty
 */

window.TG_DAILY_CHALLENGES = [
  {
    id: "ch-001",
    question: "Qual é a diferença entre QA e QC?",
    correctAnswer: "QA é preventivo (processos, prevenção). QC é reativo (verificação, encontrar bugs).",
    points: 5,
    difficulty: "easy",
    category: "fundamentals",
    hint: "Pense em prevenção vs detecção"
  },
  {
    id: "ch-002",
    question: "Qual é a Pirâmide de Testes?",
    correctAnswer: "Base (70% unit), Meio (20% integration), Topo (10% E2E). Muitos testes rápidos, poucos testes lentos.",
    points: 7,
    difficulty: "medium",
    category: "test-types",
    hint: "Começa pela base"
  },
  {
    id: "ch-003",
    question: "Qual ferramenta para testes API em JavaScript?",
    correctAnswer: "Supertest, Axios, ou REST-client. Cypress/Playwright também servem.",
    points: 6,
    difficulty: "easy",
    category: "tools",
    hint: "Começa com 'S' ou 'A'"
  },
  {
    id: "ch-004",
    question: "O que é BDD e Gherkin?",
    correctAnswer: "BDD = Behavior Driven Development. Gherkin = linguagem natural (Dado-Quando-Então) que não-técnicos entendem.",
    points: 8,
    difficulty: "hard",
    category: "bdd",
    hint: "Dado, Quando, Então"
  },
  {
    id: "ch-005",
    question: "Como reportar um bug PROFISSIONAL?",
    correctAnswer: "ID, Título claro, Severidade, Steps to Reproduce (passo-a-passo), Expected vs Actual, Screenshot, Environment.",
    points: 9,
    difficulty: "hard",
    category: "best-practices",
    hint: "Deve ser reproduzível"
  },
  {
    id: "ch-006",
    question: "Qual é o SLA em Performance Testing?",
    correctAnswer: "Service Level Agreement. Seu compromisso: 'Página carrega em <2 segundos com <1% de erro'.",
    points: 7,
    difficulty: "medium",
    category: "performance",
    hint: "Sigla com 3 letras"
  },
  {
    id: "ch-007",
    question: "O que é um Data Factory em testes?",
    correctAnswer: "Função/classe que gera dados de teste sob demanda, respeitando constraints e sem conflitos de ID.",
    points: 8,
    difficulty: "hard",
    category: "test-data",
    hint: "Dinâmico, não hardcoded"
  },
  {
    id: "ch-008",
    question: "Qual é a primeira coisa que um QA faz ao receber uma tarefa?",
    correctAnswer: "Ler requisitos/user story com atenção. Fazer perguntas. Entender o contexto de negócio.",
    points: 6,
    difficulty: "medium",
    category: "mindset",
    hint: "Começa com 'L'"
  },
  {
    id: "ch-009",
    question: "O que é teste exploratório?",
    correctAnswer: "Teste onde aprendizado, design e execução acontecem simultaneamente. Sem script pronto. Usar charter (missão com tempo).",
    points: 9,
    difficulty: "hard",
    category: "exploratory",
    hint: "Começa com 'T'"
  },
  {
    id: "ch-010",
    question: "Qual comando Git para enviar código?",
    correctAnswer: "git add . (ou específico), git commit -m 'mensagem', git push",
    points: 5,
    difficulty: "easy",
    category: "git",
    hint: "3 comandos: add, commit, push"
  },
  {
    id: "ch-011",
    question: "O que é SFDIPOT em teste exploratório?",
    correctAnswer: "Mnemônico: Structure, Function, Data, Integration, Platform, Operations, Time. Tipos de teste a explorar.",
    points: 10,
    difficulty: "hard",
    category: "exploratory",
    hint: "7 dimensões"
  },
  {
    id: "ch-012",
    question: "Como evitar testes flaky?",
    correctAnswer: "Isolamento de dados, sem hard-sleeps, use waits explícitos, cleanup após teste, test data independente.",
    points: 8,
    difficulty: "medium",
    category: "best-practices",
    hint: "Testes flaky = instáveis"
  }
];

/**
 * Get challenge for specific date
 * @param {Date} date - Data do desafio
 * @returns {Object} Challenge do dia
 */
function getDailyChallengeForDate(date) {
  // Usa data como seed para determinismo
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % window.TG_DAILY_CHALLENGES.length;
  return window.TG_DAILY_CHALLENGES[index];
}

/**
 * Get today's challenge
 * @returns {Object} Challenge de hoje
 */
function getTodayChallenge() {
  return getDailyChallengeForDate(new Date());
}
