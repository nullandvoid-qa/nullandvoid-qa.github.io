const fs = require('fs');
const path = require('path');

const LESSONS_DIR = path.join(__dirname, '..', 'content', 'lessons');
const REQUIRED_SECTIONS = [
  { label: 'Objetivos de Aprendizado', pattern: /Objetivos de Aprendizado/ },
  { label: 'Contexto', pattern: /Por que isso importa|Contexto/ },
  { label: 'Exercício Prático', pattern: /Exercício Prático/ },
  { label: 'Próxima Aula', pattern: /Próxima Aula/ },
  { label: 'Recursos', pattern: /Recursos/ }
];

function listLessonFiles(dir = LESSONS_DIR) {
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .sort()
    .map((file) => path.join(dir, file));
}

function validateLessonStructure(dir = LESSONS_DIR) {
  const lessonFiles = listLessonFiles(dir);
  const errors = [];

  lessonFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

    if (content.includes('�')) {
      errors.push(`${relativePath}: contains replacement characters`);
    }

    const missingSections = REQUIRED_SECTIONS.filter((section) => !section.pattern.test(content));
    if (missingSections.length > 0) {
      errors.push(`${relativePath}: missing sections ${missingSections.map((section) => section.label).join(', ')}`);
    }
  });

  return {
    filesChecked: lessonFiles.length,
    errors
  };
}

function runValidation() {
  const result = validateLessonStructure();
  if (result.errors.length > 0) {
    console.error('Lesson structure validation failed:');
    result.errors.forEach((error) => console.error(` - ${error}`));
    process.exit(1);
  }

  console.log(`Lesson structure validation passed for ${result.filesChecked} lesson files.`);
}

if (require.main === module) {
  runValidation();
}

module.exports = {
  validateLessonStructure,
  listLessonFiles,
  REQUIRED_SECTIONS
};
