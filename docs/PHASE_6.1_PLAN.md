# Phase 6.1: Live Classes Implementation Plan

## Objective
Enable instructors to schedule live sessions (via Zoom/Meet/Teams) and allow students to view and join them.

## 1. Data Model (✅ Schema Ready)
- [x] `LiveClass` model exists in Prisma schema.
- Fields: `title`, `platform`, `meetingUrl`, `scheduledAt`, `duration`.

## 2. Instructor: Schedule Class (✅ Implemented)
- [x] **Page**: `app/(dashboard)/(instructor)/courses/[id]/live/new`.
- [x] **Form**:
  - Title & Description.
  - Date & Time picker.
  - Duration.
  - Platform selection (Dropdown).
  - Meeting URL input.
- [x] **List View**: Manage upcoming classes tab in Course Builder (`app/(dashboard)/(instructor)/courses/[id]/live/page.tsx`).

## 3. Student: Join Class (✅ Implemented)
- [x] **Dashboard Integration**: "Upcoming Live Classes" widget on Student Dashboard.
- [x] **Course Tab**: "Live Classes" tab in Course Detail view (`app/(dashboard)/(student)/courses/[id]/page.tsx`).
- [x] **Page**: `app/(dashboard)/(student)/live/page.tsx` (✅ Implemented).
  - List of all upcoming live classes across enrolled courses.
  - "Join Now" button (active 10 mins before start).

## 4. Notifications (❌ To Do)
- [ ] Email reminder 1 hour before class.
- [ ] In-app notification when class starts.

## File Structure
```
app/
  (dashboard)/(instructor)/courses/[id]/live/
    page.tsx       # List & Create
  (dashboard)/(student)/live/
    page.tsx       # Student calendar/list view
components/features/live/
  LiveClassCard.tsx
  ScheduleClassForm.tsx
```
