# Production Deploy and Migration Runbook

## Preconditions

- CI must pass on the release commit.
- Staging sign-off completed for:
  - role flows (admin/instructor/student)
  - billing
  - messaging
  - asset library
- Backup snapshot/PITR checkpoint confirmed in managed Postgres.

## Deploy Sequence

1. Merge approved release PR to `main`.
2. Verify Vercel production build starts successfully.
3. Run Prisma migration in production context:
   - `npx prisma migrate deploy`
4. Validate post-migration integrity:
   - users, courses, and tenant counts unchanged
   - new module tables present (`message_threads`, `assets`, `billing_profiles`)
5. Execute smoke tests:
   - login
   - dashboard load
   - messaging thread list
   - billing page load for admin
   - notifications mark-read flow
6. Announce deployment completion and monitor for 30 minutes.

## Rollback

- If code-level issue (no destructive migration): rollback Vercel deployment to prior stable build.
- If migration issue:
  - stop new writes where needed
  - restore from PITR checkpoint
  - redeploy last stable release

## Post-Deploy Verification Queries

- Confirm tenant ownership consistency:
  - all `message_threads.tenantId` values map to existing tenants
  - all `assets.tenantId` values map to existing tenants
  - all `billing_profiles.tenantId` values unique and valid
