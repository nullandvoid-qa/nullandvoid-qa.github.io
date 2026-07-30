const path = require('path');

const { compareTranslations } = require('../../scripts/sync-translations.js');

describe('i18n meta-data coverage', () => {
  test('all PT-BR keys must have an EN equivalent', () => {
    const origLog = console.log;
    const origErr = console.error;
    console.log = () => {};
    console.error = () => {};

    let exitCode = 0;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; };

    try {
      compareTranslations();
    } finally {
      console.log = origLog;
      console.error = origErr;
      process.exit = origExit;
    }

    expect(exitCode).toBe(0);
  });

  test('PT-BR and EN files are loadable JSON', () => {
    const { loadJson } = require('../../scripts/sync-translations.js');
    const pt = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-pt.json'));
    const en = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-en.json'));

    expect(pt).not.toBeNull();
    expect(en).not.toBeNull();
    expect(Object.keys(pt).length).toBeGreaterThan(0);
    expect(Object.keys(en).length).toBeGreaterThan(0);
  });

  test('both files have the same number of keys', () => {
    const { loadJson } = require('../../scripts/sync-translations.js');
    const pt = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-pt.json'));
    const en = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-en.json'));

    expect(Object.keys(pt).length).toBe(Object.keys(en).length);
  });

  test('key prefixes are balanced (track.*, course.*, lesson.*)', () => {
    const { loadJson } = require('../../scripts/sync-translations.js');
    const pt = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-pt.json'));
    const en = loadJson(path.join(__dirname, '..', '..', 'data', 'translations-en.json'));

    const count = (obj, prefix) => Object.keys(obj).filter((k) => k.startsWith(prefix + '.')).length;

    expect(count(pt, 'track')).toBe(count(en, 'track'));
    expect(count(pt, 'course')).toBe(count(en, 'course'));
    expect(count(pt, 'lesson')).toBe(count(en, 'lesson'));
  });
});