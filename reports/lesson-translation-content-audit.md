# Lesson Content and Translation Audit

## Summary

- `data/translations-pt.json`: 129 keys
- `data/translations-en.json`: 129 keys
- Missing EN keys for PT metadata: **0**
- Lessons audited: **42**

## Translation coverage

The current metadata translation files are aligned. There are no missing lesson title keys between the Portuguese and English metadata files.

### Notes

- Translation metadata currently covers lesson titles.
- There are no `lesson.*.description` keys in the current PT/EN metadata files.
- The lesson bodies under `content/lessons/` are Portuguese-only.

## Lesson content volume

### Shortest lessons by word count

1. `content/lessons/l27.md` — 169 words
2. `content/lessons/l28.md` — 217 words
3. `content/lessons/l35.md` — 249 words
4. `content/lessons/l24.md` — 297 words
5. `content/lessons/l25.md` — 295 words
6. `content/lessons/l26.md` — 301 words
7. `content/lessons/l34.md` — 293 words
8. `content/lessons/l32.md` — 329 words
9. `content/lessons/l23.md` — 367 words
10. `content/lessons/l29.md` — 388 words
11. `content/lessons/perf-l6.md` — 465 words

### Recommended threshold

- Lessons under ~500 words should be reviewed for expansion.
- The shortest lessons are primarily conceptual and need more practical examples or deeper explanation.

## Recommended actions

1. Expand the shortest lessons with:
   - clearer examples
   - practical exercises
   - explicit connections to QA workflow or automation
2. Add `lesson.*.description` metadata if lesson summaries are needed in the UI.
3. If English lesson bodies are required, define an EN content strategy:
   - parallel EN markdown files, or
   - translation metadata + runtime content injection.
4. Review the terminology consistency for English technical terms in the Portuguese lessons.

## Next step

- Use `scripts/audit_lessons_i18n.py` to rerun the audit after updates.
- Prioritize expanding the 10 shortest lesson files listed above.
