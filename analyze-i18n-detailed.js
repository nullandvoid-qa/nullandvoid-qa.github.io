#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n=== ANÁLISE DETALHADA DE TRADUÇÃO NULLANDVOID-QA ===\n');

// 1. Ler translations-pt.json
const ptPath = path.join(__dirname, 'data', 'translations-pt.json');
const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const ptKeys = new Set(Object.keys(ptData));

console.log(`📊 translations-pt.json: ${ptKeys.size} chaves\n`);

// 2. Ler todas as chaves esperadas do i18n.js
const i18nPath = path.join(__dirname, 'js', 'i18n.js');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

// Extrair chaves PT do i18n.js (pattern: "chave": "valor")
const ptI18nKeys = new Set();
const ptMatch = i18nContent.match(/pt:\s*\{([\s\S]*?)\},\s*en:/);
if (ptMatch) {
  const ptBlock = ptMatch[1];
  // Encontrar todos os patterns: "key": "value" ou "key": { ... }
  const keyMatches = ptBlock.match(/"([^"]+)":\s*(?:{|")/g) || [];
  keyMatches.forEach(m => {
    const key = m.match(/"([^"]+)"/)[1];
    ptI18nKeys.add(key);
  });
}

console.log(`📝 js/i18n.js (PT): ~${ptI18nKeys.size} chaves definidas\n`);

// 3. Verificar cobertura em translations-pt.json
console.log('🔍 Análise de cobertura:\n');

// Chaves em i18n.js que faltam em translations-pt.json
const missingInPt = Array.from(ptI18nKeys).filter(k => !ptKeys.has(k));
console.log(`   ⚠️ Chaves em i18n.js mas NÃO em translations-pt.json: ${missingInPt.length}`);
if (missingInPt.length > 0 && missingInPt.length <= 20) {
  missingInPt.forEach(k => console.log(`      - ${k}`));
}

// Chaves em translations-pt.json que NÃO estão em i18n.js
const extraInPt = Array.from(ptKeys).filter(k => !ptI18nKeys.has(k));
console.log(`\n   ✅ Chaves em translations-pt.json mas NÃO em i18n.js: ${extraInPt.length}`);
if (extraInPt.length > 0 && extraInPt.length <= 20) {
  extraInPt.forEach(k => console.log(`      - ${k}`));
}

// 4. Verificar chaves de verify.html
console.log('\n📄 Chaves em verify.html:\n');
const verifyContent = fs.readFileSync(path.join(__dirname, 'verify.html'), 'utf8');
const verifyKeys = new Set();
[...(verifyContent.match(/data-i18n="([^"]+)"/g) || [])].forEach(m => {
  verifyKeys.add(m.replace(/data-i18n="/, '').replace(/"/, ''));
});
[...(verifyContent.match(/data-i18n-placeholder="([^"]+)"/g) || [])].forEach(m => {
  verifyKeys.add(m.replace(/data-i18n-placeholder="/, '').replace(/"/, ''));
});

console.log(`   Referências: ${verifyKeys.size} chaves`);
const verifyMissing = Array.from(verifyKeys).filter(k => !ptKeys.has(k));
console.log(`   Faltando em translations-pt.json: ${verifyMissing.length}`);
if (verifyMissing.length > 0) {
  verifyMissing.forEach(k => console.log(`      - ${k}`));
}

// 5. Calcular percentual de cobertura
const coveragePt = ptKeys.size / ptI18nKeys.size * 100;
console.log(`\n📈 Cobertura PT-BR: ${coveragePt.toFixed(1)}%`);

// 6. Analisar por categoria
console.log('\n📑 Distribuição por categoria em translations-pt.json:\n');
const categories = {};
Array.from(ptKeys).forEach(key => {
  const cat = key.split('.')[0];
  if (!categories[cat]) categories[cat] = { total: 0, examples: [] };
  categories[cat].total++;
  if (categories[cat].examples.length < 3) {
    categories[cat].examples.push(key);
  }
});

Object.entries(categories).sort((a, b) => b[1].total - a[1].total).forEach(([cat, data]) => {
  console.log(`   ${cat}: ${data.total} chaves`);
  data.examples.forEach(ex => console.log(`      → ${ex}`));
});

console.log('\n=== FIM DA ANÁLISE ===\n');
