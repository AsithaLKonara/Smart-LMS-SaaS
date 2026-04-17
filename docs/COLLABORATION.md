# Messaging + collaboration

## Channels

- **DIRECT:** `MessageScope.DIRECT`, members explicit.
- **COURSE:** `MessageScope.COURSE`, `courseId` set; members = instructors + enrolled students (enforced on add).
- **COHORT (future):** requires cohort membership table.

## Threading

- v1: flat messages (no reply threading).

## Attachments

- `Message.attachmentUrl` optional; MIME allowlist and max size enforced at API.

## Moderation

- `Message.flagged`, `Message.removedAt`; instructor/admin can hide; reporter flow v2.

## Retention

- Default: retain until tenant deletion policy; configurable per plan.
