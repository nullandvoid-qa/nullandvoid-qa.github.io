const fs = require('fs');
const path = require('path');

const stubPath = path.join(__dirname, '..', 'reports', 'translations-pt-stub.json');
const dataPath = path.join(__dirname, '..', 'data', 'translations-pt.json');
const backupPath = path.join(__dirname, '..', 'data', 'translations-pt.json.bak');

function loadJson(p) {
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Failed to parse JSON at', p, e);
    return {};
  }
}

const stub = loadJson(stubPath);
if (!Object.keys(stub).length) {
  console.error('No stub file found or stub empty at', stubPath);
  process.exit(1);
}

const existing = loadJson(dataPath);

// Backup existing
try {
  fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2), 'utf8');
  console.log('Backup written to', backupPath);
} catch (e) {
  console.warn('Could not write backup:', e);
}

// Merge: only add keys that are missing in existing
let added = 0;
Object.keys(stub).forEach((k) => {
  if (existing[k] === undefined || existing[k] === null || existing[k] === '') {
    existing[k] = stub[k] || '';
    added++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Merged ${added} keys into ${dataPath}`);

if (added === 0) console.log('No new keys were merged.');
