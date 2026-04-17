# Notifications

## Types

Maps to `NotificationType` enum; extend for BILLING_ALERT, SECURITY_ALERT as needed.

## Channels

- IN_APP (always written to `Notification` row)
- EMAIL (respect `NotificationPreference`)

## Preferences

- `NotificationPreference`: per user, per type, per channel (`enabled`).
- Critical types (SECURITY, billing past_due) may be forced on by policy.

## Read / unread

- `read` boolean; “mark all read” idempotent PATCH.

## Grouping

- v1: individual rows; digest (daily) v2 aggregates by type.
