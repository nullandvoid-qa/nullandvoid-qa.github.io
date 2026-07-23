global.window = { TG_I18N: {
  pt: { nav: { home: 'Início' }, hero: { title: 'Bem-vindo' } },
  en: { nav: { home: 'Home' }, hero: { title: 'Welcome' } },
} };
global.lang = 'pt';
const { t } = require('../js/utils.js');
console.log('t(nav.home)=', t('nav.home'));
