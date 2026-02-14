# Phase 5.4: Course Builder (Instructor) Implementation Plan

## Objective
Build the interface for instructors to create and manage course content, utilizing a drag-and-drop hierarchy for modules and lessons.

## 1. Core Structure (✅ Implemented)
- [ ] **Course Settings**: Form to edit title, description, thumbnail, price (if any).
- [ ] **Curriculum Builder**:
  - Tree view of Modules -> Lessons.
  - Ability to Add/Delete/Reorder Modules.
  - Ability to Add/Delete/Reorder Lessons.

## 2. Content Editors (❌ To Be Implemented)
- [ ] **Lesson Editor**:
  - Title input.
  - Video URL input.
  - Rich Text Editor (TipTap or similar) for lesson content.
  - Duration input.
  - "Make Free Preview" toggle.

## 3. State Management
- [ ] Use `react-hook-form` and `zod` for validation.
- [ ] Optimistic UI updates for drag-and-drop reordering.

## 4. Server Actions
- [ ] `createCourse`
- [ ] `updateCourse`
- [ ] `createModule`, `updateModule`, `reorderModules`
- [ ] `createLesson`, `updateLesson`, `reorderLessons`

## Implementation Steps
1.  **Scaffold Routes**: Create `app/(dashboard)/(instructor)/courses/[id]/page.tsx`.
2.  **Course Form**: Basic details editor.
3.  **Module List**: Component to list and manage modules.
4.  **Lesson Editor**: Modal or separate page/panel to edit lesson details.
5.  **Publishing Flow**: "Publish" button with validation (must have >0 lessons).

## File Structure
```
app/(dashboard)/(instructor)/courses/
  [id]/page.tsx            # Main builder page
  create/page.tsx          # New course wizard
components/features/builder/
  CourseTitleForm.tsx      # ✅ Done
  ModuleList.tsx           # ✅ Done
  ModulesForm.tsx          # ✅ Done
  LessonForm.tsx           # ✅ Done (as separate page)
  PublicationControls.tsx  # ✅ Done
```
