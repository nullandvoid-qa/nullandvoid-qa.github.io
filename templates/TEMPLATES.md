# 🎓 QA Portfolio Templates

Boilerplates prontos para usar. Clone, customize e comece seu portfolio QA!

## 📋 Guia de Uso

1. **Clone o template:**
   ```bash
   git clone https://github.com/nullandvoid-qa/qa-templates.git
   cd qa-templates/[template-name]
   ```

2. **Customize:**
   - Edite `README.md` com seu nome/goals
   - Adicione seus testes/casos
   - Faça commit no seu GitHub

3. **CI automático:**
   - Push para GitHub
   - GitHub Actions roda testes
   - Relatório gerado automaticamente

4. **Compartilhe:**
   - Coloque URL no currículo
   - Mostre em entrevistas
   - Contribua melhorias ao repo

---

## 🚀 Templates Disponíveis

### 1. **Starter QA Project** ← Comece aqui
- **Para:** Iniciantes (0-3 meses)
- **O que você faz:**
  - 10 testes manuais documentados
  - 3 testes E2E básicos (Playwright)
  - Reportar 3 bugs reais
  - GitHub Actions simples
- **Tempo:** ~40h (velocidade do curso)
- **Tecnologias:** Playwright, GitHub Actions, Markdown
- **Lab:** Sauce Demo
- **[Ir para template →](./starter-qa-project)**

---

### 2. **Web Automation Project** 
- **Para:** Intermediário (3-12 meses)
- **O que você faz:**
  - 20+ testes E2E profissional
  - Page Object Model (POM)
  - Relatórios HTML + Allure
  - CI/CD com quality gates
  - 0 testes flaky
- **Tempo:** ~50h
- **Tecnologias:** Playwright, Page Objects, Allure Reports, Docker
- **Lab:** Sauce Demo, The Internet
- **[Ir para template →](./web-automation-project)**

---

### 3. **API Testing Project**
- **Para:** Intermediário (API focus)
- **O que você faz:**
  - 15+ testes REST com Postman + Newman
  - Schema validation (JSON Schema)
  - Contract testing (Pact)
  - Mock servers
  - CI/CD rodando collection
- **Tempo:** ~45h
- **Tecnologias:** Postman, Newman, JSON Schema, Pact.js
- **Labs:** ReqRes, JSONPlaceholder, PetStore
- **Arquivo:** `api-testing-project/`

---

### 4. **Performance Testing Project**
- **Para:** Sênior (performance focus)
- **O que você faz:**
  - K6 load tests com scripts reais
  - JMeter para stress testing
  - Identificar bottlenecks
  - Relatórios de baseline
  - Integração com CI
- **Tempo:** ~40h
- **Tecnologias:** K6, JMeter, Grafana
- **Labs:** Seu próprio servidor
- **Arquivo:** `performance-testing-project/`

---

### 5. **Security Testing Project**
- **Para:** Sênior (security focus)
- **O que você faz:**
  - OWASP ZAP scanning
  - Manual pentesting
  - Vulnerabilidade reporting
  - DAST + SAST integration
- **Tempo:** ~35h
- **Tecnologias:** OWASP ZAP, Burp Suite Community
- **Labs:** OWASP Juice Shop, DVWA
- **Arquivo:** `security-testing-project/`

---

### 6. **Mobile Automation Project**
- **Para:** Intermediário-Sênior
- **O que você faz:**
  - Testes mobile com Appium
  - Page Objects para mobile
  - Testes em emulador + device real
  - Gestos e orientação
  - CI com Sauce Labs
- **Tempo:** ~40h
- **Tecnologias:** Appium, Appium Inspector
- **Labs:** Android emulator, iOS Simulator
- **Arquivo:** `mobile-automation-project/`

---

### 7. **Accessibility Testing Project**
- **Para:** Intermediário (a11y focus)
- **O que você faz:**
  - Testes WCAG 2.1 AA
  - axe-core automation
  - Manual keyboard navigation
  - Screen reader testing
  - Relatórios de conformidade
