# UX flows

## Discovery → first lesson

1. Student browses `/courses` (published only).
2. Enroll `/api/courses/[id]/enroll` → enrollment created.
3. Redirect to course detail → first incomplete lesson or syllabus.

## Instructor publish

1. Edit course in builder (DRAFT).
2. Publish action validates invariants → status PUBLISHED → `CourseAuditLog`.

## Submit → grade

1. Student submits assignment → `Submission`.
2. Instructor grades → `Submission` update + `SubmissionGradeHistory` entry.

## Live class

1. Instructor creates `LiveClass`.
2. Cron/reminders notify → student joins URL.
3. Optional attendance rows recorded.

## Failure paths

- Each step: 401 auth, 403 RBAC, 404 not found, 409 conflict (e.g., seat limit), 422 validation.

## Analytics

- See ANALYTICS_EVENTS.md for event names per step.
