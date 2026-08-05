const fs = require('fs');
const path = require('path');

describe('SEO metadata', () => {
  const root = path.join(__dirname, '..', '..');

  it('includes canonical, Open Graph, Twitter and structured data tags in the home page', () => {
    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

    expect(indexHtml).toContain('<meta name="description"');
    expect(indexHtml).toContain('<link rel="canonical" href="https://nullandvoid-qa.github.io/"');
    expect(indexHtml).toContain('<meta property="og:title"');
    expect(indexHtml).toContain('<meta property="og:image" content="https://nullandvoid-qa.github.io/images/og-image.svg"');
    expect(indexHtml).toContain('<meta name="twitter:card" content="summary_large_image"');
    expect(indexHtml).toContain('application/ld+json');
  });

  it('also exposes basic SEO metadata on the verification page', () => {
    const verifyHtml = fs.readFileSync(path.join(root, 'verify.html'), 'utf8');

    expect(verifyHtml).toContain('<meta name="description"');
    expect(verifyHtml).toContain('<link rel="canonical" href="https://nullandvoid-qa.github.io/verify.html"');
    expect(verifyHtml).toContain('<meta property="og:title"');
  });
});
