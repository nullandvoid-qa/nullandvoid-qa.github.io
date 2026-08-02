const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'content', 'lessons');

const files = fs.readdirSync(DIR).filter(f => f.startsWith('perf-') && f.endsWith('.md'));
if (!files.length) {
  console.log('No perf files found');
  process.exit(0);
}

const replacements = [
  [/\bObjectives\b/gi, 'Objetivos de Aprendizado'],
  [/\bObjective\b/gi, 'Objetivo'],
  [/\bWhy this matters\b/gi, 'Por que isso importa'],
  [/\bContext\b/gi, 'Contexto'],
  [/\bExercise\b/gi, 'Exercício'],
  [/\bExercise Prático\b/gi, 'Exercício Prático'],
  [/\bPractical Exercise\b/gi, 'Exercício Prático'],
  [/\bNext lesson\b/gi, 'Próxima Aula'],
  [/\bResources\b/gi, 'Recursos'],
  [/\bLoad testing\b/gi, 'Teste de carga'],
  [/\bStress testing\b/gi, 'Teste de estresse'],
  [/\bThroughput\b/gi, 'Throughput'],
  [/\bLatency\b/gi, 'Latência'],
];

let changedFiles = [];
files.forEach(file => {
  const fp = path.join(DIR, file);
  let content = fs.readFileSync(fp, 'utf8');
  let original = content;
  replacements.forEach(([re, rep]) => {
    content = content.replace(re, rep);
  });
  if (content !== original) {
    if (!fs.existsSync(fp + '.bak')) fs.writeFileSync(fp + '.bak', original, 'utf8');
    fs.writeFileSync(fp, content, 'utf8');
    changedFiles.push(file);
  }
});

console.log(`Fixed ${changedFiles.length} files`);
if (changedFiles.length) console.log(changedFiles.join('\n'));
module.exports = { changedFiles };
