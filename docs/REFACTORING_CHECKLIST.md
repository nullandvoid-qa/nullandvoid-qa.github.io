# Refactoring Checklist for the QA Course Project

This checklist turns the maintainability plan into a practical backlog. It is organized by priority and by file so the work can be tackled incrementally without losing context.

## Current status snapshot
- The storage, i18n, navigation, and shared utility layers have already been partially extracted into dedicated modules.
- Progress import/export and translation resolution now have regression coverage.
- The remaining refactor focus is the UI/rendering split inside `js/app.js` and the documentation sync for the new structure.

## Priority 0 — Stabilize the foundation

### 1. js/app.js
**Why first:** this file is the biggest source of coupling and the most likely place for regressions.

Tasks:
- [x] Split the file into smaller modules by responsibility where the behavior was already extracted:
  - [x] storage helpers
  - [x] navigation and route handling
  - [x] translation helpers
  - [ ] rendering helpers
  - [ ] lesson/track interaction handlers
- [ ] Extract repeated DOM creation logic into reusable render helpers.
- [ ] Replace scattered global variable usage with a single app state object.
- [ ] Add comments around the main initialization flow so the entry point is easy to follow.
- [ ] Remove dead branches and legacy fallback code that is no longer used.

Definition of done:
- the main flow is understandable from the top of the file
- the file is no longer a catch-all for unrelated behavior
- core user flows still pass the existing tests

### 2. js/utils.js
**Why second:** this is the best place to centralize shared helpers.

Tasks:
- [ ] Move repeated DOM and formatting utilities here.
- [ ] Add safe helpers for storage, event handling, and string normalization.
- [ ] Standardize error handling for storage access and JSON parsing.
- [ ] Keep the module focused on generic utilities only.

Definition of done:
- app modules depend on shared helpers instead of duplicating logic
- utility functions have predictable names and one clear purpose

### 3. js/i18n.js
**Why third:** translations should stay declarative and not become behavior logic.

Tasks:
- [ ] Keep the translation structure as a data object.
- [ ] Move any translation-related logic into small helpers only if needed.
- [ ] Ensure all UI strings are resolved through a single access pattern.
- [ ] Add a simple fallback strategy for missing keys.

Definition of done:
- localization remains easy to extend for new languages
- no UI logic leaks into the translation file

---

## Priority 1 — Make data and UI easier to evolve

### 4. data/tracks.js
**Why:** content is the product core and should be easy to extend without breaking UI.

Tasks:
- [x] Keep lesson objects consistent with a documented schema.
- [x] Add a lightweight validation step during development for missing fields.
- [ ] Normalize repeated structure across lessons and courses.
- [ ] Avoid embedding UI-only markup logic directly into data where possible.

Definition of done:
- new lessons can be added with minimal risk
- content changes do not require UI-specific hacks

### 5. css/styles.css
**Why:** the stylesheet is a major source of maintenance complexity.

Tasks:
- [ ] Split the file into logical sections: base, layout, components, utilities.
- [ ] Remove duplicated selectors and legacy overrides.
- [ ] Group related styles around reusable components rather than page-specific hacks.
- [ ] Keep naming consistent and avoid one-off class names when possible.

Definition of done:
- the stylesheet is easier to scan and update
- style changes can be made without hunting through unrelated rules

### 6. js/auth.js
**Why:** auth and persistence should be predictable and isolated.

Tasks:
- [ ] Keep authentication state handling separate from course rendering.
- [ ] Ensure auth flows do not directly manipulate the DOM outside their own concerns.
- [ ] Centralize fallback behavior for unauthenticated or offline states.

Definition of done:
- auth behavior is isolated and testable
- course UI does not need to know the implementation details of auth

---

## Priority 2 — Improve reliability and tests

### 7. tests/
**Why:** regression protection is essential as the app grows.

Tasks:
- [x] Add tests for lesson completion and bookmarking.
- [x] Add tests for progress export/import flows.
- [x] Add tests for track filtering and navigation.
- [ ] Add a small regression test for every bug fixed from now on.

Definition of done:
- the core user journeys are covered
- common regressions are caught before release

### 8. package.json scripts
**Why:** the project should have clear quality gates.

Tasks:
- [ ] Keep lint, test, and e2e scripts easy to run locally.
- [ ] Add a combined quality command if useful for contributors.
- [ ] Document the recommended local workflow in the README.

Definition of done:
- contributors can run one command to validate the app
- the scripts reflect the current development workflow

---

## Priority 3 — Prepare for future growth

### 9. docs/
**Why:** future contributors need context.

Tasks:
- [ ] Keep architecture notes updated as modules are split.
- [ ] Document the state flow and main entry points.
- [ ] Add a short contributor guide for adding new lessons, tracks, or interactive features.

Definition of done:
- a new contributor can understand the project structure in a short time
- implementation decisions are preserved in the repository

### 10. Feature addition workflow
**Why:** avoid future sprawl.

Tasks:
- [ ] For each new feature, decide whether it belongs in data, UI, state, or storage.
- [ ] Keep new features small and composable.
- [ ] Add tests before or alongside the feature.
- [ ] Update docs when behavior changes.

Definition of done:
- new features are easier to add, review, and maintain

---

## Suggested implementation order

1. Refactor js/app.js into smaller modules.
2. Extract shared helpers into js/utils.js.
3. Clean up data structure consistency in data/tracks.js.
4. Split and organize css/styles.css.
5. Add regression tests for the most critical flows.
6. Update contributor docs and workflow guidance.

## Recommended working style

- Keep each refactor step small and reviewable.
- Prefer one responsibility per module.
- Do not mix style cleanup with feature work unless the cleanup is necessary for the feature.
- If a bug is fixed, add a regression test.

This backlog is intentionally practical: it should make the project easier to maintain, easier to debug, and easier to extend over time.
