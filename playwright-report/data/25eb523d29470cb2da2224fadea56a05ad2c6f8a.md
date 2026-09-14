# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: happy-path.spec.js >> Null and Void QA happy path >> should complete starter quiz and preserve bookmark in dashboard
- Location: tests\happy-path.spec.js:48:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#dashboard-bookmarks')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#dashboard-bookmarks')
    13 × locator resolved to <div id="dashboard-bookmarks">…</div>
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
    - link "Início (current page)":
      - /url: "#"
      - text: Início
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
  - button "Alternar para tema claro" [pressed]
  - button "Alternar idioma": 🇧🇷 ENG
- main:
  - heading "Formação QA com clareza, prática e caminho definido." [level=1]
  - paragraph: Trilhas objetivas, aulas práticas, labs e apoio da comunidade. A melhor jornada gratuita para quem quer virar QA com confiança.
  - button "Explorar trilhas"
  - button "Ver rotas"
  - complementary:
    - text: Livre acesso
    - paragraph: Sem paywall, sem taxa de assinatura, tudo aberto.
    - strong: "5"
    - text: Trilhas
    - strong: "38"
    - text: Aulas
    - strong: R$ 0
    - text: Para sempre Apoio real
    - paragraph: Comunidade, resumos e labs para aprender com confiança.
  - region "Como começar na jornada QA":
    - text: Guia rápido
    - heading "Como começar na jornada QA" [level=2]
    - paragraph: Escolha um caminho claro, pratique com labs e acompanhe seu progresso sem perder o rumo.
    - article:
      - heading "Defina seu ponto de partida" [level=3]
      - paragraph: Use as trilhas ou rotas recomendadas para encontrar o melhor caminho para o seu nível.
    - article:
      - heading "Pratique com foco" [level=3]
      - paragraph: Complete labs e aulas curtas para transformar teoria em hábitos reais de teste.
    - article:
      - heading "Acompanhe seu avanço" [level=3]
      - paragraph: Monitore o progresso no painel para manter motivação e clareza sobre o que vem a seguir.
  - article:
    - text: Trilhas completas
    - heading "Jornada clara do iniciante ao sênior" [level=3]
    - paragraph: Aprenda QA com um caminho definido, sem pagar nada e com foco em prática real.
  - article:
    - text: Labs práticos
    - heading "Exercícios reais de QA" [level=3]
    - paragraph: Testes manuais, automação e análise de resultados em ambientes que simulam o mercado.
  - article:
    - text: Comunidade ativa
    - heading "Suporte e networking" [level=3]
    - paragraph: Entre no Discord, tire dúvidas e cresça junto com outros estudantes e profissionais.
  - link "Entrar na comunidade no Discord":
    - /url: https://discord.gg/evVQqq4rf
    - heading "Comunidade oficial" [level=3]
    - paragraph: Suporte prático para dúvidas e estudos ao vivo.
    - text: Entrar →
  - link "Acessar resumos de livros":
    - /url: /books/index.html
    - heading "Resumos de livros" [level=3]
    - paragraph: Aprenda rápido com materiais selecionados para testers e QA.
    - text: Ler agora →
  - text: Buscar conteúdo
  - searchbox "Buscar conteúdo"
  - button "Todos"
  - button "Iniciante"
  - button "Intermediário"
  - button "Avançado"
  - button "Explorar Trilhas →"
  - button "Ver Rotas"
  - button "Glossário"
  - heading "Trilhas da Guilda" [level=2]
  - text: 5 trilhas · 38 aulas
  - paragraph: Filtradas pelo seu perfil.
  - 'button "Open track: Testes Básicos"':
    - text: Iniciante
    - heading "Testes Básicos" [level=3]
    - paragraph: Sua jornada como recruta da Guilda. Fundamentos de QA, testes manuais e primeiros passos em automação.
    - text: 6 módulos ~6 h Fundamentos de QA Testes manuais BDD/Gherkin 0/6 aulas Em andamento
  - 'button "Open track: Testes Avançados"':
    - text: Intermediário
    - heading "Testes Avançados" [level=3]
    - paragraph: "Técnicas de teste mais sofisticadas: automação, performance, segurança."
    - text: 13 módulos ~13 h Automação Performance Segurança 0/13 aulas Em andamento
  - 'button "Open track: Trilha de Testes Mobile"':
    - text: Intermediário
    - heading "Trilha de Testes Mobile" [level=3]
    - paragraph: Trilha única para testes mobile em emuladores, simuladores e dispositivos reais.
    - text: 4 módulos ~4 h Appium WebDriverIO Android 0/4 aulas Em andamento
  - 'button "Open track: Maestria em QA"':
    - text: Sênior
    - heading "Maestria em QA" [level=3]
    - paragraph: Liderança em qualidade, estratégia de testes, mentoring.
    - text: 8 módulos ~8 h Liderança Estratégia CI/CD 0/8 aulas Em andamento
  - 'button "Open track: Arena de Carga"':
    - text: Sênior
    - heading "Arena de Carga" [level=3]
    - paragraph: Performance testing com K6 e JMeter.
    - text: 7 módulos ~7 h Load Testing K6 JMeter 0/7 aulas Em andamento
  - heading "Por que a Null and Void?" [level=2]
  - paragraph: Iniciante e sênior na mesma plataforma.
  - heading "Iniciante + Sênior" [level=3]
  - paragraph: Dicas e notas Guild Master em cada aula.
  - heading "Tudo liberado" [level=3]
  - paragraph: Sem paywall.
  - heading "9 trilhas" [level=3]
  - paragraph: Do zero à maestria.
  - heading "Progresso local" [level=3]
  - paragraph: Sem cadastro.
