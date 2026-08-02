const fs = require('fs');
const path = require('path');

describe('lessons count', () => {
  test('there are at least 30 lesson markdown files', () => {
    const dir = path.resolve(__dirname, '../../../content/lessons');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    expect(files.length).toBeGreaterThanOrEqual(30);
  });
});
