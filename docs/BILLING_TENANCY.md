# Billing + tenancy

## Tenancy

- All queries scoped by `tenantId` except explicit super-admin global routes (listed in code).

## Plans

- `Plan` enum on `Tenant` + `BillingProfile.currentPlan`.
- **Seats:** `BillingProfile.seatLimit`; count active users in tenant vs limit.

## Subscription status

- `BillingProfile.subscriptionStatus`: `active | past_due | canceled | trialing`.
- `graceEndsAt`: after past_due, read-only mode if grace exceeded.

## Usage meters

- `UsageMetric` keys: `storage_bytes`, `ai_tokens`, `streaming_minutes`, etc.

## Downgrade

- Data retained; features gated by plan (implementation: feature flags per tenant).
