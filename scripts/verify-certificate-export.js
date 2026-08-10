const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ acceptDownloads: true });
  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
    // Ensure dashboard is rendered and app helpers available
    await page.evaluate(async () => { if (typeof window.navigate === 'function') await window.navigate('dashboard'); });
    await page.waitForTimeout(500);

    const apiInfo = await page.evaluate(() => ({
      hasTGCertificates: !!window.TG_CERTIFICATES,
      certificateMethods: window.TG_CERTIFICATES ? Object.keys(window.TG_CERTIFICATES).filter((k) => typeof window.TG_CERTIFICATES[k] === 'function') : [],
      jsPDFLoaded: !!window.jsPDF || !!window.jspdf,
      sampleTrack: window.TG_QAWAY_TRACKS ? window.TG_QAWAY_TRACKS[0]?.id : null,
      auth: window.NVAuth ? { authenticated: !!window.NVAuth.isAuthenticated, name: window.NVAuth.getUserName?.() || null } : null,
    }));

    console.log('Certificate API info:', apiInfo);

    // Directly call certificate APIs and return base64 blobs
    const result = await page.evaluate(async () => {
      if (!window.TG_CERTIFICATES) throw new Error('TG_CERTIFICATES missing');
      const trackId = window.TG_QAWAY_TRACKS && window.TG_QAWAY_TRACKS[0] ? window.TG_QAWAY_TRACKS[0].id : 'starter';
      const userName = (window.NVAuth && typeof window.NVAuth.getUserName === 'function') ? window.NVAuth.getUserName() : 'QA Tester';
      const date = new Date();

      const toBase64 = async (blob) => {
        if (!blob) return null;
        const ab = await blob.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(ab);
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
      };

      const pdfBlob = await window.TG_CERTIFICATES.generateCertificate(trackId, userName, date);
      const pdfB64 = await toBase64(pdfBlob);

      const imgBlob = await window.TG_CERTIFICATES.generateShareableCertificate(trackId, userName, date);
      const imgB64 = await toBase64(imgBlob);

      return {
        pdf: { size: pdfBlob.size, type: pdfBlob.type, b64: pdfB64 ? `data:${pdfBlob.type};base64,${pdfB64}` : null },
        image: { size: imgBlob.size, type: imgBlob.type, b64: imgB64 ? `data:${imgBlob.type};base64,${imgB64}` : null },
      };
    });

    // Save files to disk from returned base64 data
    const saved = [];
    if (result.pdf && result.pdf.b64) {
      const pdfPath = path.join(process.cwd(), 'tmp-certificate.pdf');
      const pdfData = result.pdf.b64.split(',')[1];
      require('fs').writeFileSync(pdfPath, Buffer.from(pdfData, 'base64'));
      saved.push({ type: 'pdf', path: pdfPath, size: result.pdf.size });
    }
    if (result.image && result.image.b64) {
      const imgPath = path.join(process.cwd(), 'tmp-certificate.png');
      const imgData = result.image.b64.split(',')[1];
      require('fs').writeFileSync(imgPath, Buffer.from(imgData, 'base64'));
      saved.push({ type: 'image', path: imgPath, size: result.image.size });
    }

    console.log('Saved files:', saved);
    saved.forEach(s => console.log(`${s.type} saved to ${s.path} (${s.size} bytes)`));
  } catch (error) {
    console.error('Certificate export verification failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
