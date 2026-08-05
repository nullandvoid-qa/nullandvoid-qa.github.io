# Hard-coded strings report

This is an automated, heuristic scan for likely hard-coded user-facing strings in JS and service-worker files.

Summary:
- Scan scope: `js/**/*.js`, `js/service-worker.js`.
- Heuristic: string literals containing spaces (likely user-facing) were listed. Some are tests or HTML snippets and may be false positives.

Candidates (file → excerpt):

- `js/service-worker.js`:
  - Offline page HTML with Portuguese strings: "Você está offline", "O conteúdo não está disponível no momento, mas você ainda pode retornar à página inicial.", "Voltar para a home".

- `js/app-dashboard.js`:
  - Fallback toast message in `showToast(t("toast.certificateDownloaded", getState().lang === "en" ? "Certificate downloaded!" : "Certificado baixado!"))` — uses `t()` with inline fallback strings.

- `js/lesson-renderers.js` / `js/view-helpers.js` / `js/app-content.js` / `js/app-home.js` / `js/app-track.js`:
  - Several template fragments contain literal English/Portuguese strings inside HTML snippets used for rendering (e.g., headings like "Primer", "Senior note", empty state messages). Many of these are already routed via translation keys in `js/i18n.js`, but some are inline templates.

- `js/icons.js`:
  - Inline SVG `home`, `shield` etc. — typically OK, but labels or titles inside might be localized.

- Tests (js/__tests__) and markup strings:
  - Several test files contain HTML snippets and literal labels; these are expected for tests and can be ignored.

Recommendations / next steps:
1. Review `js/service-worker.js` offline page and move user-facing text to `i18n` keys (e.g. `offline.title`, `offline.message`, `offline.cta`).
2. For template fragments in `view-helpers.js`, `lesson-renderers.js`, `app-content.js`, prefer `t('<key>')` or use `data-i18n` where feasible.
3. Keep test literals as-is unless they assert localized content; in that case, reference translation keys in tests.
4. Produce a small PR that replaces the `service-worker` inline strings with translation lookups and updates translation files.

This report is a heuristic starting point — review items before changing code.
