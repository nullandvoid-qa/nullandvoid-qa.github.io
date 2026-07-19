# Best Practices and Maintenance Plan

This document is a practical roadmap for turning this repository from a fast-moving prototype into a more maintainable, testable, and extensible product.

## 1. Why this matters

The project already has a solid shape: static site, vanilla JS, structured course data, tests, and documentation. The next step is not to rewrite everything, but to make the codebase easier to reason about, safer to change, and cheaper to extend.

The main goals are:
- reduce coupling between UI, data, and behavior
- make new features easier to add without breaking existing flows
- improve reliability through tests and clearer conventions
- keep the project understandable for future contributors

---

## 2. Current architecture snapshot

### Frontend structure
- Static site served locally via simple HTTP server
- Vanilla JavaScript with DOM manipulation
- Data-driven lessons, tracks, quizzes, labs, and achievements in the data/ folder
- Styling in css/styles.css
- App logic in js/app.js and supporting modules in js/

### Strengths already present
- Content is mostly centralized in data files
- There is a test setup with Jest and Playwright
- There are docs for architecture, testing, and roadmap
- The app is already modular enough to support incremental improvements

### Main risks
- UI logic and business logic are still somewhat entangled
- The app relies heavily on global state and imperative DOM updates
- A lot of functionality lives in a single large script
- New features may introduce regressions unless conventions are enforced

### What has improved recently
- Shared rendering helpers now cover quizzes, lessons, track cards, dashboard sections, glossary, labs, and sandbox examples
- Core persistence and validation logic is centralized in reusable storage utilities
- Regression tests now cover helper rendering behavior and storage behavior

---

## 3. Immediate engineering priorities

### P0 — Stabilize the foundation
These should be done first because they reduce future risk.

1. Define a clear module boundary for app logic
   - Keep rendering, state handling, storage, and navigation responsibilities separated
   - Avoid adding new logic directly into large UI functions

2. Introduce a lightweight state pattern
   - Use a single app state object for shared values such as current lesson, progress, language, filters, and selected track
   - Keep state updates explicit and centralized

3. Reduce direct DOM coupling
   - Prefer helper functions for rendering and DOM updates
   - Avoid repeated inline DOM manipulation across multiple functions

4. Create a consistent naming convention
   - Use predictable names for functions, variables, and data structures
   - Prefer verbs for actions and nouns for data objects

---

## 4. Code organization principles

### Keep the app layered
A simple structure is enough:
- data layer: content and config
- state layer: progress, UI state, selected course/lesson
- view layer: rendering and DOM updates
- utilities: shared helpers
- services: browser storage, auth helpers, formatting helpers

### Avoid mixing responsibilities
A function should ideally do one thing well.
Examples:
- rendering a lesson card should not also save progress to localStorage
- navigation logic should not also format dates or build HTML

### Prefer small, focused modules
When a file grows too large, split it into smaller modules rather than adding more conditionals.

---

## 5. Naming and style conventions

### JavaScript
- Use `camelCase` for variables and functions
- Use `PascalCase` for constructors or classes if introduced later
- Use `UPPER_SNAKE_CASE` for constants that are truly fixed
- Prefer descriptive names over abbreviations

### HTML and CSS
- Use semantic HTML where possible
- Keep class names predictable and lowercase
- Avoid one-off styles that only exist for a single feature

### Files
- Keep files focused on one domain: `auth`, `storage`, `rendering`, `utils`, `data`
- Prefer explicit names such as `lesson-renderer.js` over vague names like `helpers.js`

---

## 6. Data conventions

### Keep content data structured
Track/course/lesson content should remain data-driven.
This makes it easier to:
- add new courses
- localize content
- test content rendering
- update flow without touching UI logic

### Avoid embedding business logic in content objects
Content objects should describe content, not implement behavior.

### Validate shape where possible
If a lesson or course is missing required fields, fail loudly during development.

---

## 7. Testing strategy

### What to test
- rendering of lessons and course cards
- navigation between sections
- localStorage persistence behavior
- lesson completion and bookmarking
- quiz or interaction flows where they exist

### Keep tests meaningful
Prefer real behavior tests over brittle DOM assertions.
Focus on:
- visible state changes
- user-visible outcomes
- data persistence

### Add regression tests for high-risk flows
Every time a bug is fixed, add a small regression test if possible.

---

## 8. Maintainability checklist for future changes

Before adding a new feature, ask:
- Does this belong in data, state, or UI?
- Can this be implemented with a small helper instead of a new special case?
- Will this be understandable to a new contributor in 10 minutes?
- Does it need a test?
- Does it introduce duplication?

---

## 9. Suggested refactor order

### Phase 1 — Quick wins
- keep the shared helper layer focused on view-only responsibilities
- document where state lives and how views consume it
- reduce duplicated DOM code in remaining large render functions
- split the remaining app-entrypoint branches into smaller, focused helpers

### Phase 2 — Structural cleanup
- centralize rendering utilities further for any remaining view types
- introduce a clearer state object for current view, filters, and selected entities
- keep browser-storage access behind the existing utility layer and avoid ad-hoc localStorage logic in view code
- standardize event handling around reusable attach helpers

### Phase 3 — Testing and hardening
- add more Jest and Playwright coverage for navigation, quiz completion, and dashboard interactions
- add regression tests for any new helper introduced during future refactors
- improve error handling for missing data and storage issues

### Phase 4 — Extensibility
- prepare for multi-language content expansion
- support more interactive content types without breaking existing pages
- make new course types easier to plug in

---

## 10. Practical contribution rules

Every change should follow these rules:
1. Keep the change small and focused
2. Prefer reuse over duplication
3. Update docs when behavior changes
4. Add or update tests when behavior changes
5. Avoid introducing new globals unless necessary
6. Keep the code readable enough that another contributor can understand it quickly

---

## 11. Suggested repository hygiene

- Keep the main app logic organized by responsibility
- Remove dead code and outdated experimental files when they are no longer used
- Keep docs aligned with the current implementation
- Avoid “temporary” hacks that stay in the codebase for too long
- Use consistent formatting and linting rules

---

## 12. Immediate next actions

The first concrete actions should be:
1. document the current app flow and module responsibilities
2. continue refactoring the remaining app-entrypoint branches into focused helpers
3. add regression tests for the most important user flows
4. reduce duplicate logic in rendering and state updates
5. keep new features small and data-driven

This is the right moment to move from “prototype mode” to “product mode.”
