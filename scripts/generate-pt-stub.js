const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'reports', 'i18n-strings.json');
const existingPath = path.join(__dirname, '..', 'data', 'translations-pt.json');
const outPath = path.join(__dirname, '..', 'reports', 'translations-pt-stub.json');

const i18n = fs.existsSync(i18nPath) ? JSON.parse(fs.readFileSync(i18nPath,'utf8')) : [];
const existing = fs.existsSync(existingPath) ? JSON.parse(fs.readFileSync(existingPath,'utf8')) : {};

const stub = {};
i18n.forEach(item => {
  const key = item.key;
  stub[key] = existing[key] || item.text || '';
});

fs.writeFileSync(outPath, JSON.stringify(stub, null, 2));
console.log('translations-pt-stub.json written to reports/');
