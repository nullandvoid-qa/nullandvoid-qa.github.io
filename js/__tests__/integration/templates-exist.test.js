const fs = require('fs');
const path = require('path');

describe('templates presence', () => {
  const files = [
    'content/templates/acceptance-criteria-template.md',
    'content/templates/pom-sample.md',
    'content/templates/ci-pipeline-examples.md'
  ];

  files.forEach((f) => {
    test(`${f} exists and has content`, () => {
      const p = path.resolve(__dirname, '../../../', f);
      const content = fs.readFileSync(p, 'utf8');
      expect(content.length).toBeGreaterThan(20);
      expect(content).toMatch(/Template|Example|CI|POM|Acceptance|Criteria/i);
    });
  });
});
