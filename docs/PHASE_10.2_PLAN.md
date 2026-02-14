# Phase 10.2: API Endpoints Implementation Plan

## Objective
Formalize the API surface for future mobile apps or external integrations.

## 1. REST Standards (✅ Implemented)
- [x] **Helpers**: Created `lib/api/response.ts` with `apiResponse`, `apiError`, and `handleApiError`.
- [x] **Migration**: AI routes (`/api/ai/*`) migrated to standard response format.
- [ ] Add rate limiting using `upstash/ratelimit`.

## 2. Documentation (❌ To Do)
- [ ] Generate OpenAPI/Swagger spec from routes.

## File Structure
```
middleware.ts          # Enhance for rate limiting
lib/api/
  response.ts          # Standard response helpers
```
