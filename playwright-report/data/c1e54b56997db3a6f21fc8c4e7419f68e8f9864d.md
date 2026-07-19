# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: happy-path.spec.js >> Null and Void QA happy path >> should show auth fallback and navigate to a track, complete lesson, and verify progress
- Location: tests/happy-path.spec.js:10:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.track-card').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.track-card').first()
    14 × locator resolved to <article tabindex="0" role="button" class="track-card">…</article>
       - unexpected value "hidden"

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
  - button "Switch to light theme"
  - button "Switch language": 🇧🇷 ENG
  - img "User avatar"
  - text: Convidado
  - button "Logout"
- main
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
  1   | // @ts-check
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | test.describe('Null and Void QA happy path', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/');
  7   |     await page.waitForLoadState('networkidle');
  8   |   });
  9   | 
  10  |   test('should show auth fallback and navigate to a track, complete lesson, and verify progress', async ({ page }) => {
  11  |     // Guest login fallback should be available locally
  12  |     const guestButton = page.locator('#auth-local-signin');
  13  |     await expect(guestButton).toBeVisible();
  14  |     await guestButton.click();
  15  | 
  16  |     // After guest login, auth profile should appear
  17  |     await expect(page.locator('#auth-user')).toBeVisible();
  18  |     await expect(page.locator('#auth-name')).toHaveText(/Convidado|Signed in as guest/);
  19  | 
  20  |     // Home page should render track cards and allow navigation
  21  |     // Wait for any track-card to appear; if not present, navigate to the tracks view.
  22  |     const hasTracks = await page.waitForFunction(() => document.querySelectorAll('.track-card').length > 0, { timeout: 5000 }).catch(() => null);
  23  |     if (!hasTracks) {
  24  |       await page.evaluate(() => window.navigate('tracks'));
  25  |       await page.waitForSelector('#view-tracks.active');
  26  |     }
  27  |     const firstTrackCard = page.locator('.track-card').first();
> 28  |     await expect(firstTrackCard).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  29  |     await firstTrackCard.click();
  30  | 
  31  |     // Track detail should show breadcrumb and lesson list
  32  |     await expect(page.locator('#track-breadcrumb')).toBeVisible();
  33  |     const firstLesson = page.locator('.lesson-item').first();
  34  |     await expect(firstLesson).toBeVisible();
  35  |     await firstLesson.click();
  36  | 
  37  |     // Lesson page should show complete button and bookmark button
  38  |     const completeButton = page.locator('#btn-complete');
  39  |     const bookmarkButton = page.locator('#btn-bookmark');
  40  |     await expect(completeButton).toBeVisible();
  41  |     await expect(bookmarkButton).toBeVisible();
  42  | 
  43  |     // Mark lesson as complete and confirm the lesson state updates
  44  |     await completeButton.click();
  45  |     await expect(completeButton).toHaveText(/Marcar como não concluída|Mark as incomplete/);
  46  |     await expect(page.locator('#toast')).toHaveClass(/show/);
  47  |     await expect(page.locator('#toast')).toContainText(/Aula concluída|Lesson completed|Conquista desbloqueada!|Achievement unlocked!/);
  48  | 
  49  |     // Navigate to dashboard and verify progress stats updated
  50  |     await page.locator('[data-nav="dashboard"]').click();
  51  |     await expect(page.locator('#dashboard-stats')).toBeVisible();
  52  |     await expect(page.locator('#dashboard-stats')).toContainText(/1\/|1\//);
  53  |   });
  54  | 
  55  |   test('should complete starter quiz and preserve bookmark in dashboard', async ({ page }) => {
  56  |     const guestButton = page.locator('#auth-local-signin');
  57  |     await expect(guestButton).toBeVisible();
  58  |     await guestButton.click();
  59  |     await expect(page.locator('#auth-user')).toBeVisible();
  60  | 
  61  |     await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
  62  |     await page.waitForTimeout(1000);
  63  | 
  64  |     await expect(page.locator('#track-breadcrumb')).toBeVisible();
  65  |     const quizButton = page.locator('#btn-take-quiz');
  66  |     await expect(quizButton).toBeVisible();
  67  |     await quizButton.click();
  68  | 
  69  |     await expect(page.locator('.quiz-card')).toBeVisible();
  70  |     await expect(page.locator('.quiz-card h2')).toContainText(/Quiz — Iniciação da Guilda|Quiz — Guild Initiation/);
  71  | 
  72  |     await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
  73  |     await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
  74  |     await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
  75  |     await page.locator('#quiz-form button[type="submit"]').click();
  76  | 
  77  |     await expect(page.locator('#quiz-result')).toBeVisible();
  78  |     await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);
  79  | 
  80  |     await page.locator('[data-nav="dashboard"]').click();
  81  |     await expect(page.locator('#dashboard-bookmarks')).toBeVisible();
  82  |     await expect(page.locator('#dashboard-bookmarks')).toContainText(/Nenhuma aula favoritada ainda.|No bookmarked lessons yet./);
  83  | 
  84  |     await page.evaluate(() => window.navigate('tracks'));
  85  |     await page.waitForTimeout(1000);
  86  |     await page.locator('.track-card', { hasText: 'Iniciação da Guilda' }).first().click();
  87  |     await page.locator('.lesson-item').first().click();
  88  |     await expect(page.locator('#btn-bookmark')).toBeVisible();
  89  |     await page.locator('#btn-bookmark').click();
  90  |     await page.evaluate(() => window.navigate('dashboard'));
  91  |     await page.waitForTimeout(1000);
  92  |     await expect(page.locator('#dashboard-bookmarks')).toContainText(/Iniciação da Guilda|Guild Initiation/);
  93  |   });
  94  | 
  95  |   test('should expose the main homepage CTAs and reach the books library', async ({ page }) => {
  96  |     await expect(page.locator('.hero-title')).toContainText(/Formação QA/i);
  97  |     await expect(page.locator('.quick-card')).toHaveCount(2);
  98  | 
  99  |     await page.locator('.quick-card', { hasText: 'Resumos de livros' }).click();
  100 |     await expect(page).toHaveURL(/books\/index\.html$/);
  101 |     await expect(page.locator('.hero h1')).toContainText(/Biblioteca de Resumos/i);
  102 |   });
  103 | });
  104 | 
```