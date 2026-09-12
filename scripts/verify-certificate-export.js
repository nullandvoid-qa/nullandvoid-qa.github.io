const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');

// Helper to serve static files if server isn't running
function startStaticServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };

  const server = http.createServer((req, res) => {
    const safePath = path.normalize(req.url.split('?')[0]).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(rootDir, safePath === '/' ? 'index.html' : safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve(server);
    });
  });
}

(async () => {
  const PORT = 8000;
  let server = null;

  // Check if port 8000 is already active
  const isPortActive = await new Promise((res) => {
    const req = http.get(`http://localhost:${PORT}`, () => res(true));
    req.on('error', () => res(false));
    req.end();
  });

  if (!isPortActive) {
    server = await startStaticServer(PORT);
    console.log(`[Verify Cert] Local static server started on port ${PORT}`);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ acceptDownloads: true });

  try {
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.TG_CERTIFICATES !== 'undefined', { timeout: 10000 });
    await page.evaluate(async () => {
      if (typeof window.navigate === 'function') await window.navigate('dashboard');
    });

    const apiInfo = await page.evaluate(() => ({
      hasTGCertificates: !!window.TG_CERTIFICATES,
      certificateMethods: window.TG_CERTIFICATES
        ? Object.keys(window.TG_CERTIFICATES).filter((k) => typeof window.TG_CERTIFICATES[k] === 'function')
        : [],
      jsPDFLoaded: !!window.jsPDF || !!window.jspdf,
      sampleTrack: window.TG_QAWAY_TRACKS ? window.TG_QAWAY_TRACKS[0]?.id : null,
      auth: window.NVAuth
        ? { authenticated: !!window.NVAuth.isAuthenticated, name: window.NVAuth.getUserName?.() || null }
        : null,
    }));

    console.log('Certificate API info:', apiInfo);

    const result = await page.evaluate(async () => {
      if (!window.TG_CERTIFICATES) throw new Error('TG_CERTIFICATES missing');
      const trackId = window.TG_QAWAY_TRACKS && window.TG_QAWAY_TRACKS[0] ? window.TG_QAWAY_TRACKS[0].id : 'starter';
      const userName = (window.NVAuth && typeof window.NVAuth.getUserName === 'function') ? window.NVAuth.getUserName() : 'QA Tester';
      const date = new Date();

      const pdfBlob = await window.TG_CERTIFICATES.generateCertificate(trackId, userName, date);
      const imgBlob = await window.TG_CERTIFICATES.generateShareableCertificate(trackId, userName, date);

      return {
        pdfSize: pdfBlob ? pdfBlob.size : 0,
        pdfType: pdfBlob ? pdfBlob.type : null,
        imageSize: imgBlob ? imgBlob.size : 0,
        imageType: imgBlob ? imgBlob.type : null,
      };
    });

    console.log('Certificate generation result:', result);

    if (result.pdfSize > 0 && result.imageSize > 0) {
      console.log('✅ Certificate PDF & Shareable Image export verification PASSED!');
    } else {
      throw new Error(`Export result invalid: PDF size ${result.pdfSize}, Image size ${result.imageSize}`);
    }
  } catch (error) {
    console.error('Certificate export verification failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (server) {
      server.close();
    }
  }
})();
