#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load translations
const ptPath = path.join(__dirname, 'data', 'translations-pt.json');
const enPath = path.join(__dirname, 'data', 'translations-en.js');
const i18nPath = path.join(__dirname, 'js', 'i18n.js');

console.log('\n=== ANÁLISE DE TRADUÇÃO NULLANDVOID-QA ===\n');

// 1. Contar chaves em translations-pt.json
try {
  const ptData = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
  const ptKeys = Object.keys(ptData);
  console.log(`translations-pt.json: ${ptKeys.length} chaves`);
  
  // Categorias de chaves
  const categories = {};
  ptKeys.forEach(key => {
    const cat = key.split('.')[0];
    categories[cat] = (categories[cat] || 0) + 1;
  });
  console.log('  Categorias:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`    - ${cat}: ${count}`);
  });
} catch (e) {
  console.error('Erro ao ler translations-pt.json:', e.message);
}

console.log('');

// 2. Analisar i18n.js
try {
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');
  const ptMatch = i18nContent.match(/pt:\s*{([\s\S]*?)},\s*en:/);
  const enMatch = i18nContent.match(/en:\s*{([\s\S]*?)}\s*};/);
  
  // Contar chaves manualmente (aproximado)
  const ptI18nKeys = (i18nContent.match(/pt:\s*{[\s\S]*?},\s*en:/)[1].match(/:\s*{|:\s*"/g) || []).length;
  const enI18nKeys = (i18nContent.match(/en:\s*{[\s\S]*?}\s*};/)[1].match(/:\s*{|:\s*"/g) || []).length;
  
  console.log(`js/i18n.js: ~${ptI18nKeys} chaves PT, ~${enI18nKeys} chaves EN`);
} catch (e) {
  console.error('Erro ao analisar i18n.js:', e.message);
}

console.log('');

// 3. Verificar chaves em verify.html
try {
  const verifyContent = fs.readFileSync(path.join(__dirname, 'verify.html'), 'utf8');
  const verifyKeys = (verifyContent.match(/data-i18n="verify\./g) || []).length;
  const verifyKeysPlaceholder = (verifyContent.match(/data-i18n-placeholder="verify\./g) || []).length;
  console.log(`verify.html: ~${verifyKeys + verifyKeysPlaceholder} referências a chaves i18n`);
  
  // Extrair chaves únicas
  const keys = new Set();
  [...(verifyContent.match(/data-i18n="([^"]+)"/g) || [])].forEach(m => keys.add(m.replace(/data-i18n="/, '').replace(/"/, '')));
  [...(verifyContent.match(/data-i18n-placeholder="([^"]+)"/g) || [])].forEach(m => keys.add(m.replace(/data-i18n-placeholder="/, '').replace(/"/, '')));
  
  console.log(`  Chaves únicas de verify.*: ${keys.size}`);
  [...keys].forEach(k => console.log(`    - ${k}`));
} catch (e) {
  console.error('Erro ao analisar verify.html:', e.message);
}

console.log('\n=== FIM DA ANÁLISE ===\n');
