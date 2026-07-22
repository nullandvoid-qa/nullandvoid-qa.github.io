# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sandbox-roadmap.spec.js >> Sandbox and Roadmap details >> sandbox menu loads and example renders
- Location: tests/sandbox-roadmap.spec.js:10:3

# Error details

```
TimeoutError: page.waitForFunction: Timeout 10000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "Null and Void QA Course Home" [ref=e5] [cursor=pointer]:
        - /url: "#"
        - img [ref=e7]
        - generic [ref=e9]:
          - generic [ref=e10]: Null and Void
          - generic [ref=e11]: QA Course
      - generic [ref=e12]:
        - navigation "Main navigation" [ref=e13]:
          - link "Início" [ref=e14] [cursor=pointer]:
            - /url: "#"
          - link "Trilhas" [ref=e15] [cursor=pointer]:
            - /url: "#"
          - link "Rotas" [ref=e16] [cursor=pointer]:
            - /url: "#"
          - link "Glossário" [ref=e17] [cursor=pointer]:
            - /url: "#"
          - link "Labs" [ref=e18] [cursor=pointer]:
            - /url: "#"
          - link "Progresso" [ref=e19] [cursor=pointer]:
            - /url: "#"
          - generic [ref=e20]: Tudo Liberado
        - generic [ref=e21]:
          - button "Alternar para tema claro" [ref=e22] [cursor=pointer]:
            - img [ref=e23]
          - button "Alternar idioma" [ref=e25] [cursor=pointer]:
            - generic [ref=e26]: 🇧🇷
            - generic [ref=e27]: ENG
          - generic [ref=e29]:
            - generic [ref=e30]:
              - button "Fazer Login com o Google. Abre em uma nova guia" [ref=e32] [cursor=pointer]:
                - generic [ref=e34]:
                  - img [ref=e36]
                  - generic [ref=e43]: Fazer Login com o Google
              - iframe
            - button "Entrar como convidado" [ref=e44] [cursor=pointer]
  - main [ref=e45]
  - contentinfo [ref=e46]:
    - paragraph [ref=e47]:
      - strong [ref=e48]: Null and Void
      - text: — Null and Void QA Course · Do iniciante ao sênior
    - paragraph [ref=e49]: Aprenda QA de forma gratuita e prática.
    - paragraph [ref=e50]:
      - link "Discord" [ref=e51] [cursor=pointer]:
        - /url: https://discord.gg/evVQqq4rf
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | test.describe('Sandbox and Roadmap details', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/');
  7  |     await page.waitForLoadState('networkidle');
  8  |   });
  9  | 
  10 |   test('sandbox menu loads and example renders', async ({ page }) => {
  11 |     await page.waitForFunction(() => typeof window.navigate === 'function');
  12 |     await page.evaluate(() => window.navigate('sandbox'));
> 13 |     await page.waitForFunction(() => {
     |                ^ TimeoutError: page.waitForFunction: Timeout 10000ms exceeded.
  14 |       const el = document.getElementById('view-sandbox');
  15 |       return !!el && el.classList.contains('active');
  16 |     });
  17 | 
  18 |     const menuCount = await page.locator('#sandbox-menu .sandbox-item').count();
  19 |     expect(menuCount).toBeGreaterThan(0);
  20 | 
  21 |     await page.evaluate(() => document.querySelector('#sandbox-menu .sandbox-item')?.click());
  22 |     await page.waitForTimeout(200);
  23 |     const exampleText = await page.locator('#sandbox-example').innerText();
  24 |     expect(exampleText.length).toBeGreaterThan(0);
  25 |   });
  26 | 
  27 |   test('roadmap start buttons navigate to track or lesson', async ({ page }) => {
  28 |     await page.waitForFunction(() => typeof window.navigate === 'function');
  29 |     await page.evaluate(() => window.navigate('roadmap'));
  30 |     await page.waitForSelector('#view-roadmap.active');
  31 | 
  32 |     const btnCount = await page.locator('.roadmap-card .roadmap-go').count();
  33 |     expect(btnCount).toBeGreaterThan(0);
  34 | 
  35 |     await page.locator('.roadmap-card .roadmap-go').first().click();
  36 |     await page.waitForSelector('#view-track.active, #view-lesson.active', { timeout: 2000 });
  37 | 
  38 |     const trackActive = await page.locator('#view-track').first().evaluate((el) => el.classList.contains('active'));
  39 |     const lessonActive = await page.locator('#view-lesson').first().evaluate((el) => el.classList.contains('active'));
  40 |     expect(trackActive || lessonActive).toBeTruthy();
  41 |   });
  42 | });
  43 | 
```