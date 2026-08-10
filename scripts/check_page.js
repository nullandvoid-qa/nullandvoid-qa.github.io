const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG['+msg.type()+']', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR', err.message));
  try {
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    const theme = await page.getAttribute('#theme-toggle', 'aria-label');
    const lang = await page.getAttribute('#lang-toggle', 'aria-label');
    const trackCount = await page.locator('.track-card[role="button"]').count();
    const dashboardNav = await page.locator('[data-nav="dashboard"]').count();
    const navType = await page.evaluate(() => typeof window.navigate);
    console.log('theme', theme);
    console.log('lang', lang);
    console.log('tracks', trackCount);
    console.log('dashboardNav', dashboardNav);
    console.log('window.navigate', navType);
  } catch(e){
    console.error('error', e);
  }
  await browser.close();
})();
