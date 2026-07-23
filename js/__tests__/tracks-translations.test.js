/* eslint-env node */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

function loadTracks() {
  const filePath = path.join(__dirname, '..', '..', 'data', 'tracks.js');
  const content = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, global: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox, { filename: 'tracks.js' });
  return sandbox.window.TG_QAWAY_TRACKS;
}

function loadTranslations() {
  const filePath = path.join(__dirname, '..', '..', 'data', 'translations-en.js');
  const content = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, global: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox, { filename: 'translations-en.js' });
  return sandbox.window.TG_QAWAY_EN;
}

describe('tracks -> translations consistency', () => {
  test('every track has an english translation entry', () => {
    const tracks = loadTracks();
    const translations = loadTranslations();
    expect(translations && translations.tracks).toBeDefined();
    const transTracks = translations.tracks || {};
    tracks.forEach((tr) => {
      expect(Object.prototype.hasOwnProperty.call(transTracks, tr.id)).toBe(true);
    });
  });
});
