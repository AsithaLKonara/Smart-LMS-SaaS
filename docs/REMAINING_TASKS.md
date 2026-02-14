# Remaining Tasks - Smart LMS

This document tracks the final tasks required to bring the Smart LMS project to production readiness.

## 🚀 Block 1: UI/UX Polish & Dashboards
- [x] **Student Dashboard**: Add `loading.tsx` with skeleton loaders for stats and course grids.
- [x] **Global Dashboard**: Add `error.tsx` boundaries for graceful failure.
- [x] **Empty States**: Create "Wow" empty state illustrations and CTAs for empty course lists and live classes.

## 🛠️ Block 2: Advanced Content Creation (Instructor)
- [x] **DND Reordering**: Implement drag-and-drop for modules and lessons using `@hello-pangea/dnd`.
- [x] **Rich Text Editor**: Replace basic textarea with a professional rich text editor (Tiptap) for lesson content.

## 📚 Block 3: Advanced Course Features
- [x] **Assignment Builder**: Support for file attachments and specific due-date restrictions.
- [x] **Live Class Notifications**:
  - [x] Email reminders (1 hour before).
  - [x] In-app "Class Starting" toast notifications.

## 🔒 Block 4: Security & API Hardening
- [ ] **Account Security**:
  - [x] Password Change server action and UI.
  - [x] 2-Factor Authentication (placeholder/logic setup).
- [ ] **API Standards**:
  - [x] Rate limiting for all `/api/*` routes.
  - [x] OpenAPI/Swagger documentation generation.

## 🧪 Block 5: Quality Assurance & Performance
- [x] **Unit Testing**: Setup Vitest and test critical business logic (enrollments, analytics).
- [ ] **E2E Testing**: Setup Playwright and test critical user flows (Onboarding -> Course Completion).
- [ ] **Performance**: 
  - [x] Verify Prisma indexes on all foreign keys.
  - [x] Add caching for heavy analytics queries.

## 📄 Block 6: Deployment & Documentation
- [x] **CI/CD**: Setup GitHub Actions for automated type checking and linting.
- [x] **Developer Docs**: Create `CONTRIBUTING.md` (done) and Architecture overview.
- [x] **User Manuals**: Comprehensive guides for Instructors and Admins.

---
*Last Updated: 2026-02-13*
