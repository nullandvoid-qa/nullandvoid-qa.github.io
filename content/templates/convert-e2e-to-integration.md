# Converting Playwright E2E to Integration/Contract Tests — Bookmark & Quiz

This guide shows concrete steps to convert two existing Playwright E2E flows (bookmark flow and quiz flow) into faster integration or contract tests that run in Jest.

Why: E2E tests with Playwright are valuable, but slow and brittle. Converting portions to integration or contract tests speeds feedback and isolates backend/contract logic.

## 1) Identify the flow and boundaries

- Bookmark flow (UI E2E): opens a lesson page, clicks `#btn-bookmark`, and verifies the bookmark appears in dashboard.
  - External interactions: `localStorage` persistence, custom events (`nvauth:bookmarked`), and app state mutations.
  - Candidate conversion: integration test that exercises `toggleBookmark()` and the storage normalization logic, plus a contract test that exercises the storage/API contract for bookmarks.

- Quiz flow (UI E2E): opens a quiz, selects answers, submits, and verifies dashboard metrics update.
  - External interactions: DOM form handlers, localStorage write `testers-guild-quizzes`, and achievements check.
  - Candidate conversion: integration test that renders the quiz with minimal DOM and invokes `bindTrackQuizHandlers` or directly calls the quiz-passed callback to validate persistence and side effects.

## 2) Map endpoints, fixtures, and mocks

- Bookmark:
  - No network endpoint in current app; persistence is via `localStorage` key `testers-guild-bookmarks`.
  - Fixtures: lesson id strings (`lesson-1`, `lesson-2`).
  - Mocks: global `window.showToast`, `window.checkAchievements` to avoid side effects; `window.NVApp.state` to isolate the test.

- Quiz:
  - No server network calls either; uses `window.TG_QUIZZES` and `localStorage` `testers-guild-quizzes`.
  - Fixtures: minimal `TG_QUIZZES` for a sample `trackId` and `quizData` object with `questions` and `passScore`.
  - Mocks: `window.showToast`, `window.checkAchievements`, `window.NVViewHelpers` helpers used by `renderQuiz`.

## 3) Implementation patterns (examples)

### Integration test (bookmarks)
- Load the small page-object or call `require('../js/app-bookmarks.js')` to attach `toggleBookmark` to `window`.
- Initialize `window.NVApp.state = { bookmarks: [] }`.
- Call `toggleBookmark('lesson-x')` and assert `localStorage` and `window.NVApp.state.bookmarks` updated.

### Integration test (quiz)
- Prepare DOM elements used by `renderQuiz`: an element with id `quiz-content` and `quiz-breadcrumb`.
- Provide `window.NVApp.state.tracks` and `window.NVApp.state.lang` and `window.NVApp.helpers.quizzes` with a minimal quiz entry.
- Provide `window.NVViewHelpers.buildTrackQuizHtml` (simple stub that renders a submit button and radio inputs) and `window.NVViewHelpers.bindTrackQuizHandlers` (calls the `onPassed` callback with a chosen score when submit clicked).
- Call `require('../js/app-content.js')` then `window.renderQuiz(trackId)` and simulate the user clicking the submit button via `document.querySelector('#quiz-submit').click()`; assert `localStorage` updated and `window.NVApp.state.quizzesPassed` updated.

## 4) Contract tests (optional)
- If the app begins to use real backend endpoints for bookmarks/quizzes, use Pact or a lightweight HTTP contract test harness to verify the provider responses match consumer expectations.
- For now, document the contract: the shape of `localStorage` keys and the data saved:
  - Bookmarks: `['lesson-1','lesson-2']`
  - Quizzes: `{ [trackId]: { passedAt: ISOString, score: number } }`

## 5) Example Jest test checklist
- Ensure `jest.resetModules()` between tests.
- Always `clear` `localStorage` and reset `window.NVApp` state.
- Stub `window.showToast` and `window.checkAchievements` to avoid noise.
- Verify side-effects like localStorage contents and state mutations.

## 6) Where to place tests
- Use `js/__tests__/integration/` for integration conversions (already used in repo).
- Keep Playwright E2E for cross-browser, visual, and end-to-end user journeys—limit to a small, high-value set.

## 7) Next steps
- Implement two examples: `js/__tests__/integration/bookmark-integration.test.js` (done) and `js/__tests__/integration/quiz-integration.test.js` (implement next).
- Draft a short PR template note explaining that tests were moved to integration for speed and maintainability.
