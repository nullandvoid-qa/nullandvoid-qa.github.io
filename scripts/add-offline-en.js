const fs = require('fs');
const p = 'data/translations-en.json';
try {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  data.offline = {
    title: 'Null and Void - Offline',
    heading: "You're offline",
    message: 'Content is not available right now, but you can still return to the homepage.',
    cta: 'Return to home',
    lang: 'en'
  };
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  console.log('updated', p);
} catch (err) {
  console.error('failed to update', err);
  process.exit(1);
}
