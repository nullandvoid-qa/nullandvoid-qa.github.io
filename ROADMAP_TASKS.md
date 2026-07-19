# Execution Roadmap — Null and Void QA

Goal: Turn the prioritized improvements into concrete, runnable tasks.

1. Save roadmap for execution (in-progress)
   - Create this file `ROADMAP_TASKS.md` (done)
   - Break work into small tickets and tests

2. E2E coverage
   - Add tests for: `sandbox` page, `roadmap` detail views, `sandbox` interactions
   - Keep tests resilient: prefer `window.navigate(...)` and visible selectors
   - Run `npx playwright test --config=playwright.config.js`

3. Test-run and fix bugs
   - Run full Playwright suite
   - Fix any UI or i18n issues discovered
   - Re-run until green

4. CI integration
   - Add GitHub Actions workflow to run Playwright and unit tests on PRs
   - Cache node_modules and use Playwright test runners

5. Optional
   - Expand tests to mobile viewports
   - Add visual regression snapshots

Commands

```bash
# Run Playwright end-to-end tests
npx playwright test --config=playwright.config.js --reporter=list

# Run unit tests
npm test
```
