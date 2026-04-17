# AI governance

## Context scopes

- **Global:** no course/lesson IDs; generic help only.
- **Course:** `courseId` must belong to user’s tenant; student must be enrolled or staff.
- **Lesson:** `lessonId` + parent course checks same as course.

## Data access

- No cross-tenant data.
- No other users’ submissions or grades unless instructor/admin on that course.

## Tools

- Allowed: summarize lesson, draft quiz questions (not persisted until instructor saves).
- Forbidden by default: auto-post grades, mass email.

## Logging

- `appLog` / structured logs: route name, userId, tenantId, scope ids; no raw prompts in production logs unless debug flag.
