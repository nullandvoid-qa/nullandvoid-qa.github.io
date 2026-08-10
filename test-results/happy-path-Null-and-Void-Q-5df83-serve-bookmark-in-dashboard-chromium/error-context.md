# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: happy-path.spec.js >> Null and Void QA happy path >> should complete starter quiz and preserve bookmark in dashboard
- Location: tests\happy-path.spec.js:48:3

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('label.quiz-option[data-qi="0"][data-oi="1"]')
    - locator resolved to <label data-qi="0" data-oi="1" tabindex="0" role="button" class="quiz-option" aria-label="Garante qualidade via testes e análise">…</label>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    19 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - link "Início (current page)" [ref=e14] [cursor=pointer]:
            - /url: "#"
            - text: Início
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
          - button "Alternar para tema claro" [pressed] [ref=e22] [cursor=pointer]:
            - img [ref=e23]
          - button "Alternar idioma" [ref=e25] [cursor=pointer]:
            - generic [ref=e26]: 🇧🇷
            - generic [ref=e27]: ENG
  - main [ref=e28]:
    - generic [ref=e29]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Formação QA com clareza, prática e caminho definido." [level=1] [ref=e33]
          - paragraph [ref=e34]: Trilhas objetivas, aulas práticas, labs e apoio da comunidade. A melhor jornada gratuita para quem quer virar QA com confiança.
          - generic [ref=e35]:
            - button "Explorar trilhas" [ref=e36] [cursor=pointer]
            - button "Ver rotas" [ref=e37] [cursor=pointer]
        - complementary [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Livre acesso
            - paragraph [ref=e41]: Sem paywall, sem taxa de assinatura, tudo aberto.
          - generic [ref=e42]:
            - generic [ref=e43]:
              - strong [ref=e44]: "5"
              - generic [ref=e45]: Trilhas
            - generic [ref=e46]:
              - strong [ref=e47]: "38"
              - generic [ref=e48]: Aulas
            - generic [ref=e49]:
              - strong [ref=e50]: R$ 0
              - generic [ref=e51]: Para sempre
          - generic [ref=e52]:
            - generic [ref=e53]: Apoio real
            - paragraph [ref=e54]: Comunidade, resumos e labs para aprender com confiança.
      - region "Como começar na jornada QA" [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]: Guia rápido
          - heading "Como começar na jornada QA" [level=2] [ref=e58]
          - paragraph [ref=e59]: Escolha um caminho claro, pratique com labs e acompanhe seu progresso sem perder o rumo.
        - generic [ref=e60]:
          - article [ref=e61]:
            - generic [ref=e62]: "01"
            - heading "Defina seu ponto de partida" [level=3] [ref=e63]
            - paragraph [ref=e64]: Use as trilhas ou rotas recomendadas para encontrar o melhor caminho para o seu nível.
          - article [ref=e65]:
            - generic [ref=e66]: "02"
            - heading "Pratique com foco" [level=3] [ref=e67]
            - paragraph [ref=e68]: Complete labs e aulas curtas para transformar teoria em hábitos reais de teste.
          - article [ref=e69]:
            - generic [ref=e70]: "03"
            - heading "Acompanhe seu avanço" [level=3] [ref=e71]
            - paragraph [ref=e72]: Monitore o progresso no painel para manter motivação e clareza sobre o que vem a seguir.
      - generic [ref=e73]:
        - article [ref=e74]:
          - generic [ref=e75]: Trilhas completas
          - heading "Jornada clara do iniciante ao sênior" [level=3] [ref=e76]
          - paragraph [ref=e77]: Aprenda QA com um caminho definido, sem pagar nada e com foco em prática real.
        - article [ref=e78]:
          - generic [ref=e79]: Labs práticos
          - heading "Exercícios reais de QA" [level=3] [ref=e80]
          - paragraph [ref=e81]: Testes manuais, automação e análise de resultados em ambientes que simulam o mercado.
        - article [ref=e82]:
          - generic [ref=e83]: Comunidade ativa
          - heading "Suporte e networking" [level=3] [ref=e84]
          - paragraph [ref=e85]: Entre no Discord, tire dúvidas e cresça junto com outros estudantes e profissionais.
      - generic [ref=e86]:
        - link "Entrar na comunidade no Discord" [ref=e87] [cursor=pointer]:
          - /url: https://discord.gg/evVQqq4rf
          - img [ref=e89]
          - generic [ref=e91]:
            - heading "Comunidade oficial" [level=3] [ref=e92]
            - paragraph [ref=e93]: Suporte prático para dúvidas e estudos ao vivo.
          - generic [ref=e94]: Entrar →
        - link "Acessar resumos de livros" [ref=e95] [cursor=pointer]:
          - /url: /books/index.html
          - img [ref=e97]
          - generic [ref=e100]:
            - heading "Resumos de livros" [level=3] [ref=e101]
            - paragraph [ref=e102]: Aprenda rápido com materiais selecionados para testers e QA.
          - generic [ref=e103]: Ler agora →
      - generic [ref=e104]:
        - generic [ref=e105]:
          - generic:
            - img
          - generic [ref=e106]: Buscar conteúdo
          - searchbox "Buscar conteúdo" [ref=e107]
        - generic [ref=e109]:
          - button "Todos" [ref=e110] [cursor=pointer]
          - button "Iniciante" [ref=e111] [cursor=pointer]
          - button "Intermediário" [ref=e112] [cursor=pointer]
          - button "Avançado" [ref=e113] [cursor=pointer]
      - generic [ref=e114]:
        - button "Explorar Trilhas →" [ref=e115] [cursor=pointer]
        - button "Ver Rotas" [ref=e116] [cursor=pointer]
        - button "Glossário" [ref=e117] [cursor=pointer]
      - generic [ref=e118]:
        - generic [ref=e119]:
          - heading "Trilhas da Guilda" [level=2] [ref=e120]
          - generic [ref=e121]: 5 trilhas · 38 aulas
        - paragraph [ref=e122]: Filtradas pelo seu perfil.
      - generic [ref=e123]:
        - 'button "Open track: Testes Básicos" [ref=e124] [cursor=pointer]':
          - generic [ref=e125]:
            - img [ref=e127]
            - generic [ref=e130]: Iniciante
          - heading "Testes Básicos" [level=3] [ref=e131]
          - paragraph [ref=e132]: Sua jornada como recruta da Guilda. Fundamentos de QA, testes manuais e primeiros passos em automação.
          - generic [ref=e133]:
            - generic [ref=e134]:
              - img [ref=e135]
              - text: 6 módulos
            - generic [ref=e138]:
              - img [ref=e139]
              - text: ~6 h
          - generic [ref=e142]:
            - generic [ref=e143]: Fundamentos de QA
            - generic [ref=e144]: Testes manuais
            - generic [ref=e145]: BDD/Gherkin
          - generic [ref=e148]: 0/6 aulas Em andamento
        - 'button "Open track: Testes Avançados" [ref=e149] [cursor=pointer]':
          - generic [ref=e150]:
            - img [ref=e152]
            - generic [ref=e155]: Intermediário
          - heading "Testes Avançados" [level=3] [ref=e156]
          - paragraph [ref=e157]: "Técnicas de teste mais sofisticadas: automação, performance, segurança."
          - generic [ref=e158]:
            - generic [ref=e159]:
              - img [ref=e160]
              - text: 13 módulos
            - generic [ref=e163]:
              - img [ref=e164]
              - text: ~13 h
          - generic [ref=e167]:
            - generic [ref=e168]: Automação
            - generic [ref=e169]: Performance
            - generic [ref=e170]: Segurança
          - generic [ref=e173]: 0/13 aulas Em andamento
        - 'button "Open track: Trilha de Testes Mobile" [ref=e174] [cursor=pointer]':
          - generic [ref=e175]:
            - img [ref=e177]
            - generic [ref=e180]: Intermediário
          - heading "Trilha de Testes Mobile" [level=3] [ref=e181]
          - paragraph [ref=e182]: Trilha única para testes mobile em emuladores, simuladores e dispositivos reais.
          - generic [ref=e183]:
            - generic [ref=e184]:
              - img [ref=e185]
              - text: 4 módulos
            - generic [ref=e188]:
              - img [ref=e189]
              - text: ~4 h
          - generic [ref=e192]:
            - generic [ref=e193]: Appium
            - generic [ref=e194]: WebDriverIO
            - generic [ref=e195]: Android
          - generic [ref=e198]: 0/4 aulas Em andamento
        - 'button "Open track: Maestria em QA" [ref=e199] [cursor=pointer]':
          - generic [ref=e200]:
            - img [ref=e202]
            - generic [ref=e205]: Sênior
          - heading "Maestria em QA" [level=3] [ref=e206]
          - paragraph [ref=e207]: Liderança em qualidade, estratégia de testes, mentoring.
          - generic [ref=e208]:
            - generic [ref=e209]:
              - img [ref=e210]
              - text: 8 módulos
            - generic [ref=e213]:
              - img [ref=e214]
              - text: ~8 h
          - generic [ref=e217]:
            - generic [ref=e218]: Liderança
            - generic [ref=e219]: Estratégia
            - generic [ref=e220]: CI/CD
          - generic [ref=e223]: 0/8 aulas Em andamento
        - 'button "Open track: Arena de Carga" [ref=e224] [cursor=pointer]':
          - generic [ref=e225]:
            - img [ref=e227]
            - generic [ref=e230]: Sênior
          - heading "Arena de Carga" [level=3] [ref=e231]
          - paragraph [ref=e232]: Performance testing com K6 e JMeter.
          - generic [ref=e233]:
            - generic [ref=e234]:
              - img [ref=e235]
              - text: 7 módulos
            - generic [ref=e238]:
              - img [ref=e239]
              - text: ~7 h
          - generic [ref=e242]:
            - generic [ref=e243]: Load Testing
            - generic [ref=e244]: K6
            - generic [ref=e245]: JMeter
          - generic [ref=e248]: 0/7 aulas Em andamento
      - generic [ref=e249]:
        - heading "Por que a Null and Void?" [level=2] [ref=e250]
        - paragraph [ref=e251]: Iniciante e sênior na mesma plataforma.
        - generic [ref=e252]:
          - generic [ref=e253]:
            - img [ref=e255]
            - heading "Iniciante + Sênior" [level=3] [ref=e258]
            - paragraph [ref=e259]: Dicas e notas Guild Master em cada aula.
          - generic [ref=e260]:
            - img [ref=e262]
            - heading "Tudo liberado" [level=3] [ref=e265]
            - paragraph [ref=e266]: Sem paywall.
          - generic [ref=e267]:
            - img [ref=e269]
            - heading "9 trilhas" [level=3] [ref=e274]
            - paragraph [ref=e275]: Do zero à maestria.
          - generic [ref=e276]:
            - img [ref=e278]
            - heading "Progresso local" [level=3] [ref=e279]
            - paragraph [ref=e280]: Sem cadastro.
    - generic [ref=e281]:
      - generic [ref=e282]:
        - link "Trilhas" [ref=e283] [cursor=pointer]:
          - /url: "#"
        - generic [ref=e284]: ›
        - generic [ref=e285]: Testes Básicos
      - generic [ref=e286]:
        - generic [ref=e287]:
          - heading "Testes Básicos" [level=1] [ref=e288]:
            - img [ref=e289]
            - text: Testes Básicos
          - paragraph [ref=e291]: Sua jornada como recruta da Guilda. Fundamentos de QA, testes manuais e primeiros passos em automação.
          - generic [ref=e292]:
            - generic [ref=e293]:
              - img [ref=e294]
              - text: 6 módulos
            - generic [ref=e297]:
              - img [ref=e298]
              - text: ~6 horas
            - generic [ref=e301]: Iniciante
          - generic [ref=e303]: 0/6 aulas concluídas 0% Progresso geral
          - button "Fazer Quiz" [active] [ref=e305] [cursor=pointer]:
            - img [ref=e306]
            - text: Fazer Quiz
        - generic [ref=e310]:
          - generic [ref=e311]:
            - generic [ref=e312]:
              - generic [ref=e313]: "1"
              - text: Introdução à Qualidade de Software
            - list [ref=e314]:
              - button "O que é QA e por que importa" [ref=e315] [cursor=pointer]:
                - generic [ref=e317]:
                  - generic [ref=e318]: O que é QA e por que importa
                  - generic [ref=e319]:
                    - img [ref=e320]
                    - text: 50 min ·
                    - generic [ref=e323]: Grátis
                - generic [ref=e324]: Grátis
              - 'button "Papéis: QA, QC e Tester" [ref=e325] [cursor=pointer]':
                - generic [ref=e327]:
                  - generic [ref=e328]: "Papéis: QA, QC e Tester"
                  - generic [ref=e329]:
                    - img [ref=e330]
                    - text: 50 min ·
                    - generic [ref=e333]: Grátis
                - generic [ref=e334]: Grátis
              - button "Critérios de Aceitação e Definição de Pronto" [ref=e335] [cursor=pointer]:
                - generic [ref=e337]:
                  - generic [ref=e338]: Critérios de Aceitação e Definição de Pronto
                  - generic [ref=e339]:
                    - img [ref=e340]
                    - text: 50 min ·
                    - generic [ref=e343]: Grátis
                - generic [ref=e344]: Grátis
          - generic [ref=e345]:
            - generic [ref=e346]:
              - generic [ref=e347]: "2"
              - text: Ciclo de Vida e Tipos de Teste
            - list [ref=e348]:
              - button "SDLC e onde o QA se encaixa" [ref=e349] [cursor=pointer]:
                - generic [ref=e351]:
                  - generic [ref=e352]: SDLC e onde o QA se encaixa
                  - generic [ref=e353]:
                    - img [ref=e354]
                    - text: 55 min ·
                    - generic [ref=e357]: Grátis
                - generic [ref=e358]: Grátis
              - button "Testes funcionais vs não-funcionais" [ref=e359] [cursor=pointer]:
                - generic [ref=e361]:
                  - generic [ref=e362]: Testes funcionais vs não-funcionais
                  - generic [ref=e363]:
                    - img [ref=e364]
                    - text: 55 min ·
                    - generic [ref=e367]: Grátis
                - generic [ref=e368]: Grátis
              - button "Matriz de Risco e Estratégia de Teste" [ref=e369] [cursor=pointer]:
                - generic [ref=e371]:
                  - generic [ref=e372]: Matriz de Risco e Estratégia de Teste
                  - generic [ref=e373]:
                    - img [ref=e374]
                    - text: 55 min ·
                    - generic [ref=e377]: Grátis
                - generic [ref=e378]: Grátis
  - contentinfo [ref=e379]:
    - paragraph [ref=e380]:
      - strong [ref=e381]: Null and Void
      - text: — QA Course
    - paragraph [ref=e382]: Plataforma independente.
    - paragraph [ref=e383]:
      - link "Comunidade no Discord" [ref=e384] [cursor=pointer]:
        - /url: https://discord.gg/evVQqq4rf
        - img [ref=e386]
        - text: Comunidade no Discord
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
> 62 |     await page.locator('label.quiz-option[data-qi="0"][data-oi="1"]').click();
     |                                                                       ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  63 |     await page.locator('label.quiz-option[data-qi="1"][data-oi="2"]').click();
  64 |     await page.locator('label.quiz-option[data-qi="2"][data-oi="1"]').click();
  65 |     await page.locator('#quiz-form button[type="submit"]').click();
  66 | 
  67 |     await expect(page.locator('#quiz-result')).toBeVisible();
  68 |     await expect(page.locator('#quiz-result')).toContainText(/Aprovado!|Passed!/);
  69 | 
  70 |     await page.locator('[data-nav="dashboard"]').click();
  71 |     await expect(page.locator('#dashboard-bookmarks')).toBeVisible();
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