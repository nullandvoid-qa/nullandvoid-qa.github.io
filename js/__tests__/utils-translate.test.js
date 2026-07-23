/* eslint-env jest */
describe('utils.t translation helper', () => {
  beforeEach(() => {
    jest.resetModules();
    window.TG_I18N = {
      pt: { nav: { home: 'Início' }, hero: { title: 'Bem-vindo' } },
      en: { nav: { home: 'Home' }, hero: { title: 'Welcome' } },
    };
  });

  test('returns Portuguese value when lang is pt', () => {
    window.lang = 'pt';
    const { t } = require('../utils.js');
    expect(t('nav.home')).toBe('Início');
    expect(t('hero.title')).toBe('Bem-vindo');
  });

  test('returns English value when lang is en', () => {
    window.lang = 'en';
    const { t } = require('../utils.js');
    expect(t('nav.home')).toBe('Home');
    expect(t('hero.title')).toBe('Welcome');
  });

  test('returns fallback when path missing', () => {
    window.lang = 'pt';
    const { t } = require('../utils.js');
    expect(t('non.existent', 'fallback')).toBe('fallback');
  });
});
