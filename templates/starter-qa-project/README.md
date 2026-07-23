# QA Starter Project — Testes Básicos

Seu ponto de partida para aprender QA do zero. Este template inclui tudo que você precisa para começar testes manuais + primeira automação.

## 🎯 O que você vai fazer

- [ ] Documentar 10 casos de teste manuais
- [ ] Configurar Playwright ou Cypress
- [ ] Escrever 3 testes E2E
- [ ] Reportar 3 bugs com template profissional
- [ ] Fazer commit no GitHub com CI/CD
- [ ] Criar demo video (5 min) dos testes rodando

## 🚀 Quick Start

```bash
# Clone este template
git clone https://github.com/YOUR_USER/qa-starter-project.git
cd qa-starter-project

# Instale dependências
npm install

# Rode testes
npm test

# Veja os relatórios
npm run report
```

## 📁 Estrutura

```
qa-starter-project/
├── test-cases/
│   └── manual-tests.md         # 10 casos de teste documentados
├── automated/
│   ├── tests/
│   │   └── example.spec.js     # 3 testes E2E
│   └── playwright.config.js
├── bug-reports/
│   └── bugs.md                 # 3 bugs reportados
├── docs/
│   └── testing-strategy.md
├── .github/workflows/
│   └── test.yml                # CI automático
└── package.json
```

## 🧪 Testes Manuais

Abra `test-cases/manual-tests.md` e siga o template para documentar seus primeiros 10 testes.

**Template:**
```
## Test Case #1: Login com email válido
**App:** [Sauce Demo](https://www.saucedemo.com)
**Steps:**
1. Acesse https://www.saucedemo.com
2. Digite email: standard_user
3. Digite senha: secret_sauce
4. Clique Login

**Expected:** Redirecionado para /inventory
**Actual:** [complete após teste]
**Status:** ✅ Pass / ❌ Fail
```

## 🤖 Testes Automatizados

Rode os testes com:

```bash
# Headless (rápido)
npm test

# Headed (veja o navegador)
npm run test:headed

# Debug mode
npm run test:debug
```

## 🐛 Reportando Bugs

Use o template em `bug-reports/bugs.md`:

```markdown
## Bug #1: Campo senha não validando caracteres especiais

**App:** [URL]
**Steps to Reproduce:**
1. Clique no campo senha
2. Digite: p@ssw0rd!#$
3. Clique Login

**Expected:** Aceita caracteres especiais

**Actual:** Erro "Invalid character"

**Evidence:** [screenshot aqui]

**Severity:** Medium
**Environment:** Chrome 120 on Windows 11
```

## 🚦 CI/CD Automático

A pipeline `.github/workflows/test.yml` executa:
- ✅ Testes E2E a cada push
- ✅ Gera relatório HTML
- ✅ Valida cobertura (>80%)

Veja logs em: **Settings → Actions**

## 📊 Relatórios

Após rodar testes, abra:

```bash
open playwright-report/index.html
# ou
start playwright-report/index.html  # Windows
```

## 🎓 Próximos Passos

1. Complete 10 testes manuais
2. Escreva 3 testes automatizados (Playwright/Cypress)
3. Encontre 3 bugs reais em apps de teste
4. Grave video mostrando tudo funcionando
5. Faça push para GitHub e compartilhe o link!

## 🤝 Recursos

- [Null and Void Course](https://nullandvoid-qa.github.io) — Complete o curso enquanto trabalha no projeto
- [Playwright Docs](https://playwright.dev) — Aprenda automação web
- [Sauce Demo](https://www.saucedemo.com) — App para treinar
- [The Internet](https://the-internet.herokuapp.com) — Mais cenários

## 📝 Dúvidas?

Abra uma Issue neste repo ou junte-se ao [Discord da Null and Void](https://discord.gg/evVQqq4rf)!

---

**Seu nome:** [adicione aqui]  
**Data de início:** [complete]  
**Progresso:** 0% → [atualize]  
**Tempo gasto:** ~40h (como no curso)
