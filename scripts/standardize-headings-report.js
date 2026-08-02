const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content', 'lessons');

function listMdFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.md'));
}

function extractTitleFromFrontmatter(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  const titleMatch = fm.match(/^title:\s*(.*)$/m);
  if (!titleMatch) return null;
  return titleMatch[1].trim();
}

function findFirstHeading(content) {
  const htmlH2 = content.match(/<h2>([\s\S]*?)<\/h2>/m);
  if (htmlH2) return { type: 'html', text: htmlH2[1], raw: htmlH2[0] };
  const mdH2 = content.match(/^##\s+(.*)$/m);
  if (mdH2) return { type: 'md', text: mdH2[1], raw: mdH2[0] };
  return null;
}

function insertH2AfterFrontmatter(content, title) {
  const repl = `\n---\n`;
  const newContent = content.replace(/(\n---\s*\n)/, `$1<h2>${title}</h2>\n\n`);
  return newContent;
}

function backupFile(fp) {
  const bak = fp + '.bak';
  if (!fs.existsSync(bak)) fs.copyFileSync(fp, bak);
}

let mismatches = [];
let fixed = [];
const files = listMdFiles(DIR);
files.forEach((file) => {
  const fp = path.join(DIR, file);
  const raw = fs.readFileSync(fp, 'utf8');
  const title = extractTitleFromFrontmatter(raw);
  if (!title) return; // skip
  const heading = findFirstHeading(raw);
  if (heading) {
    if (heading.text.trim() !== title.trim()) {
      mismatches.push({ file, current: heading.text.trim(), expected: title });
      // fix
      let newContent;
      if (heading.type === 'html') {
        newContent = raw.replace(heading.raw, `<h2>${title}</h2>`);
      } else {
        newContent = raw.replace(heading.raw, `## ${title}`);
        // convert md H2 to html H2 to match site style if desired
        newContent = newContent.replace(/^##\s+(.+)$/m, `<h2>$1</h2>`);
        newContent = newContent.replace(`<h2>${heading.text}</h2>`, `<h2>${title}</h2>`);
      }
      backupFile(fp);
      fs.writeFileSync(fp, newContent, 'utf8');
      fixed.push(file);
    }
  } else {
    // no heading, insert
    mismatches.push({ file, current: null, expected: title });
    const newContent = insertH2AfterFrontmatter(raw, title);
    backupFile(fp);
    fs.writeFileSync(fp, newContent, 'utf8');
    fixed.push(file);
  }
});

console.log(`Found ${mismatches.length} mismatches, fixed ${fixed.length} files.`);
if (mismatches.length) console.log('Mismatches:\n' + mismatches.map(m => `${m.file}: ${m.current} => ${m.expected}`).join('\n'));
if (fixed.length) console.log('Fixed files:\n' + fixed.join('\n'));
module.exports = { mismatches, fixed };
