# Web Automation Project — Forja Frontend

Template profissional para testes E2E com **Page Object Model**, CI/CD completo e relatórios.

## 🎯 Objetivos

- [ ] 20+ testes automatizados com POM
- [ ] Cobertura >80%
- [ ] 0 testes flaky
- [ ] CI rodando em cada PR
- [ ] Relatório HTML + Allure
- [ ] Documentação de manutenção

## 🚀 Quick Start

```bash
npm install
npm test
npm run report
```

## 📁 Estrutura (Page Object Model)

```
web-automation-project/
├── pages/
│   ├── BasePage.js           # Classe base
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── auth.spec.js
│   ├── products.spec.js
│   └── checkout.spec.js
├── fixtures/
│   ├── testData.js           # Dados de teste
│   └── helpers.js            # Funções auxiliares
├── config/
│   ├── playwright.config.js
│   └── env.js
├── .github/workflows/
│   └── ci.yml                # GitHub Actions
└── package.json
```

## 🔧 Page Object Model

**BasePage.js:**
```javascript
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    await this.page.goto(path);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    return this.page.textContent(selector);
  }
}

module.exports = BasePage;
```

**LoginPage.js:**
```javascript
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  async login(username, password) {
    await this.fill('[data-test="username"]', username);
    await this.fill('[data-test="password"]', password);
    await this.click('[data-test="login-button"]');
    await this.page.waitForURL(/inventory/);
  }

  async getErrorMessage() {
    return this.getText('[data-test="error"]');
  }
}

module.exports = LoginPage;
```

**test.spec.js:**
```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test('Login com credenciais válidas', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto('/');
  await login.login('standard_user', 'secret_sauce');
  
  await expect(page).toHaveURL(/inventory/);
});
```

## 📊 Relatórios

### HTML Report (Playwright nativo)
```bash
npm run report
# Abre playwright-report/index.html
```

### Allure Report (mais detalhado)
```bash
npx allure generate --clean -o allure-report
npx allure open allure-report
```

## 🚦 CI/CD Pipeline

Automático em cada push:
- ✅ Lint + Format
- ✅ Testes (todas browsers)
- ✅ Upload artifact
- ✅ Deploy relatório

## 🧪 Estratégia de Testes

### Smoke Tests (rápido)
```bash
npm run test:smoke  # ~2 min
```

### Full Suite
```bash
npm test            # ~15 min, 3 browsers
```

### Debug
```bash
npm run test:debug  # Abre DevTools
```

## 📈 Best Practices

1. **Teste uma coisa por teste**
   ```javascript
   // ❌ Ruim
   test('login and buy', async () => { /* 3 ações */ });
   
   // ✅ Bom
   test('successful login redirects', async () => { /* 1 ação */ });
   ```

2. **Use Page Objects**
   - Centraliza seletores
   - Reutiliza ações
   - Fácil manutenção

3. **Evite hard sleeps**
   ```javascript
   // ❌
   await page.waitForTimeout(2000);
   
   // ✅
   await page.waitForSelector('.product', { timeout: 5000 });
   ```

4. **Teste contra ambiente estável**
   - Use dados de teste fixos
   - Limpe estado entre testes
   - Não dependa da ordem

## 🐛 Debugando Testes Flaky

```bash
# Rode teste 10x para encontrar flakiness
npm run test:repeat -- --times=10

# Trace detalhado
npm run test:trace
```

## 📝 Dúvidas?

- [Playwright Docs](https://playwright.dev)
- [POM Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Discord Null and Void](https://discord.gg/evVQqq4rf)

---

**Autor:** [Your Name]  
**Última atualização:** [Data]  
**Tests:** XX / XX passing  
**Coverage:** XX%
