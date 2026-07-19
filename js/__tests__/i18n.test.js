// Test i18n functions

describe('i18n functions', () => {
  describe('getCurrentLangKey', () => {
    beforeEach(() => {
      // Reset window.lang before each test
      if (typeof window !== 'undefined') {
        window.lang = 'pt';
      }
    });

    test('returns "pt" when lang is "pt"', () => {
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('pt');
    });

    test('returns "en" when lang is "en"', () => {
      if (typeof window !== 'undefined') {
        window.lang = 'en';
      }
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('en');
    });

    test('returns "pt" as fallback when lang is undefined', () => {
      if (typeof window !== 'undefined') {
        delete window.lang;
      }
      const { getCurrentLangKey } = require('../utils.js');
      expect(getCurrentLangKey()).toBe('pt');
    });
  });

  describe('window.t helper', () => {
    beforeEach(() => {
      jest.resetModules();
      window.TG_I18N = {
        pt: { hero: { freeAccessLabel: 'Livre acesso' } },
        en: { hero: { freeAccessLabel: 'Free access' } },
      };
      delete window.t;
    });

    test('returns PT translation when lang is pt', () => {
      window.lang = 'pt';
      require('../app-i18n.js');
      expect(window.t('hero.freeAccessLabel')).toBe('Livre acesso');
    });

    test('returns EN translation when lang is en', () => {
      window.lang = 'en';
      require('../app-i18n.js');
      expect(window.t('hero.freeAccessLabel')).toBe('Free access');
    });

    test('falls back to PT when lang is undefined', () => {
      delete window.lang;
      require('../app-i18n.js');
      expect(window.t('hero.freeAccessLabel')).toBe('Livre acesso');
    });

    test('returns the key when the translation path is missing', () => {
      window.lang = 'pt';
      require('../app-i18n.js');
      expect(window.t('hero.unknownKey')).toBe('hero.unknownKey');
    });
  });
});