- **Tempo:** ~30h
- **Tecnologias:** axe-core, WAVE, NVDA
- **Labs:** WebAIM, sua própria app
- **Arquivo:** `accessibility-testing-project/`

---

### 8. **CI/CD Pipeline Project**
- **Para:** Sênior (DevOps focus)
- **O que você faz:**
  - GitHub Actions workflow completa
  - Docker para ambiente reproduzível
  - Quality gates com coverage
  - Relatórios + badges
  - Slack notifications
- **Tempo:** ~40h
- **Tecnologias:** GitHub Actions, Docker, SonarQube
- **Arquivo:** `cicd-pipeline-project/`

---

### 9. **End-to-End Portfolio**
- **Para:** Showcase profissional
- **O que é:**
  - Combina 2-3 templates acima
  - Projeto real integrado
  - Professionalismo máximo
  - Pronto para entrevista
- **Exemplos:** Login + Checkout + API + Performance
- **Arquivo:** `portfolio-showcase/`

---

## 📊 Selecionando um Template

| Nível | Foco | Template | Duração |
|-------|------|----------|---------|
| **Iniciante** | Fundamentos | Starter QA | 40h |
| **Intermediário** | Web | Web Automation | 50h |
| **Intermediário** | API | API Testing | 45h |
| **Intermediário** | Mobile | Mobile Automation | 40h |
| **Intermediário** | A11y | Accessibility | 30h |
| **Sênior** | Performance | Performance Testing | 40h |
| **Sênior** | Security | Security Testing | 35h |
| **Sênior** | DevOps | CI/CD Pipeline | 40h |
| **Showcase** | Profissional | Portfolio | 100h+ |

---

## ✨ Características Comuns

Todos os templates incluem:

✅ **README completo** — Setup, estrutura, próximos passos  
✅ **Código de exemplo** — Você tem referência  
✅ **GitHub Actions CI** — Testes rodam automáticos  
✅ **.gitignore + package.json** — Pronto para usar  
✅ **Dados de teste** — Fixtures e helpers  
✅ **Relatórios** — HTML ou Allure  
✅ **Documentação** — Best practices  
✅ **Comentários** — Explicação do código  

---

## 🚀 Começar Agora

### Opção 1: Clone direto
```bash
git clone https://github.com/nullandvoid-qa/qa-templates.git
cd qa-templates/starter-qa-project
npm install
npm test
```

### Opção 2: Use como template no GitHub
1. Clique **"Use this template"** em [GitHub](https://github.com/nullandvoid-qa/qa-templates)
2. Crie seu repositório privado ou público
3. Clone localmente e customize

### Opção 3: Download ZIP
[Baixar todos os templates](https://github.com/nullandvoid-qa/qa-templates/archive/main.zip)

---

## 🎓 Integração com Curso

Cada template se integra com [Null and Void Course](https://nullandvoid-qa.github.io):

- **Starter Template** → Complete trilha "Iniciação da Guilda"
- **Web Template** → Complete trilha "Forja Frontend"
- **API Template** → Complete trilha "Oficina de Integração"
- **etc.**

Estude **3-4 semanas**, depois **aplique em 1 template**. Repita com próximas trilhas.

---

## 💬 Precisa de Ajuda?

- [Discord Null and Void](https://discord.gg/evVQqq4rf) — Community viva
- [GitHub Issues](https://github.com/nullandvoid-qa/qa-templates/issues) — Reporte bugs
- [Discussions](https://github.com/nullandvoid-qa/qa-templates/discussions) — Faça perguntas
- [Curso](https://nullandvoid-qa.github.io) — Estude enquanto pratica

---

## 📈 Seu Progresso

- Começou com **Starter**? Ganhou badge 🌱
- Terminou **Web Automation**? Ganhou badge ⚡
- Fez 3+ templates? Ganhou badge 👑

Compartilhe seu progresso no Discord!

---

**Versão:** 1.0  
**Última atualização:** 2024  
**License:** MIT — Use livremente!
