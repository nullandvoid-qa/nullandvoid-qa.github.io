const fs = require('fs');
const vm = require('vm');
const path = require('path');

function loadTracks() {
  const filePath = path.join(__dirname, '..', 'data', 'tracks.js');
  const content = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {}, global: {} };
  vm.createContext(sandbox);
  try {
    vm.runInContext(content, sandbox, { filename: 'tracks.js' });
  } catch (e) {
    console.error('Failed to evaluate data/tracks.js:', e.message);
    process.exit(2);
  }
  return sandbox.window && sandbox.window.TG_QAWAY_TRACKS;
}

function expectType(obj, key, type, errors, prefix) {
  if (!(key in obj)) {
    errors.push(`${prefix}${key} is missing`);
    return false;
  }
  if (type === 'array') {
    if (!Array.isArray(obj[key])) errors.push(`${prefix}${key} should be an array`);
  } else if (typeof obj[key] !== type) {
    errors.push(`${prefix}${key} should be ${type}`);
  }
  return true;
}

function validate() {
  const tracks = loadTracks();
  const errors = [];
  if (!Array.isArray(tracks)) {
    console.error('No tracks array found in data/tracks.js');
    process.exit(2);
  }

  const seenTrackIds = new Set();
  tracks.forEach((tr, ti) => {
    const tprefix = `track[${ti}] `;
    if (!expectType(tr, 'id', 'string', errors, tprefix)) return;
    if (seenTrackIds.has(tr.id)) errors.push(`${tprefix}duplicate track id '${tr.id}'`);
    seenTrackIds.add(tr.id);
    expectType(tr, 'slug', 'string', errors, tprefix);
    expectType(tr, 'title', 'string', errors, tprefix);
    expectType(tr, 'icon', 'string', errors, tprefix);
    expectType(tr, 'color', 'string', errors, tprefix);
    expectType(tr, 'description', 'string', errors, tprefix);
    expectType(tr, 'level', 'string', errors, tprefix);
    expectType(tr, 'courses', 'array', errors, tprefix);

    if (Array.isArray(tr.courses)) {
      const seenCourseIds = new Set();
      tr.courses.forEach((c, ci) => {
        const cprefix = `${tprefix}course[${ci}] `;
        if (!expectType(c, 'id', 'string', errors, cprefix)) return;
        if (seenCourseIds.has(c.id)) errors.push(`${cprefix}duplicate course id '${c.id}'`);
        seenCourseIds.add(c.id);
        expectType(c, 'title', 'string', errors, cprefix);
        expectType(c, 'lessons', 'array', errors, cprefix);

        if (Array.isArray(c.lessons)) {
          const seenLessonIds = new Set();
          c.lessons.forEach((l, li) => {
            const lprefix = `${cprefix}lesson[${li}] `;
            if (!expectType(l, 'id', 'string', errors, lprefix)) return;
            if (seenLessonIds.has(l.id)) errors.push(`${lprefix}duplicate lesson id '${l.id}'`);
            seenLessonIds.add(l.id);
            expectType(l, 'title', 'string', errors, lprefix);
            expectType(l, 'duration', 'string', errors, lprefix);
            expectType(l, 'content', 'string', errors, lprefix);
          });
        }
      });
    }
  });

  if (errors.length) {
    console.error('Tracks validation failed with the following issues:');
    errors.forEach((e) => console.error(' -', e));
    process.exit(1);
  }

  console.log('Tracks validation passed — all required fields present and types look good.');
}

validate();
