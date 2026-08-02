# Page Object Model — Example (Playwright)

## login.page.js

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.submit = page.locator('button[type=submit]');
  }

  async goto() { await this.page.goto('/login'); }
  async login(user, pass){
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}

module.exports = LoginPage;
```

## test example

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../page-objects/login.page');

test('login success', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@test', 'pw');
  await expect(page).toHaveURL('/dashboard');
});
```

Guidance:
- Keep page objects shallow and focused on behavior, not assertions.
- Use fixtures to reuse logged-in sessions where possible to speed E2E runs.
