const fs = require('fs');
const path = require('path');
const vm = require('vm');

const tracksPath = path.join(__dirname, '..', 'data', 'tracks.js');
const outPath = path.join(__dirname, '..', 'reports', 'lesson-samples.md');

const src = fs.readFileSync(tracksPath, 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox, { filename: 'tracks.js' });
const tracks = sandbox.window.TG_QAWAY_TRACKS || [];

const lessons = [];
tracks.forEach((t) => {
  (t.courses || []).forEach((c) => {
    (c.lessons || []).forEach((l) => {
      lessons.push({
        trackId: t.id || null,
        courseId: c.id || null,
        id: l.id || null,
        title: l.title || null,
        duration: l.duration || null,
        snippet: (l.content || '').replace(/<[^>]+>/g, '').slice(0, 400).replace(/\s+/g, ' ').trim()
      });
    });
  });
});

const first10 = lessons.slice(0, 10);

let md = '# Amostras de Aulas (Primeiras 10)\n\n';
first10.forEach((l, idx) => {
  md += `## ${idx+1}. ${l.title} (${l.id})\n`;
  md += `- Track: ${l.trackId} | Course: ${l.courseId} | Duração: ${l.duration}\n\n`;
  md += '**Snippet de conteúdo (limpo):**\n\n';
  md += "```\n" + l.snippet + "\n```\n\n";
});

fs.writeFileSync(outPath, md);
console.log('lesson-samples.md written to reports/');
