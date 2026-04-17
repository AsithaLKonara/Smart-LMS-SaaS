# Assets

## Scoping

- Tenant-wide library: `courseId` null.
- Course-scoped: `courseId` set; reuse via same row reference.

## Folders

- `Asset.parentFolderId` optional self-relation for virtual folders v1.

## Versioning

- `Asset.version` increment on replace; future `AssetVersion` table for full history.

## Download policy (`AssetDownloadPolicy`)

- TENANT_STAFF: instructors + admins
- COURSE_ENROLLED: enrolled students + staff
- PUBLIC_WITHIN_TENANT: all users in tenant (rare)

## Quotas

- Enforced via `UsageMetric` + billing plan (see BILLING_TENANCY.md).
