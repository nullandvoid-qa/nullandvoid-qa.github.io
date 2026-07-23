# Atualização da Documentação de Trilhas e Exemplos

Objetivo: padronizar e melhorar a documentação das trilhas para que fique fácil adicionar/editar trilhas, cursos e lições, e para suportar traduções.

Tarefas recomendadas:
- Padronizar `data/tracks.js` com metadados por lição: `author`, `lastReviewed`, `difficulty`, `learningOutcomes`.
- Extrair exemplos e repositórios associados em `docs/examples/` com READMEs pequenos e links.
- Criar `docs/TRACKS_CONTRIBUTING.md` com passos para adicionar trilhas/cursos/lições e formatos esperados (YAML/JSON snippets).
- Garantir que todas as strings de exibição estejam cobertas por i18n (usar `reports/i18n-strings.json`).
- Adicionar exemplos de templates para exercícios em `docs/exercises/templates.md`.

Prioridade e estimativas:
- Alta: adicionar metadados e CONTRIBUTING (3-5 horas)
- Média: extrair exemplos e criar templates (4-8 horas)
- Baixa: adicionar vídeos e multimídia (variável)

Checklist rápido para review:
- [ ] `data/tracks.js` tem `learningOutcomes` para cada trilha
- [ ] Cada lição tem `duration`, `author`, `lastReviewed`
- [ ] Exemplos vinculados existem em `docs/examples/` ou `books/assets/`
- [ ] Strings novas estão presentes em `reports/i18n-strings.json`

Como submeter mudanças:
- Crie branch `chore/docs/tracks-update` e envie PR com descrição das mudanças e checklist preenchido.
