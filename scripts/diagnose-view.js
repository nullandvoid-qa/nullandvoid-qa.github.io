const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push({ type: 'console', text: msg.text() }); });
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
  const initialState = await page.evaluate(() => ({
    currentView: window.currentView || null,
    nvAppView: window.NVApp?.state?.currentView || null,
    activeNav: document.querySelector('.nav-links a.active')?.dataset?.nav || null,
    activeView: document.querySelector('.view.active')?.id || null,
  }));

  await page.evaluate(() => {
    if (typeof window.navigate === 'function') {
      window.navigate('tracks');
    }
  });
  await page.waitForTimeout(500);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const postReloadState = await page.evaluate(() => ({
    currentView: window.currentView || null,
    nvAppView: window.NVApp?.state?.currentView || null,
    activeNav: document.querySelector('.nav-links a.active')?.dataset?.nav || null,
    activeView: document.querySelector('.view.active')?.id || null,
  }));

  const summary = await page.evaluate(() => {
    const activeLink = document.querySelector('.nav-links a.active');
    const activeView = document.querySelector('.view.active');
    const tracksGrid = document.getElementById('tracks-grid');
    const homeTracksGrid = document.getElementById('home-tracks-grid');
    const homeTracksEmpty = document.getElementById('home-tracks-empty');
    const tracksGridItems = tracksGrid ? Array.from(tracksGrid.children).map((child) => child.className) : [];
    const homeTracksGridItems = homeTracksGrid ? Array.from(homeTracksGrid.children).map((child) => child.className) : [];
    const homeView = document.getElementById('view-home');
    const homeVisible = homeView ? homeView.classList.contains('active') : false;
    const tracksView = document.getElementById('view-tracks');
    const tracksVisible = tracksView ? tracksView.classList.contains('active') : false;
    const navLinks = Array.from(document.querySelectorAll('.nav-links a')).map((a) => ({
      nav: a.dataset.nav,
      class: a.className,
      href: a.getAttribute('href'),
      text: a.textContent.trim(),
    }));
    const appState = window.NVApp ? {
      currentView: window.NVApp.state.currentView,
      viewParams: window.NVApp.state.viewParams,
      tracks: Array.isArray(window.NVApp.state.tracks) ? window.NVApp.state.tracks.length : null,
      lang: window.NVApp.state.lang,
    } : null;
    const globals = {
      windowCurrentView: window.currentView || null,
      windowViewParams: window.viewParams || null,
    };
    const sw = navigator.serviceWorker && navigator.serviceWorker.controller ? {
      scriptURL: navigator.serviceWorker.controller.scriptURL,
      state: navigator.serviceWorker.controller.state,
    } : null;
    return {
      serviceWorker: sw,
      activeNav: activeLink?.dataset?.nav || null,
      activeViewId: activeView?.id || null,
      viewClass: activeView?.className || null,
      tracksGridExists: !!tracksGrid,
      tracksGridItems,
      tracksGridHtml: tracksGrid ? tracksGrid.innerHTML.slice(0, 400) : null,
      homeVisible,
      tracksVisible,
      trackCount: (window.TG_QAWAY_TRACKS || []).length,
      appState,
      globals,
      navLinks,
    };
  });
  console.log(JSON.stringify({ summary, errors }, null, 2));
  await browser.close();
})();
