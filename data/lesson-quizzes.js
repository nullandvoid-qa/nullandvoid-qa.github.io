/**
 * Inline lesson quizzes — mini-quizzes dentro de cada aula
 * Formato: lesson-id → { pt: {...}, en: {...} }
 * Cada quiz tem 2-3 perguntas rápidas (1-2 min)
 */

window.TG_LESSON_QUIZZES = {
  // STARTER TRACK
  "s1-l1": {
    pt: {
      title: "Teste rápido: O que é QA?",
      passScore: 1,
      questions: [
        {
          q: "Qual é o foco PRINCIPAL de um QA?",
          options: ["Executar testes", "Prevenir bugs e garantir qualidade", "Escrever código", "Fazer deploy"],
          correct: 1,
          explain: "QA é proativo — garante qualidade desde o design, não só reativo encontrando bugs."
        },
        {
          q: "Um bug encontrado cedo custa X menos que em produção. Quanto?",
          options: ["2x", "6x", "10x", "50x"],
          correct: 1,
          explain: "Segundo Gartner, um bug em produção é ~6x mais caro de corrigir."
        }
      ]
    },
    en: {
      title: "Quick Test: What is QA?",
      passScore: 1,
      questions: [
        {
          q: "What is QA's PRIMARY focus?",
          options: ["Run tests", "Prevent bugs and ensure quality", "Write code", "Deploy"],
          correct: 1,
          explain: "QA is proactive — ensures quality from design, not just reactive bug hunting."
        },
        {
          q: "A bug found early costs X less than in production. How much?",
          options: ["2x", "6x", "10x", "50x"],
          correct: 1,
          explain: "According to Gartner, a production bug is ~6x more expensive to fix."
        }
      ]
    }
  },

  "s1-l2": {
    pt: {
      title: "Teste rápido: Papéis em QA",
      passScore: 1,
      questions: [
        {
          q: "QA e Tester fazem a mesma coisa?",
          options: ["Sim", "Não — QA é estratégico, Tester é executor", "Nunca — são departamentos diferentes", "Às vezes"],
          correct: 1,
          explain: "QA planeja desde requisitos; Tester executa testes. Em Agile moderno, uma pessoa faz ambos mas com mentalidade diferente."
        }
      ]
    },
    en: {
      title: "Quick Test: QA Roles",
      passScore: 1,
      questions: [
        {
          q: "Do QA and Tester do the same thing?",
          options: ["Yes", "No — QA is strategic, Tester is executor", "Never — different departments", "Sometimes"],
          correct: 1,
          explain: "QA plans from requirements; Tester executes tests. In modern Agile, one person does both with different mindset."
        }
      ]
    }
  },

  "s2-l1": {
    pt: {
      title: "Teste rápido: SDLC e Shift-left",
      passScore: 1,
      questions: [
        {
          q: "Shift-left significa:",
          options: ["Mover mouse para esquerda", "Trazer QA para perto do início do projeto", "Virar à esquerda", "Reduzir testes"],
          correct: 1,
          explain: "Shift-left = QA participa desde requisitos, não só depois do desenvolvimento."
        },
        {
          q: "QA no planejamento pode perguntar:",
          options: ["Nada, só testa depois", "Qual é o critério de aceite? Como testamos? Que risks faltam?", "Por que vocês codificam assim?", "Quando vamos às férias?"],
          correct: 1,
          explain: "Boas perguntas de QA cedo economizam retrabalho depois."
        }
      ]
    },
    en: {
      title: "Quick Test: SDLC & Shift-left",
      passScore: 1,
      questions: [
        {
          q: "Shift-left means:",
          options: ["Move mouse left", "Bring QA close to project start", "Turn left", "Reduce tests"],
          correct: 1,
          explain: "Shift-left = QA participates from requirements, not just after development."
        },
        {
          q: "QA in planning can ask:",
          options: ["Nothing, just test later", "What's the acceptance criterion? How do we test? What risks are missing?", "Why do you code like that?", "When do we go on vacation?"],
          correct: 1,
          explain: "Good QA questions early save rework later."
        }
      ]
    }
  },

  "s2-l2": {
    pt: {
      title: "Teste rápido: Pirâmide de testes",
      passScore: 1,
      questions: [
        {
          q: "Distribuição ideal de testes na pirâmide:",
          options: ["70% unitários, 20% integração, 10% E2E", "70% E2E, 20% integração, 10% unitário", "50/50/0", "Não importa"],
          correct: 0,
          explain: "Base larga (unitários) = rápidos e isolados. Topo (E2E) = devagar mas representa jornada real."
        },
        {
          q: "Por que E2E é 10% só?",
          options: ["Não é importante", "São lentos (5-30s cada) e frágeis", "Não existem testes E2E", "Melhor é 90%"],
          correct: 1,
          explain: "Use E2E onde realmente importa validar jornada real. Resto, teste em nível inferior (mais rápido)."
        }
      ]
    },
    en: {
      title: "Quick Test: Test Pyramid",
      passScore: 1,
      questions: [
        {
          q: "Ideal test distribution in pyramid:",
          options: ["70% unit, 20% integration, 10% E2E", "70% E2E, 20% integration, 10% unit", "50/50/0", "Doesn't matter"],
          correct: 0,
          explain: "Wide base (units) = fast and isolated. Top (E2E) = slow but represents real journey."
        },
        {
          q: "Why is E2E only 10%?",
          options: ["Not important", "They're slow (5-30s each) and fragile", "E2E tests don't exist", "Better to be 90%"],
          correct: 1,
          explain: "Use E2E where validating real journey truly matters. Rest, test at lower level (faster)."
        }
      ]
    }
  },

  // WEB TRACK
  "web-l5": {
    pt: {
      title: "Teste rápido: Seletores",
      passScore: 1,
      questions: [
        {
          q: "Pior seletor para manutenibilidade:",
          options: ["data-testid='submit'", "button:nth-child(3) > span", "role='button'", "Todos são iguais"],
          correct: 1,
          explain: "nth-child quebra fácil com mudanças de layout. data-testid é robusto porque foi designado para testes."
        }
      ]
    },
    en: {
      title: "Quick Test: Selectors",
      passScore: 1,
      questions: [
        {
          q: "Worst selector for maintainability:",
          options: ["data-testid='submit'", "button:nth-child(3) > span", "role='button'", "All are equal"],
          correct: 1,
          explain: "nth-child breaks easily with layout changes. data-testid is robust because it's designed for testing."
        }
      ]
    }
  },

  // API TRACK
  "api-l1": {
    pt: {
      title: "Teste rápido: HTTP Basics",
      passScore: 1,
      questions: [
        {
          q: "200 vs 201 em API REST:",
          options: ["200 = erro, 201 = sucesso", "200 = OK retornar recurso, 201 = Criado (POST)", "Iguais", "Não existe 201"],
          correct: 1,
          explain: "201 Created é semântica específica para POST. 200 OK é genérico para qualquer sucesso."
        }
      ]
    },
    en: {
      title: "Quick Test: HTTP Basics",
      passScore: 1,
      questions: [
        {
          q: "200 vs 201 in REST API:",
          options: ["200 = error, 201 = success", "200 = OK return resource, 201 = Created (POST)", "Same", "201 doesn't exist"],
          correct: 1,
          explain: "201 Created is specific semantics for POST. 200 OK is generic for any success."
        }
      ]
    }
  },

  // PERFORMANCE TRACK
  "perf-l1": {
    pt: {
      title: "Teste rápido: Métricas de performance",
      passScore: 1,
      questions: [
        {
          q: "p99 vs p95 em load test — qual é mais rigoroso?",
          options: ["p95", "p99 — 1% dos requests pode ser lento", "Iguais", "Depende da hora"],
          correct: 1,
          explain: "p99 é mais strict. Se p99 < 500ms, garante que até 99% das requisições estão rápidas."
        }
      ]
    },
    en: {
      title: "Quick Test: Performance Metrics",
      passScore: 1,
      questions: [
        {
          q: "p99 vs p95 in load test — which is more strict?",
          options: ["p95", "p99 — 1% of requests can be slow", "Same", "Depends on time"],
          correct: 1,
          explain: "p99 is stricter. If p99 < 500ms, guarantees up to 99% of requests are fast."
        }
      ]
    }
  },

  // SECURITY TRACK
  "sec-l1": {
    pt: {
      title: "Teste rápido: OWASP",
      passScore: 1,
      questions: [
        {
          q: "SQL Injection é causada por:",
          options: ["Cache", "Input não sanitizado em queries SQL", "Cookies", "Gzip"],
          correct: 1,
          explain: "Sempre sanitize/parametrize inputs SQL. Nunca concatene strings em queries."
        }
      ]
    },
    en: {
      title: "Quick Test: OWASP",
      passScore: 1,
      questions: [
        {
          q: "SQL Injection is caused by:",
          options: ["Cache", "Unsanitized input in SQL queries", "Cookies", "Gzip"],
          correct: 1,
          explain: "Always sanitize/parameterize SQL inputs. Never concatenate strings in queries."
        }
      ]
    }
  },

  // ACCESSIBILITY TRACK
  "a11y-l1": {
    pt: {
      title: "Teste rápido: WCAG Basics",
      passScore: 1,
      questions: [
        {
          q: "WCAG AA requer contraste mínimo de:",
          options: ["2:1", "4.5:1", "1:1", "10:1"],
          correct: 1,
          explain: "4.5:1 é o padrão para texto pequeno em WCAG AA. AAA requer 7:1."
        }
      ]
    },
    en: {
      title: "Quick Test: WCAG Basics",
      passScore: 1,
      questions: [
        {
          q: "WCAG AA requires minimum contrast of:",
          options: ["2:1", "4.5:1", "1:1", "10:1"],
          correct: 1,
          explain: "4.5:1 is the standard for small text in WCAG AA. AAA requires 7:1."
        }
      ]
    }
  },

  // DEVOPS TRACK
  "devops-l1": {
    pt: {
      title: "Teste rápido: CI/CD Quality Gates",
      passScore: 1,
      questions: [
        {
          q: "Quality gate deve bloquear merge quando:",
          options: ["Dev quer", "Coverage < 80% ou testes críticos falham", "Sempre", "Nunca"],
          correct: 1,
          explain: "Gates protegem main. Sem cobertura ou falhas = não deveria estar em produção."
        }
      ]
    },
    en: {
      title: "Quick Test: CI/CD Quality Gates",
      passScore: 1,
      questions: [
        {
          q: "Quality gate should block merge when:",
          options: ["Dev wants", "Coverage < 80% or critical tests fail", "Always", "Never"],
          correct: 1,
          explain: "Gates protect main. No coverage or failures = shouldn't be in production."
        }
      ]
    }
  },

  // LEADERSHIP TRACK
  "lead-l1": {
    pt: {
      title: "Teste rápido: Test Strategy",
      passScore: 1,
      questions: [
        {
          q: "Estratégia de teste deve ser:",
          options: ["Escrita uma vez e nunca alterada", "Viva, revisada e refinada com o time regularmente", "Secreta", "Só para QA sênior"],
          correct: 1,
          explain: "Estratégia evolui com o produto, equipe e riscos. Revisitar a cada quarter."
        }
      ]
    },
    en: {
      title: "Quick Test: Test Strategy",
      passScore: 1,
      questions: [
        {
          q: "Test strategy should be:",
          options: ["Written once and never changed", "Living, reviewed and refined with team regularly", "Secret", "For senior QA only"],
          correct: 1,
          explain: "Strategy evolves with product, team, and risks. Revisit every quarter."
        }
      ]
    }
  }
};
