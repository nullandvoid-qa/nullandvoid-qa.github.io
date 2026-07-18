# Roadmap for Execution

This roadmap captures the next actionable steps for Null and Void QA, prioritized by impact and feasibility.

## Current status

- Core web app is working and deployed to `origin/main`.
- Progress export/import and new UI palette are validated.
- Automated Jest tests are passing.
- CSS linting is clean.

## Priority work (next)

1. **Improve load performance**
   - Add `defer` to script loads in `index.html`.
   - Split large static data out of `data/tracks.js` into smaller modules or JSON files.
   - Lazy-load heavy content and data only when the user navigates to it.

2. **Modularize data and translations**
   - Move hardcoded lesson and roadmap content out of JS and into structured JSON or data modules.
   - Centralize i18n strings in `js/i18n.js` and eliminate duplicated language checks.
   - Refactor large files into smaller, maintainable pieces.

3. **UX / accessibility polish**
   - Add clear success / failure feedback for import/export actions.
   - Ensure all interactive elements have accessible labels and focus states.
   - Finish the new theme across all components and remove legacy color references.

4. **QA and automation**
   - Add end-to-end or integration tests for the dashboard and import/export flow.
   - Keep coverage above 90% and ensure CI validates UI-critical behavior.
   - Document test execution commands in `README.md`.

## Longer-term roadmap

- **Phase 3:** Build interactive learning experiences, short video lessons, and a QA interview prep path.
- **Phase 4:** Add an API testing sandbox and community study group features.

## Immediate next steps

- [ ] Commit roadmap and performance updates so the plan is saved and live.
- [ ] Fix homepage track filter labels and remove broken `undefined` buttons.
- [ ] Fix the "Trilhas carregando..." placeholder so tracks render correctly instead of staying in a loading state.
- [ ] Clean the homepage visual hierarchy, CTA layout, and card spacing.
- [ ] Resolve the PWA service worker scope warning.
- [ ] Add `defer` attributes to scripts in `index.html`.
- [ ] Extract large track data into smaller data modules.
- [ ] Create explicit user feedback screens for progress import/export.
- [ ] Add a helper for language key normalization and clean up repeated code patterns.
- [ ] Document the roadmap in `README.md` and internal docs.

## Notes

This is the working execution plan for the current sprint. The next priority is to complete the core quality improvements before moving to new content features.
