#!/usr/bin/env node
/**
 * sync-translations.js
 *
 * Validates translation key coverage between PT-BR and EN metadata files.
 * Reports missing keys, orphaned keys, and total coverage percentage.
 *
 * Usage:
 *   node scripts/sync-translations.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PT_FILE = path.join(DATA_DIR, 'translations-pt.json');
const EN_FILE = path.join(DATA_DIR, 'translations-en.json');

function loadJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function compareTranslations() {
  const pt = loadJson(PT_FILE);
  const en = loadJson(EN_FILE);

  if (!pt) {
    console.error('ERROR: translations-pt.json not found or invalid.');
    process.exit(1);
  }

  if (!en) {
    console.error('ERROR: translations-en.json not found or invalid.');
    process.exit(1);
  }

  const ptKeys = Object.keys(pt).sort();
  const enKeys = Object.keys(en).sort();
  const ptSet = new Set(ptKeys);
  const enSet = new Set(enKeys);

  const missingInEN = ptKeys.filter((k) => !enSet.has(k));
  const missingInPT = enKeys.filter((k) => !ptSet.has(k));

  // Summary
  console.log('\n=== i18n Meta-Data Sync Report ===');
  console.log(`PT-BR keys:          ${ptKeys.length}`);
  console.log(`EN keys:            ${enKeys.length}`);
  console.log(`Missing keys in EN:  ${missingInEN.length}`);
  console.log(`Missing keys in PT:  ${missingInPT.length}`);
  console.log(`Coverage (EN):       ${(100 * (ptKeys.length - missingInEN.length) / ptKeys.length).toFixed(2)}%`);
  console.log(`Coverage (PT):       ${(100 * (enKeys.length - missingInPT.length) / enKeys.length).toFixed(2)}%`);

  // Missing in EN
  if (missingInEN.length > 0) {
    console.log('\n--- Keys that exist in PT-BR but ARE MISSING in EN ---');
    missingInEN.forEach((k) => console.log(`  - missing-in-en: ${k}`));
  } else {
    console.log('\n  ✅ All PT-BR keys have EN equivalents.');
  }

  // Missing in PT (unused/orphaned)
  if (missingInPT.length > 0) {
    console.log('\n--- Keys that exist in EN but are MISSING in PT-BR (orphaned?) ---');
    missingInPT.forEach((k) => console.log(`  - missing-in-pt: ${k}`));
  } else {
    console.log('\n  ✅ All EN keys have PT-BR equivalents.');
  }

  // Validation exit code
  const totalMissing = missingInEN.length + missingInPT.length;
  if (totalMissing > 0) {
    console.error(`\n❌ ${totalMissing} gap(s) found. Translation files are out of sync.`);
    process.exit(1);
  } else {
    console.log('\n✅ Translation files are synced. No gaps found.');
    process.exit(0);
  }
}

module.exports = { compareTranslations, loadJson };

if (require.main === module) {
  compareTranslations();
}