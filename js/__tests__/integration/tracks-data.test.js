const fs = require('fs');
const path = require('path');

describe('tracks data contract', () => {
  test('data/tracks.js exports TG_QAWAY_TRACKS and contains starter track', () => {
    const p = path.resolve(__dirname, '../../../data/tracks.js');
    const content = fs.readFileSync(p, 'utf8');
    expect(content).toMatch(/window\.TG_QAWAY_TRACKS\s*=\s*\[/);
    expect(content).toMatch(/id:\s*"starter"/);
  });
});
