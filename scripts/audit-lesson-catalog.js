/* eslint-env node */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const LESSONS_DIR = path.join(ROOT, 'content', 'lessons');
const TRACKS_PATH = path.join(ROOT, 'data', 'tracks.js');
const PERFORMANCE_TRACK_PATH = path.join(ROOT, 'data', 'performance-track.js');
const REPORT_PATH = path.join(ROOT, 'reports', 'lesson-catalog-audit.json');

function readEditorialLessons() {
  return fs.readdirSync(LESSONS_DIR)
    .filter((file) => /^(l\d+|perf-l\d+)\.md$/.test(file))
    .sort()
    .map((file) => {
      const source = fs.readFileSync(path.join(LESSONS_DIR, file), 'utf8');
      const titleMatch = source.match(/^title:\s*(.+)$/m);
      const durationMatch = source.match(/^duration:\s*(.+)$/m);
      return {
        id: file.slice(0, -3),
        file: `content/lessons/${file}`,
        title: titleMatch ? titleMatch[1].trim() : null,
        duration: durationMatch ? durationMatch[1].trim() : null,
      };
    });
}

function readCatalogLessons() {
  const source = fs.readFileSync(TRACKS_PATH, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: TRACKS_PATH });
  const tracks = [...(sandbox.window.TG_QAWAY_TRACKS || [])];
  const performanceSource = fs.readFileSync(PERFORMANCE_TRACK_PATH, 'utf8');
  vm.runInNewContext(performanceSource, sandbox, { filename: PERFORMANCE_TRACK_PATH });
  if (sandbox.window.TG_PERFORMANCE_TRACK) {
    tracks.push(sandbox.window.TG_PERFORMANCE_TRACK);
  }
  const lessons = [];

  tracks.forEach((track) => {
    (track.courses || []).forEach((course) => {
      (course.lessons || []).forEach((lesson) => {
        lessons.push({
          id: lesson.id,
          title: lesson.title || null,
          duration: lesson.duration || null,
          trackId: track.id,
          courseId: course.id,
        });
      });
    });
  });

  return lessons;
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[—–-]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function buildReport() {
  const editorial = readEditorialLessons();
  const catalog = readCatalogLessons();
  const catalogById = new Map(catalog.map((lesson) => [lesson.id, lesson]));
  const editorialIds = new Set(editorial.map((lesson) => lesson.id));
  const catalogIds = new Set(catalog.map((lesson) => lesson.id));

  const mismatches = editorial
    .filter((lesson) => catalogById.has(lesson.id))
    .filter((lesson) => normalize(lesson.title) !== normalize(catalogById.get(lesson.id).title))
    .map((lesson) => ({
      id: lesson.id,
      editorial: lesson,
      catalog: catalogById.get(lesson.id),
    }));

  return {
    generatedAt: new Date().toISOString(),
    editorialLessonCount: editorial.length,
    catalogLessonCount: catalog.length,
    editorialMissingFromCatalog: editorial.filter((lesson) => !catalogIds.has(lesson.id)),
    catalogMissingFromEditorial: catalog.filter((lesson) => !editorialIds.has(lesson.id)),
    titleMismatches: mismatches,
    duplicateCatalogIds: catalog
      .map((lesson) => lesson.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index),
  };
}

function main() {
  const report = buildReport();
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  const issueCount = report.editorialMissingFromCatalog.length
    + report.catalogMissingFromEditorial.length
    + report.titleMismatches.length
    + report.duplicateCatalogIds.length;

  console.log(`Lesson catalog audit: ${issueCount} issue(s) found.`);
  console.log(`Report written to ${path.relative(ROOT, REPORT_PATH).replace(/\\/g, '/')}`);
  report.editorialMissingFromCatalog.forEach((lesson) => console.log(` - missing from catalog: ${lesson.id}`));
  report.titleMismatches.forEach((item) => console.log(` - title mismatch: ${item.id}`));
  report.catalogMissingFromEditorial.forEach((lesson) => console.log(` - missing editorial file: ${lesson.id}`));

  if (process.argv.includes('--check') && issueCount > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildReport, readEditorialLessons, readCatalogLessons };
