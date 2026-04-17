# Course lifecycle

## States

| State | Meaning |
|-------|---------|
| DRAFT | Editable; not visible in student catalog (unless preview flag later). |
| IN_REVIEW | Optional: awaiting admin approval before publish. |
| PUBLISHED | Visible per catalog rules; students see published snapshot behavior. |
| ARCHIVED | Read-only; no new enrollments default. |

## Transitions

- DRAFT → IN_REVIEW: instructor or admin (if review enabled).
- IN_REVIEW → PUBLISHED: admin (or instructor if policy allows).
- DRAFT → PUBLISHED: instructor/admin if publish invariants pass and review skipped.
- * → ARCHIVED: instructor/admin.

## Publish invariants (configurable)

Default: at least one module and one lesson; instructor assigned; tenant active.

## Editability when PUBLISHED

- Allowed: title/description typos, thumbnail, non-structural lesson content updates (policy).
- Restricted: deleting modules that students started (soft-delete or block); changing order may require “content update” notice.

## Versioning v1

- `Lesson.revisionNote` optional on significant edits.
- `CourseAuditLog` records publish and status changes.
