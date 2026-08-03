const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ acceptDownloads: true });
  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
    await page.waitForSelector('button[data-action="download"]', { timeout: 20000 });
    await page.waitForSelector('button[data-action="download-image"]', { timeout: 20000 });

    const apiInfo = await page.evaluate(() => {
      const info = {
        hasTGCertificates: !!window.TG_CERTIFICATES,
        certificateMethods: window.TG_CERTIFICATES ? Object.keys(window.TG_CERTIFICATES).filter((k) => typeof window.TG_CERTIFICATES[k] === 'function') : [],
        jsPDFLoaded: !!window.jsPDF || !!window.jspdf,
        sampleTrack: window.TG_QAWAY_TRACKS ? window.TG_QAWAY_TRACKS[0]?.id : null,
        auth: window.NVAuth ? { authenticated: !!window.NVAuth.isAuthenticated, name: window.NVAuth.getUserName?.() || null } : null,
      };
      return info;
    });

    console.log('Certificate API info:', apiInfo);

    const downloads = [];

    const pdfDownload = page.waitForEvent('download', { timeout: 30000 });
    await page.click('button[data-action="download"]');
    const pdf = await pdfDownload;
    const pdfPath = await pdf.path();
    downloads.push({ type: 'pdf', filename: pdf.suggestedFilename(), path: pdfPath });

    const imageDownload = page.waitForEvent('download', { timeout: 30000 });
    await page.click('button[data-action="download-image"]');
    const image = await imageDownload;
    const imagePath = await image.path();
    downloads.push({ type: 'image', filename: image.suggestedFilename(), path: imagePath });

    console.log('Downloads:', downloads);
    downloads.forEach((d) => {
      console.log(`${d.type} file: ${d.filename}, saved at ${d.path}`);
    });
  } catch (error) {
    console.error('Certificate export verification failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
