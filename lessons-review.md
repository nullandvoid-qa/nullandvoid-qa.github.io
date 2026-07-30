# Lessons Review

This document provides an honest lesson-by-lesson assessment of the course content under `content/lessons`.

## Score legend
- 5/5: Excellent, strong coverage, clear examples.
- 4/5: Good, useful content, a few areas could be strengthened.
- 3/5: Solid, but needs clearer structure, deeper examples, or stronger takeaways.
- 2/5: Basic coverage with noticeable gaps or repetition.
- 1/5: Placeholder, missing key content, or needs major improvement.

---

## 1. O que é QA e por que importa
- Score: 5/5
- Strengths:
  - Strong framing of QA as prevention, not just bug hunting.
  - Good use of myth vs reality comparison and real cost examples.
  - Practical pillars and daily QA workflow make it approachable.
- Improvement:
  - Could add a short mini-case showing how a QA mindset changes a real requirement earlier in the process.

## 2. Papéis: QA, QC e Tester
- Score: 5/5
- Strengths:
  - Clear differentiation between QA, QC, and Tester roles.
  - Good analogies and structured comparison table.
  - Useful exercises for reinforcing role boundaries.
- Improvement:
  - Could benefit from a concrete team example where the same task is split across roles.

## 3. SDLC e onde o QA se encaixa
- Score: 5/5
- Strengths:
  - Excellent explanation of shift-left and phase-by-phase QA involvement.
  - Strong visual/literal mapping of QA activities to SDLC stages.
  - Good cost-of-bug progression reinforces the argument.
- Improvement:
  - Add one explicit example of a non-technical QA activity in the design phase.

## 4. Testes funcionais vs não-funcionais
- Score: 4/5
- Strengths:
  - Clear functional vs non-functional distinction.
  - Useful matrix with examples and tools.
  - Good practical checklist for different test types.
- Improvement:
  - Could include a short worked example of a single feature with both types mapped side by side.

## 5. Partição de Equivalência, Valor Limite e Tabela de Decisão
- Score: 4/5
- Strengths:
  - Good explanation of equivalence classes and boundary values.
  - Strong practical examples for age, discounts, and transfer limits.
  - Adds decision table thinking to handle multiple-condition rules.
- Improvement:
  - The lesson could be more explicit about when to stop adding boundary values versus when to generalize.

## 6. Teste Exploratório
- Score: 5/5
- Strengths:
  - Well-structured session workflow and charter guidance.
  - Valuable heuristics and real templates for exploratory testing.
  - Strong distinction between exploratory and roteirized testing.
- Improvement:
  - Add guidance on how to blend exploratory testing with scripted regression.

## 7. Cerimônias Agile
- Score: 4/5
- Strengths:
  - Good coverage of QA participation in refinement, planning, daily, review, and retrospective.
  - Practical questions and real example dialogue add credibility.
- Improvement:
  - The lesson could be more concise in the longer ceremony sections and surface one quick checklist for each ceremony.

## 8. Three Amigos
- Score: 5/5
- Strengths:
  - Excellent template and concrete preparation steps.
  - Strong emphasis on risk, ambiguity, and testable acceptance criteria.
  - Good exercises and practical outcome expectations.
- Improvement:
  - Add a short note on how to handle a Three Amigos when one of the roles is absent.

## 9. Critérios de Aceitação e Definição de Pronto
- Score: 5/5
- Strengths:
  - Very strong examples of bad vs good acceptance criteria.
  - Good connection to Definition of Done.
  - Useful checklists and templates for multiple project types.
- Improvement:
  - Could add a quick section on who should own acceptance criteria updates.

## 10. Matriz de Risco e Estratégia de Teste
- Score: 4/5
- Strengths:
  - Clear process for building a risk matrix.
  - Good numeric approach to impact and probability.
  - Valuable practical examples for delivery and banking.
- Improvement:
  - Could include a short section on updating the matrix as requirements change.

## 11. Testes de Regressão e Automação Inteligente
- Score: 5/5
- Strengths:
  - Strong guidance on when to automate and when not to.
  - Clear automation pyramid and ROI discussion.
  - Useful tool recommendations by layer.
- Improvement:
  - Could mention common pitfalls in maintaining flaky E2E tests.

## 12. Definition of Done e Qualidade em Agile
- Score: 4/5
- Strengths:
  - Very practical DoD examples for finance, e-commerce, and APIs.
  - Good tie-in between DoD and quality accountability.
- Improvement:
  - Add an explicit example of a bad DoD item and how to improve it.

## 13. iOS Emulator para Testes
- Score: 4/5
- Strengths:
  - Good practical coverage of setup, requirements, and commands.
  - Clear distinction between simulator and real device limitations.
- Improvement:
  - Add simulator-specific gotchas and a short performance note.

## 14. Android Emulator para Testes
- Score: 4/5
- Strengths:
  - Good setup instructions and tooling guidance.
  - Clear hardware acceleration and AVD manager points.
- Improvement:
  - Add a brief Windows emulator boot troubleshooting section.

## 15. BrowserStack para Testes
- Score: 4/5
- Strengths:
  - Good coverage of credentials, Selenium/Cypress/Playwright setup, and mobile Appium.
  - Useful cloud testing guidance.
- Improvement:
  - Add a direct comparison with local emulators and a cloud cost note.

## 16. SauceLabs para Testes
- Score: 4/5
- Strengths:
  - Good overview of web and mobile setup.
  - Clear connection to CI/CD and automation frameworks.
- Improvement:
  - Add a short decision guide for SauceLabs vs BrowserStack.

---

## Performance lesson status
- `perf-l1.md`..`perf-l7.md` now include concrete objectives, practical exercises, and CI/observability references.
- Current status: JMeter and k6 examples exist, plus CI workflows; the lessons are now ready for final polish and real-world sample outputs.

---

## Recommended focus
- Finish the `perf-l*` lessons with concrete outputs, sample reports, and CI-driven practice.
- Polish `l13`..`l16` mobile/cloud lessons for decision guidance and common troubleshooting.
- Keep this review concise and centered on lesson quality rather than detailed course expansion planning.

## Summary
Overall, the main lesson sequence is strong and well structured. The core Agile and QA content is practical and aligned with industry expectations. The main improvement areas are:
- adding a few more concrete, relatable team examples;
- tightening longer ceremony and risk sections with more concise takeaways;
- expanding the mobile/cloud tool lessons with quick troubleshooting and comparison guidance;
- completing the placeholder performance lessons and linking them to real CI-driven outputs.

The placeholder performance lessons should be completed before the course is final.
