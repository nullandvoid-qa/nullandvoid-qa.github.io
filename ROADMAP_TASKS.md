# Execution Roadmap — Null and Void QA

Goal: Turn the prioritized improvements into concrete, runnable tasks.

## Current status
- Roadmap file created and active
- Core lesson Markdown flow is working
- E2E coverage is green

## Improvements documented from review

### Design improvements
- Improve visual hierarchy on the home page and lesson screens
- Introduce stronger section spacing and card contrast for easier scanning
- Standardize typography scale across tracks, lessons, and dashboard
- Add clearer visual separation between completed, active, and locked states
- Improve consistency of buttons, badges, and icons across the experience

### UX/UI improvements
- Reduce cognitive load on the home page by simplifying the hero and priorities
- Make primary actions more obvious on track and lesson pages
- Improve empty states and onboarding hints with clearer copy and affordances
- Add clearer feedback for completion, bookmarking, and navigation actions
- Improve mobile layout for lesson content and sidebar navigation

### User flow improvements
- Make it easier to resume from the last lesson without extra navigation
- Reduce friction between discovering a lesson and starting it
- Improve progression clarity from track overview to lesson detail
- Make quiz and checklist entry points more discoverable at the right moment
- Add smoother transitions between home, track, lesson, and dashboard views

### General improvements
- Improve accessibility with better contrast, focus states, and keyboard navigation
- Ensure all interactive elements have clear labels and states
- Keep the content experience consistent across desktop and mobile
- Continue converting content into Markdown while improving editorial structure
- Prepare the platform for future expansion without sacrificing simplicity

## Execution plan

### Phase 1 — Immediate UX improvements (in progress)
- Improve lesson and track page hierarchy
- Make primary CTA buttons more prominent
- Improve spacing and card readability
- Add stronger empty / progress states

### Phase 2 — Navigation and progression
- Refine continue-learning experience
- Improve track-to-lesson transitions
- Make progress indicators more obvious

### Phase 3 — Accessibility and polish
- Improve keyboard focus and contrast
- Review mobile layout issues
- Add smoother visual feedback for interactions

## Commands

```bash
# Run Playwright end-to-end tests
npx playwright test --config=playwright.config.js --reporter=list

# Run unit tests
npm test
```
