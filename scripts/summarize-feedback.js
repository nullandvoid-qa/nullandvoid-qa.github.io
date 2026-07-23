const fs = require('fs');
const path = require('path');

const inPath = path.join(__dirname, '..', 'reports', 'beta-feedback.json');
const outPath = path.join(__dirname, '..', 'reports', 'beta-feedback-summary.json');

if (!fs.existsSync(inPath)) {
  console.error('beta-feedback.json not found.');
  process.exit(1);
}

const responses = JSON.parse(fs.readFileSync(inPath, 'utf8')) || [];
if (responses.length === 0) {
  console.log('No responses found.');
  fs.writeFileSync(outPath, JSON.stringify({ count: 0, summary: {} }, null, 2));
  process.exit(0);
}

// Expect responses with fields: overall (1-5), clarity (1-5), objectives ("Sim"/"Parcial"/"Nao"), exercise_useful (true/false)
const numericKeys = ['overall', 'clarity'];
const stats = { count: responses.length };

numericKeys.forEach((k) => {
  const vals = responses.map(r => Number(r[k]) || 0).filter(v => v > 0);
  stats[k] = {
    avg: vals.length ? (vals.reduce((a,b) => a+b, 0)/vals.length) : null,
    min: vals.length ? Math.min(...vals) : null,
    max: vals.length ? Math.max(...vals) : null
  };
});

// Categorical summaries
const objectives = {};
let exerciseUsefulYes = 0;
responses.forEach(r => {
  const obj = r.objectives || 'Nao informado';
  objectives[obj] = (objectives[obj] || 0) + 1;
  if (r.exercise_useful === true || r.exercise_useful === 'Sim' || r.exercise_useful === 'sim') exerciseUsefulYes++;
});

const summary = { count: responses.length, numeric: stats, objectives, exerciseUsefulYes };
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log('Wrote', outPath);
