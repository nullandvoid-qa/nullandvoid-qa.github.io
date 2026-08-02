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

function ensureH2Matches(content, title) {
  const h2Regex = /<h2>[\s\S]*?<\/h2>/m;
  if (h2Regex.test(content)) {
    const newContent = content.replace(h2Regex, `<h2>${title}</h2>`);
    return { changed: newContent !== content, content: newContent };
  }
  // no h2, insert after frontmatter if present
  const fmEnd = content.search(/\n---\s*\n/);
  if (fmEnd !== -1) {
    const insertPos = fmEnd + '\n---\n'.length; // fallback, will compute properly
    // safer: replace first occurrence of closing frontmatter with closing + h2
    const newContent = content.replace(/(\n---\s*\n)/, `$1<h2>${title}</h2>\n\n`);
    return { changed: true, content: newContent };
  }
  // otherwise, prepend
  return { changed: true, content: `<h2>${title}</h2>\n\n` + content };
}

let changedFiles = [];
const files = listMdFiles(DIR);
files.forEach((file) => {
  const fp = path.join(DIR, file);
  const raw = fs.readFileSync(fp, 'utf8');
  const title = extractTitleFromFrontmatter(raw);
  if (!title) return; // skip if no frontmatter title
  const res = ensureH2Matches(raw, title);
  if (res.changed) {
    fs.writeFileSync(fp, res.content, 'utf8');
    changedFiles.push(file);
  }
});

console.log(`Standardized H2 in ${changedFiles.length} files.`);
if (changedFiles.length) console.log(changedFiles.join('\n'));
module.exports = { changedFiles };
