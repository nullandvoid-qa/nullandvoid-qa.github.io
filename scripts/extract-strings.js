const fs = require('fs');
const path = require('path');
const vm = require('vm');

const tracksPath = path.join(__dirname, '..', 'data', 'tracks.js');
const outDir = path.join(__dirname, '..', 'reports');

const src = fs.readFileSync(tracksPath, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox, { filename: 'tracks.js' });
const tracks = sandbox.window.TG_QAWAY_TRACKS || [];

const strings = [];
tracks.forEach((t) => {
  if (t.title) strings.push({ key: `track.${t.id}.title`, text: t.title });
  if (t.description) strings.push({ key: `track.${t.id}.description`, text: t.description });
  const courses = Array.isArray(t.courses) ? t.courses : [];
  courses.forEach((c) => {
    if (c.title) strings.push({ key: `course.${c.id}.title`, text: c.title });
    const lessons = Array.isArray(c.lessons) ? c.lessons : [];
    lessons.forEach((l) => {
      if (l.title) strings.push({ key: `lesson.${l.id}.title`, text: l.title });
    });
  });
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'i18n-strings.json'), JSON.stringify(strings, null, 2));
console.log('i18n-strings.json written to', outDir);
