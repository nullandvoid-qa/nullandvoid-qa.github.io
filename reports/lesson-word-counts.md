# Lesson Word Count Audit

## Summary

- Total lessons audited: 42
- Translation metadata keys:
  - `data/translations-pt.json`: 129
  - `data/translations-en.json`: 129
  - Missing EN metadata keys: 0

## Shortest lessons

These lessons are candidates for expansion because they are significantly shorter than the course average.

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

## Additional short lessons

- `content/lessons/perf-l6.md` — 465 words
- `content/lessons/l22.md` — 546 words
- `content/lessons/l20.md` — 796 words
- `content/lessons/l17.md` — 655 words

## Recommendation

- Expand the shortest lessons with more context, practical examples, and clearer workflows.
- Confirm whether lesson descriptions are needed in the UI; if so, add `lesson.*.description` metadata to both PT and EN translation files.
- Use `scripts/audit_lessons_i18n.py` to refresh this report after content updates.
