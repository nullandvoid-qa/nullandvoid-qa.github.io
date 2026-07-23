const fs = require('fs');
const path = require('path');

const auditPath = path.join(__dirname, '..', 'reports', 'tracks-audit.json');
const outPath = path.join(__dirname, '..', 'reports', 'tracks-gap-plan.md');

if (!fs.existsSync(auditPath)) {
  console.error('tracks-audit.json not found. Run scripts/audit-tracks.js first.');
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

let md = '# Plano de Lacunas por Trilha\n\n';
md += 'Este relatório sugere ações para levar cada trilha ao mínimo de 5 aulas e melhorar cobertura.\n\n';

audit.forEach((t) => {
  md += `## ${t.title} (${t.id})\n\n`;
  md += `- Cursos: ${t.courses}\n`;
  md += `- Aulas totais: ${t.totalLessons}\n`;
  if (t.needsAttention) {
    const needed = 5 - t.totalLessons;
    md += `- Status: NECESSITA ATENÇÃO — adiciona **${needed}** aula(s) para atingir 5 aulas mínimas.\n`;
    md += `- Sugestões:\n`;
    md += `  - Criar ${needed} aulas práticas focadas em hands-on e estudos de caso.\n`;
    md += `  - Para cada nova aula, definir objetivo de aprendizado e exercício prático.\n`;
    md += `  - Priorizar tópicos deficitários (ex.: performance, segurança, automação).\n`;
  } else {
    md += `- Status: OK\n`;
    md += `- Sugestões:\n`;
    md += `  - Revisar exercícios para aumentar desafio e profundidade.\n`;
  }
  md += '\n';
});

fs.writeFileSync(outPath, md);
console.log('tracks-gap-plan.md written to reports/');
