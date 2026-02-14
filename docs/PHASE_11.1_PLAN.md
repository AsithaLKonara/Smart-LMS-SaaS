# Phase 11.1: Testing Strategy

## Objective
Ensure code quality and prevent regressions using automated tests.

## 1. Unit Testing (❌ To Do)
- [ ] **Framework**: Vitest + React Testing Library.
- [ ] **Targets**:
  - Utility functions (`lib/utils.ts`).
  - Hooks (`useEnrollment`).
  - Simple Components (`Button`, `Card`).

## 2. E2E Testing (❌ To Do)
- [ ] **Framework**: Playwright.
- [ ] **Critical Flows**:
  - Registration -> Onboarding.
  - Instructor creates course.
  - Student enrolls and completes lesson.

## File Structure
```
tests/
  unit/
  e2e/
vitest.config.ts
playwright.config.ts
```
