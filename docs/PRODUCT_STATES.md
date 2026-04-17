# Product states (UI + domain)

Canonical behavior for loading, empty, error, offline, and partial data across Smart LMS.

## Conventions

| State | Lists/tables | Detail pages | Forms | Media/player |
|-------|----------------|-------------|--------|----------------|
| Loading | Skeleton rows (6–10), preserve header | Header skeleton + 2 content blocks | Disable submit, inline spinner on primary button | Poster + buffering indicator |
| Empty | `EmptyState` + primary CTA | N/A (redirect or parent empty) | N/A | N/A |
| Error | Banner + retry; keep last good data if safe | Full-page error or section error | Field errors + toast | Retry + position preserved |
| Partial | Badge “Incomplete data”; disable risky actions | Show loaded sections; skeleton missing | Block submit until required loaded | Show available track only |
| Offline | Sticky banner; disable mutations | Same | Queue or block with message | Pause; explain reconnect |

## Per module

- **Course catalog:** loading skeleton grid; empty “No courses” + filter reset; 403 if tenant suspended (error).
- **Course builder:** empty module list CTA; publish errors inline; cannot publish if validation fails (partial).
- **Lesson player:** loading lesson shell; error 404/403 distinct copy; offline banner; heartbeat failures non-fatal.
- **Assignments:** empty “No assignments”; submission error with retry; late submission per policy (see ASSESSMENTS.md).
- **Gradebook:** empty “Nothing to grade”; error retry.
- **Messaging:** empty thread list; send failure toast + message retained in composer.
- **Notifications:** empty “All caught up”; mark-read failures toast.
- **Billing:** past_due state read-only banner (see BILLING_TENANCY.md).

## Role denial (403)

Use dedicated page or inline card: “You don’t have access” + link to home; log server-side for audit.
