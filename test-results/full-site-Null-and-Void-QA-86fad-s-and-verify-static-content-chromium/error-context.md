# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.js >> Null and Void QA full site coverage >> navigate all main pages and verify static content
- Location: tests/full-site.spec.js:15:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#glossary-content article').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#glossary-content article').first()

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - link "Null and Void QA Course Home":
    - /url: "#"
    - text: Null and Void QA Course
  - navigation "Main navigation":
    - link "Início":
      - /url: "#"
    - link "Trilhas":
      - /url: "#"
    - link "Rotas":
      - /url: "#"
    - link "Glossário":
      - /url: "#"
    - link "Labs":
      - /url: "#"
    - link "Progresso":
      - /url: "#"
    - text: Tudo Liberado
  - button "Alternar para tema claro"
  - button "Alternar idioma": 🇧🇷 ENG
  - button "Fazer Login com o Google. Abre em uma nova guia":
    - img
    - text: Fazer Login com o Google
  - iframe
  - button "Entrar como convidado"
- main:
  - heading "Glossário QA" [level=2]
  - paragraph: Termos e conceitos essenciais explicados com clareza.
- contentinfo:
  - paragraph:
    - strong: Null and Void
    - text: — Null and Void QA Course · Do iniciante ao sênior
  - paragraph: Aprenda QA de forma gratuita e prática.
  - paragraph:
    - link "Discord":
      - /url: https://discord.gg/evVQqq4rf
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | const navButton = async (page, dataNav) => {
  5  |   const button = page.locator(`button[data-nav="${dataNav}"]:visible, a[data-nav="${dataNav}"]:visible`);
  6  |   await button.first().click();
  7  | };
  8  | 
  9  | test.describe('Null and Void QA full site coverage', () => {
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await page.goto('/');
  12 |     await page.waitForLoadState('networkidle');
  13 |   });
  14 | 
  15 |   test('navigate all main pages and verify static content', async ({ page }) => {
  16 |     await expect(page.locator('header .logo')).toBeVisible();
  17 |     await expect(page.locator('main .hero')).toBeVisible();
  18 | 
  19 |     await navButton(page, 'tracks', 'Explorar trilhas');
  20 |     await expect(page.locator('#view-tracks')).toHaveClass(/active/);
  21 |     const tracksCount = await page.locator('#view-tracks .track-card').count();
  22 |     expect(tracksCount).toBeGreaterThan(0);
  23 | 
  24 |     await navButton(page, 'roadmap', 'Ver rotas');
  25 |     await expect(page.locator('#view-roadmap')).toHaveClass(/active/);
  26 |     await expect(page.locator('.roadmap-card').first()).toBeVisible();
  27 | 
  28 |     await navButton(page, 'glossary', 'Glossário');
  29 |     await expect(page.locator('#view-glossary')).toHaveClass(/active/);
> 30 |     await expect(page.locator('#glossary-content article').first()).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
  31 | 
  32 |     await navButton(page, 'labs', 'Labs');
  33 |     await expect(page.locator('#view-labs')).toHaveClass(/active/);
  34 |     await expect(page.locator('#labs-content .lab-card').first()).toBeVisible();
  35 | 
  36 |     await navButton(page, 'dashboard', 'Progresso');
  37 |     await expect(page.locator('#view-dashboard')).toHaveClass(/active/);
  38 |     await expect(page.locator('#dashboard-stats')).toBeVisible();
  39 |   });
  40 | 
  41 |   test('complete a quiz, toggle language, and verify dashboard updates', async ({ page }) => {
  42 |     await page.locator('#auth-local-signin').click();
  43 |     await expect(page.locator('#auth-user')).toBeVisible();
  44 | 
  45 |     await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
  46 |     await page.waitForTimeout(1000);
  47 |     await expect(page.locator('#track-breadcrumb')).toContainText('Iniciação da Guilda');
  48 | 
  49 |     await page.locator('#btn-take-quiz').click();
  50 |     await expect(page.locator('.quiz-card')).toBeVisible();
  51 | 
  52 |     await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
  53 |     await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
  54 |     await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
  55 |     await page.locator('#quiz-form button[type="submit"]').click();
  56 | 
  57 |     await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);
  58 | 
  59 |     await expect(page.locator('#lang-toggle')).toBeVisible();
  60 |     await page.locator('#lang-toggle').click();
  61 |     await expect(page.locator('#lang-label')).not.toBeEmpty();
  62 | 
  63 |     await page.evaluate(() => window.navigate('dashboard'));
  64 |     await page.waitForTimeout(1000);
  65 |     await expect(page.locator('#dashboard-stats')).toContainText(/1\/9/);
  66 |   });
  67 | 
  68 |   test('bookmark a lesson and verify it appears in dashboard bookmarks', async ({ page }) => {
  69 |     await page.locator('#auth-local-signin').click();
  70 |     await expect(page.locator('#auth-user')).toBeVisible();
  71 | 
  72 |     await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
  73 |     await page.waitForTimeout(1000);
  74 |     await page.locator('.lesson-item').first().click();
  75 |     await expect(page.locator('#btn-bookmark')).toBeVisible();
  76 |     await page.locator('#btn-bookmark').click();
  77 | 
  78 |     await page.evaluate(() => window.navigate('dashboard'));
  79 |     await page.waitForTimeout(1000);
  80 |     await expect(page.locator('#dashboard-bookmarks')).toContainText(/Iniciação da Guilda|Guild Initiation/);
  81 |   });
  82 | });
  83 | 
```