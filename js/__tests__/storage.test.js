// Test storage helper functions

describe('Storage helpers', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('loadJson', () => {
    test('returns parsed JSON for valid JSON string', () => {
      localStorage.setItem('test-key', '{"foo":"bar"}');
      const { loadJson } = require('../utils.js');
      const result = loadJson('test-key', null);
      expect(result).toEqual({ foo: 'bar' });
    });

    test('returns fallback for invalid JSON', () => {
      localStorage.setItem('test-key', 'invalid json');
      const { loadJson } = require('../utils.js');
      const result = loadJson('test-key', { default: true });
      expect(result).toEqual({ default: true });
    });

    test('returns fallback for null value', () => {
      const { loadJson } = require('../utils.js');
      const result = loadJson('nonexistent', { default: true });
      expect(result).toEqual({ default: true });
    });

    test('uses validator function when provided', () => {
      localStorage.setItem('test-key', '{"foo":"bar"}');
      const { loadJson } = require('../utils.js');
      const validator = (data) => data.foo === 'bar';
      const result = loadJson('test-key', null, validator);
      expect(result).toEqual({ foo: 'bar' });
    });

    test('returns fallback when validator fails', () => {
      localStorage.setItem('test-key', '{"foo":"bar"}');
      const { loadJson } = require('../utils.js');
      const validator = (data) => data.foo === 'baz';
      const result = loadJson('test-key', { default: true }, validator);
      expect(result).toEqual({ default: true });
    });
  });

  describe('getStorage', () => {
    test('returns value for the primary storage key', () => {
      localStorage.setItem('primary-key', 'primary-value');
      const { getStorage } = require('../utils.js');
      expect(getStorage('primary-key')).toBe('primary-value');
    });

    test('falls back to a legacy key when the primary key is missing', () => {
      localStorage.setItem('legacy-key', 'legacy-value');
      const { getStorage } = require('../utils.js');
      expect(getStorage('primary-key', 'legacy-key')).toBe('legacy-value');
    });
  });

  describe('saveJson', () => {
    test('saves data as JSON string', () => {
      const { saveJson } = require('../utils.js');
      const testData = { lessonId: 'test-1', completed: true };
      saveJson('test-key', testData);
      const retrieved = JSON.parse(localStorage.getItem('test-key'));
      expect(retrieved).toEqual(testData);
    });

    test('overwrites existing data', () => {
      const { saveJson } = require('../utils.js');
      saveJson('test-key', { version: 1 });
      saveJson('test-key', { version: 2 });
      const retrieved = JSON.parse(localStorage.getItem('test-key'));
      expect(retrieved).toEqual({ version: 2 });
    });
  });

  describe('validateProgressData', () => {
    test('validates correct progress structure', () => {
      const { validateProgressData } = require('../utils.js');
      const validData = {
        'lesson-1': { completedAt: '2024-01-01T00:00:00.000Z' },
        'lesson-2': { completedAt: '2024-01-02T00:00:00.000Z' }
      };
      expect(validateProgressData(validData)).toBe(true);
    });

    test('rejects invalid progress structure', () => {
      const { validateProgressData } = require('../utils.js');
      expect(validateProgressData(null)).toBe(false);
      expect(validateProgressData('string')).toBe(false);
      expect(validateProgressData([])).toBe(false);
    });

    test('rejects progress with invalid completedAt', () => {
      const { validateProgressData } = require('../utils.js');
      const invalidData = {
        'lesson-1': { completedAt: 123 } // should be string
      };
      expect(validateProgressData(invalidData)).toBe(false);
    });
  });

  describe('validateBookmarksData', () => {
    test('validates correct bookmarks structure', () => {
      const { validateBookmarksData } = require('../utils.js');
      const validData = ['lesson-1', 'lesson-2', 'lesson-3'];
      expect(validateBookmarksData(validData)).toBe(true);
    });

    test('rejects invalid bookmarks structure', () => {
      const { validateBookmarksData } = require('../utils.js');
      expect(validateBookmarksData(null)).toBe(false);
      expect(validateBookmarksData('string')).toBe(false);
      expect(validateBookmarksData({})).toBe(false);
    });

    test('rejects bookmarks with non-string items', () => {
      const { validateBookmarksData } = require('../utils.js');
      const invalidData = ['lesson-1', 123, 'lesson-3'];
      expect(validateBookmarksData(invalidData)).toBe(false);
    });
  });

  describe('validateQuizzesPassedData', () => {
    test('validates correct quizzes structure', () => {
      const { validateQuizzesPassedData } = require('../utils.js');
      const validData = {
        'web': { passedAt: '2024-01-01T00:00:00.000Z', score: 5 },
        'api': { passedAt: '2024-01-02T00:00:00.000Z', score: 4 }
      };
      expect(validateQuizzesPassedData(validData)).toBe(true);
    });

    test('rejects invalid quizzes structure', () => {
      const { validateQuizzesPassedData } = require('../utils.js');
      expect(validateQuizzesPassedData(null)).toBe(false);
      expect(validateQuizzesPassedData('string')).toBe(false);
      expect(validateQuizzesPassedData([])).toBe(false);
    });

    test('rejects quizzes with invalid score', () => {
      const { validateQuizzesPassedData } = require('../utils.js');
      const invalidData = {
        'web': { passedAt: '2024-01-01T00:00:00.000Z', score: '5' } // should be number
      };
      expect(validateQuizzesPassedData(invalidData)).toBe(false);
    });
  });

  describe('validateChecklistState', () => {
    test('validates a checklist mapping with numeric indexes', () => {
      const { validateChecklistState } = require('../utils.js');
      const validData = {
        starter: [0, 1, 2],
        web: [0],
      };
      expect(validateChecklistState(validData)).toBe(true);
    });

    test('rejects invalid checklist state structures', () => {
      const { validateChecklistState } = require('../utils.js');
      expect(validateChecklistState(null)).toBe(false);
      expect(validateChecklistState('string')).toBe(false);
      expect(validateChecklistState([])).toBe(false);
    });

    test('rejects checklist items with non-numeric indexes', () => {
      const { validateChecklistState } = require('../utils.js');
      const invalidData = {
        starter: ['a', 1],
      };
      expect(validateChecklistState(invalidData)).toBe(false);
    });
  });
});