- contentinfo:
  - paragraph:
    - strong: Null and Void
    - text: — QA Course
  - paragraph: Plataforma independente.
  - paragraph:
    - link "Comunidade no Discord":
      - /url: https://discord.gg/evVQqq4rf
- status: Quiz aprovado!
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | test.describe('Null and Void QA happy path', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/');
  7  |     await page.waitForLoadState('networkidle');
  8  |   });
  9  | 
  10 |   test('should show auth fallback and navigate to a track, complete lesson, and verify progress', async ({ page }) => {
  11 |     // (guest sign-in removed) continue without local guest auth
  12 | 
  13 |     // Home page should render track cards and allow navigation
  14 |     // Wait for any track-card to appear; if not present, navigate to the tracks view.
  15 |     const hasTracks = await page.waitForFunction(() => document.querySelectorAll('.track-card').length > 0, { timeout: 5000 }).catch(() => null);
  16 |     if (!hasTracks) {
  17 |       await page.evaluate(() => window.navigate('tracks'));
  18 |       await page.waitForSelector('#view-tracks.active');
  19 |     }
  20 |     const firstTrackCard = page.locator('.track-card').first();
  21 |     await expect(firstTrackCard).toBeVisible();
  22 |     await firstTrackCard.click();
  23 | 
  24 |     // Track detail should show breadcrumb and lesson list
  25 |     await expect(page.locator('#track-breadcrumb')).toBeVisible();
  26 |     const firstLesson = page.locator('.lesson-item').first();
  27 |     await expect(firstLesson).toBeVisible();
  28 |     await firstLesson.click();
  29 | 
  30 |     // Lesson page should show complete button and bookmark button
  31 |     const completeButton = page.locator('#btn-complete');
  32 |     const bookmarkButton = page.locator('#btn-bookmark');
  33 |     await expect(completeButton).toBeVisible();
  34 |     await expect(bookmarkButton).toBeVisible();
  35 | 
  36 |     // Mark lesson as complete and confirm the lesson state updates
  37 |     await completeButton.click();
  38 |     await expect(completeButton).toHaveText(/Marcar como não concluída|Mark as incomplete/);
  39 |     await expect(page.locator('#toast')).toHaveClass(/show/);
  40 |     await expect(page.locator('#toast')).toContainText(/Aula concluída|Lesson completed|Conquista desbloqueada!|Achievement unlocked!/);
  41 | 
  42 |     // Navigate to dashboard and verify progress stats updated
  43 |     await page.locator('[data-nav="dashboard"]').click();
  44 |     await expect(page.locator('#dashboard-stats')).toBeVisible();
  45 |     await expect(page.locator('#dashboard-stats')).toContainText(/1\/|1\//);
  46 |   });
  47 | 
  48 |   test('should complete starter quiz and preserve bookmark in dashboard', async ({ page }) => {
  49 |     // (guest sign-in removed) continue without local guest auth
  50 | 
  51 |     await page.evaluate(() => window.navigate('track', { trackId: 'starter' }));
  52 |     await page.waitForTimeout(1000);
  53 | 
  54 |     await expect(page.locator('#track-breadcrumb')).toBeVisible();
  55 |     const quizButton = page.locator('#btn-take-quiz');
  56 |     await expect(quizButton).toBeVisible();
  57 |     await quizButton.click();
  58 | 
  59 |     await expect(page.locator('.quiz-card')).toBeVisible();
  60 |     await expect(page.locator('.quiz-card h2')).toContainText(/Quiz — Testes Básicos|Quiz — Basic Testing/);
  61 | 
  62 |     await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
  63 |     await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
  64 |     await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
  65 |     await page.locator('#quiz-form button[type="submit"]').click();
  66 | 
  67 |     await expect(page.locator('#quiz-result')).toBeVisible();
  68 |     await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);
  69 | 
  70 |     await page.locator('[data-nav="dashboard"]').click();
> 71 |     await expect(page.locator('#dashboard-bookmarks')).toBeVisible();
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  72 |     await expect(page.locator('#dashboard-bookmarks')).toContainText(/Nenhuma aula favoritada ainda.|No bookmarked lessons yet./);
  73 | 
  74 |     await page.evaluate(() => window.navigate('tracks'));
  75 |     await page.waitForTimeout(1000);
  76 |     await page.locator('.track-card', { hasText: 'Testes Básicos' }).first().click();
  77 |     await page.locator('.lesson-item').first().click();
  78 |     await expect(page.locator('#btn-bookmark')).toBeVisible();
  79 |     await page.locator('#btn-bookmark').click();
  80 |     await page.evaluate(() => window.navigate('dashboard'));
  81 |     await page.waitForTimeout(1000);
  82 |     await expect(page.locator('#dashboard-bookmarks')).toContainText(/Testes Básicos|Basic Testing/);
  83 |   });
  84 | 
  85 |   test('should expose the main homepage CTAs and reach the books library', async ({ page }) => {
  86 |     await expect(page.locator('.hero-title')).toContainText(/Formação QA/i);
  87 |     await expect(page.locator('.quick-card')).toHaveCount(2);
  88 | 
  89 |     await page.locator('.quick-card', { hasText: 'Resumos de livros' }).click();
  90 |     await expect(page).toHaveURL(/books\/index\.html$/);
  91 |     await expect(page.locator('.hero h1')).toContainText(/Biblioteca de Resumos/i);
  92 |   });
  93 | });
  94 | 
```