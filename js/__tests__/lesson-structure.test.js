const path = require('path');

const { validateLessonStructure } = require('../../scripts/validate-lessons.js');

describe('lesson structure validation', () => {
  test('lesson files should include core sections and no replacement characters', () => {
    const result = validateLessonStructure();

    expect(result.filesChecked).toBeGreaterThan(0);
    expect(result.errors).toEqual([]);
  });
});
