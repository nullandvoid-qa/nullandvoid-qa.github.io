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

describe('data/tracks.js structure', () => {
  test('exports an array of tracks with required fields', () => {
    const tracks = loadTracks();
    expect(Array.isArray(tracks)).toBe(true);
    tracks.forEach((tr) => {
      expect(typeof tr.id).toBe('string');
      expect(typeof tr.slug).toBe('string');
      expect(typeof tr.title).toBe('string');
      expect(typeof tr.icon).toBe('string');
      expect(typeof tr.color).toBe('string');
      expect(typeof tr.description).toBe('string');
      expect(typeof tr.level).toBe('string');
      expect(Array.isArray(tr.courses)).toBe(true);

      tr.courses.forEach((c) => {
        expect(typeof c.id).toBe('string');
        expect(typeof c.title).toBe('string');
        expect(Array.isArray(c.lessons)).toBe(true);
        c.lessons.forEach((l) => {
          expect(typeof l.id).toBe('string');
          expect(typeof l.title).toBe('string');
          expect(typeof l.duration).toBe('string');
          expect(typeof l.content).toBe('string');
        });
      });
    });
  });
});
