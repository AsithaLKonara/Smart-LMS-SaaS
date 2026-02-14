# Phase 5.1: Course Listing Implementation Plan

## Objective
Create the interfaces for browsing and managing courses. This includes the public/student course catalog and the instructor's course management list.

## 1. Student Course Catalog (✅ Implemented)
- [x] **Page**: `app/(dashboard)/(student)/courses/page.tsx`.
- [x] **Visuals**:
  - Grid layout with `Card` components.
  - Distinct sections for "My Enrolled Courses" and "Available Courses".
  - Accessibility: Interactive cards with hover states.
- [x] **Logic**:
  - Fetches published courses via `getCoursesByTenant`.
  - Filters out enrolled vs non-enrolled.

## 2. Instructor Course List (✅ Implemented)
- [ ] **Page**: `app/(dashboard)/(instructor)/courses/page.tsx`.
- [ ] **Features**:
  - Table or List view of created courses.
  - Status badges (Draft, Published, Archived).
  - Quick actions (Edit, Delete, Publish).
  - "Create New Course" button (links to `/instructor/courses/new`).

## 3. Data Queries (✅ Implemented)
- [x] `getCoursesByTenant(tenantId, status)`: Capable of filtering by status.
- [ ] `getCourseStats(courseId)`: Needed for instructor view (enrollment count, etc).

## File Structure
```
app/(dashboard)/
  (student)/courses/page.tsx       # ✅ Done
  (instructor)/courses/page.tsx    # ✅ Done
components/
  features/courses/
    CourseCard.tsx                 # ✅ Done (inline in page currently, consider extracting)
    CourseListTable.tsx            # ❌ To Do (for instructor)
```
