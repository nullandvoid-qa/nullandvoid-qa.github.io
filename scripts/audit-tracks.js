const fs = require('fs');
const path = require('path');
const vm = require('vm');

const tracksPath = path.join(__dirname, '..', 'data', 'tracks.js');
const outDir = path.join(__dirname, '..', 'reports');

const src = fs.readFileSync(tracksPath, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox, { filename: 'tracks.js' });
const tracks = sandbox.window.TG_QAWAY_TRACKS || [];

const report = tracks.map((t) => {
  const courses = Array.isArray(t.courses) ? t.courses : [];
  let totalLessons = 0;
  const courseDetails = courses.map((c) => {
    const lessons = Array.isArray(c.lessons) ? c.lessons : [];
    totalLessons += lessons.length;
    return { id: c.id || null, title: c.title || null, lessons: lessons.length };
  });

  return {
    id: t.id || null,
    slug: t.slug || null,
    title: t.title || null,
    courses: courses.length,
    totalLessons,
    courseDetails,
    needsAttention: totalLessons < 5,
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tracks-audit.json'), JSON.stringify(report, null, 2));
console.log('tracks-audit.json written to', outDir);
