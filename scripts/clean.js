const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const patternsToDelete = [
  /^page-debug\.html$/,
  /^tmp-.*$/,
  /^test-output.*\.txt$/,
  /^track-.*\.json$/,
  /^track-.*\.log$/,
  /^quiz-.*\.json$/,
  /^quiz-.*\.png$/,
];

try {
  const files = fs.readdirSync(rootDir);
  let count = 0;

  files.forEach((file) => {
    const isTemp = patternsToDelete.some((pattern) => pattern.test(file));
    if (isTemp) {
      const filePath = path.join(rootDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
          console.log(`[Clean] Deleted file: ${file}`);
          count++;
        }
      } catch (err) {
        console.warn(`[Clean] Could not delete ${file}:`, err.message);
      }
    }
  });

  console.log(`[Clean] Completed. ${count} temporary file(s) removed.`);
} catch (err) {
  console.error('[Clean] Error cleaning repository:', err);
  process.exit(1);
}
