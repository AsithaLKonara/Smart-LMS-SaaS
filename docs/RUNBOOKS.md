# SmartLMS Operations Runbook

This document outlines common operational procedures for maintaining the SmartLMS platform.

## 1. Tenant Management

### Adding a New Tenant Manually
1. Access the Prisma Studio or the production database.
2. Create a new `Tenant` record:
   - `name`: The organization name.
   - `slug`: Unique identifier for the tenant (used in subdomains or paths).
   - `plan`: `FREE`, `PRO`, or `ENTERPRISE`.
3. Create a `User` record with `role: ADMIN` and the new `tenantId`.

### Changing Tenant Plan
1. Update the `plan` field in the `Tenant` record.
2. Changes take effect immediately due to the `assertCourseLimit` and `assertSeatAvailable` checks in server actions.

## 2. Database Migrations
1. Always back up the production database before running migrations.
2. Run `npx prisma migrate deploy` in the CI/CD pipeline.
3. If a migration fails, verify the state using `npx prisma migrate status`.

## 3. Troubleshooting

### Pusher Events Not Delivering
1. Verify `PUSHER_APP_ID`, `PUSHER_APP_SECRET`, and `NEXT_PUBLIC_PUSHER_APP_KEY` in the environment.
2. Check the Pusher Debug Console for the specific app.
3. Ensure the client is subscribing to the correct channel format: `thread-{id}`.

### Upload Errors
1. Verify `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.
2. Ensure the file size does not exceed the limits defined in `app/api/uploadthing/core.ts`.
