# Analytics events

## Naming

`category.action` lowercase snake-case.

## Core events

| Event | Properties |
|-------|------------|
| course.viewed | course_id, tenant_id |
| course.enrolled | course_id, user_id |
| lesson.started | lesson_id, course_id |
| lesson.completed | lesson_id, course_id, duration_sec |
| assignment.submitted | assignment_id, course_id |
| assignment.graded | assignment_id, grader_id |
| exam.started | exam_id |
| exam.submitted | exam_id, score |
| live.joined | live_class_id |
| message.sent | thread_id, scope |
| notification.opened | notification_id, type |
| ai.chat | scope, course_id?, lesson_id? |

## Dashboards

- **Instructor:** course engagement, submission funnel.
- **Admin:** tenant health, seat usage, billing status (aggregated).

## PII

- Avoid raw email in event payloads; use hashed id or internal user id only.
