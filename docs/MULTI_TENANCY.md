# Multi-Tenant Architecture Overview

SmartLMS uses a **shared database, shared schema** approach with logical isolation enforced at the application layer.

## How Isolation Works

### 1. Database Schema
Every table that contains tenant-specific data (Courses, Users, Assets, Messages, etc.) has a `tenantId` field.
```prisma
model Course {
  id           String   @id @default(cuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  // ...
  @@index([tenantId])
}
```

### 2. Authentication & Context
We use a centralized helper `getSessionContext()` in `lib/auth/utils.ts`.
This helper:
- Verifies the user's session.
- Extracts the `tenantId` from the session.
- Returns a consistent context for use in server actions and API routes.

### 3. Query Enforcement
Every query must include the `tenantId` in the `where` clause.
**Correct:**
```typescript
prisma.course.findFirst({
  where: { id: courseId, tenantId }
})
```
**Incorrect:**
```typescript
prisma.course.findUnique({
  where: { id: courseId }
})
```

## RBAC (Role-Based Access Control)
Roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`, `SUPER_ADMIN`) are checked alongside `tenantId`.
- **STUDENTS** can only see courses they are enrolled in within their tenant.
- **INSTRUCTORS** can only manage courses they created within their tenant.
- **ADMINS** can manage all resources within their specific tenant.
