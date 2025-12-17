# Phase 1.3: Authentication Foundation - Detailed Implementation Plan

**Objective:** Set up NextAuth.js v5, configure JWT strategy, implement email/password authentication, create auth middleware, and implement role-based access control (RBAC).

---

## Step 1: Install NextAuth.js v5

### 1.1 Install Dependencies
- **Command:** `npm install next-auth@beta`
- **Command:** `npm install bcryptjs` (for password hashing)
- **Command:** `npm install -D @types/bcryptjs`
- Verify installation in `package.json`

### 1.2 Verify NextAuth Version
- Check that NextAuth v5 (beta) is installed
- Note: v5 uses App Router and different API than v4

**Files Modified:**
- `package.json`

---

## Step 2: Configure NextAuth.js

### 2.1 Create NextAuth Configuration
- **Location:** `lib/auth/config.ts`
- **Purpose:** Central auth configuration
- **Configuration:**
  - JWT strategy
  - Session configuration
  - Providers (Credentials)
  - Callbacks (jwt, session)
  - Pages customization

### 2.2 Create Auth Route Handler
- **Location:** `app/api/auth/[...nextauth]/route.ts`
- **Purpose:** NextAuth API route handler
- **Code Structure:**
  ```typescript
  import NextAuth from 'next-auth'
  import { authOptions } from '@/lib/auth/config'
  
  const handler = NextAuth(authOptions)
  
  export { handler as GET, handler as POST }
  ```

**Files Created:**
- `lib/auth/config.ts`
- `app/api/auth/[...nextauth]/route.ts`

---

## Step 3: Configure JWT Strategy

### 3.1 Set Up JWT Configuration
- **Location:** `lib/auth/config.ts`
- **JWT Settings:**
  - Secret: `process.env.NEXTAUTH_SECRET`
  - Max age: 30 days
  - Encryption: enabled
  - Include user data in token

### 3.2 Configure Session Strategy
- **Strategy:** JWT (not database sessions for simplicity)
- **Session Settings:**
  - Max age: 30 days
  - Update age: 24 hours

### 3.3 Environment Variables
- **Location:** `.env`
- **Variables:**
  ```
  NEXTAUTH_SECRET=your-secret-key-here
  NEXTAUTH_URL=http://localhost:3000
  ```
- Update `.env.example`

**Files Modified:**
- `lib/auth/config.ts`
- `.env`
- `.env.example`

---

## Step 4: Implement Email/Password Authentication

### 4.1 Create Credentials Provider
- **Location:** `lib/auth/config.ts`
- **Provider Configuration:**
  - Name: "credentials"
  - Credentials: email, password
  - Authorize function: validate credentials against database

### 4.2 Create Password Utilities
- **Location:** `lib/auth/password.ts`
- **Functions:**
  - `hashPassword(password: string): Promise<string>`
  - `verifyPassword(password: string, hash: string): Promise<boolean>`

### 4.3 Create User Authentication Functions
- **Location:** `lib/auth/user.ts`
- **Functions:**
  - `authenticateUser(email: string, password: string, tenantId?: string): Promise<User | null>`
  - `createUser(email: string, password: string, name: string, tenantId: string, role: RoleType): Promise<User>`
  - `getUserByEmail(email: string, tenantId?: string): Promise<User | null>`

**Files Created:**
- `lib/auth/password.ts`
- `lib/auth/user.ts`

**Files Modified:**
- `lib/auth/config.ts`

---

## Step 5: Create Auth Middleware

### 5.1 Create Middleware File
- **Location:** `middleware.ts` (root level)
- **Purpose:** Protect routes, handle authentication
- **Features:**
  - Check authentication status
  - Redirect unauthenticated users
  - Handle tenant context
  - Protect API routes

### 5.2 Configure Protected Routes
- **Protected Routes:**
  - `/dashboard/**` - Requires authentication
  - `/api/**` (except auth) - Requires authentication
  - `/courses/**` - Requires authentication
- **Public Routes:**
  - `/` - Landing page
  - `/login` - Login page
  - `/register` - Registration page
  - `/api/auth/**` - Auth endpoints

**Files Created:**
- `middleware.ts`

---

## Step 6: Set Up Session Management

### 6.1 Create Session Utilities
- **Location:** `lib/auth/session.ts`
- **Functions:**
  - `getServerSession()` - Get session on server
  - `getCurrentUser()` - Get current user from session
  - `getCurrentTenant()` - Get current tenant from session

### 6.2 Create Client-Side Auth Hook
- **Location:** `hooks/useAuth.ts`
- **Purpose:** React hook for client-side auth state
- **Features:**
  - Get current user
  - Get session status
  - Sign in/out functions
  - Loading state

**Files Created:**
- `lib/auth/session.ts`
- `hooks/useAuth.ts`

---

## Step 7: Implement Role-Based Access Control (RBAC)

### 7.1 Create Permission System
- **Location:** `lib/auth/permissions.ts`
- **Purpose:** Define and check permissions
- **Permission Types:**
  - `COURSE_CREATE`
  - `COURSE_EDIT`
  - `COURSE_DELETE`
  - `STUDENT_MANAGE`
  - `EXAM_CREATE`
  - `EXAM_GRADE`
  - `TENANT_MANAGE`
  - `USER_MANAGE`
  - etc.

### 7.2 Create Role Definitions
- **Location:** `constants/permissions.ts`
- **Role Permissions:**
  - SUPER_ADMIN: All permissions
  - ADMIN: Tenant management, user management
  - INSTRUCTOR: Course management, grading, student view
  - STUDENT: Course access, exam taking, profile

### 7.3 Create Permission Check Utilities
- **Location:** `lib/auth/permissions.ts`
- **Functions:**
  - `hasPermission(user: User, permission: string): boolean`
  - `hasRole(user: User, role: RoleType): boolean`
  - `canAccess(user: User, resource: string, action: string): boolean`

### 7.4 Create Permission Middleware
- **Location:** `lib/auth/middleware.ts`
- **Purpose:** Check permissions in API routes
- **Functions:**
  - `requireAuth()` - Require authentication
  - `requireRole(role: RoleType)` - Require specific role
  - `requirePermission(permission: string)` - Require specific permission

**Files Created:**
- `lib/auth/permissions.ts`
- `lib/auth/middleware.ts`

**Files Modified:**
- `constants/permissions.ts`

---

## Step 8: Create Auth API Routes

### 8.1 Registration Route
- **Location:** `app/api/auth/register/route.ts`
- **Methods:** POST
- **Functionality:**
  - Validate input (email, password, name, tenantId)
  - Hash password
  - Create user
  - Return user (without password)

### 8.2 Password Reset Routes
- **Location:** `app/api/auth/forgot-password/route.ts`
- **Methods:** POST
- **Functionality:** Send password reset email

- **Location:** `app/api/auth/reset-password/route.ts`
- **Methods:** POST
- **Functionality:** Reset password with token

**Files Created:**
- `app/api/auth/register/route.ts`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`

---

## Step 9: Create Auth Provider Component

### 9.1 Create Session Provider
- **Location:** `components/providers/SessionProvider.tsx`
- **Purpose:** Wrap app with NextAuth SessionProvider
- **Usage:** Wrap root layout

### 9.2 Update Root Layout
- **Location:** `app/layout.tsx`
- **Add:** SessionProvider wrapper

**Files Created:**
- `components/providers/SessionProvider.tsx`

**Files Modified:**
- `app/layout.tsx`

---

## Step 10: Create Auth Utilities for Forms

### 10.1 Create Sign In Function
- **Location:** `lib/auth/actions.ts`
- **Function:** `signIn(email: string, password: string, tenantId?: string)`

### 10.2 Create Sign Out Function
- **Location:** `lib/auth/actions.ts`
- **Function:** `signOut()`

### 10.3 Create Registration Function
- **Location:** `lib/auth/actions.ts`
- **Function:** `register(email: string, password: string, name: string, tenantId: string)`

**Files Created:**
- `lib/auth/actions.ts`

---

## Step 11: Create Protected Route Component

### 11.1 Create Auth Guard Component
- **Location:** `components/auth/AuthGuard.tsx`
- **Purpose:** Protect pages/components
- **Features:**
  - Check authentication
  - Redirect if not authenticated
  - Show loading state
  - Check permissions

### 11.2 Create Role Guard Component
- **Location:** `components/auth/RoleGuard.tsx`
- **Purpose:** Protect based on role
- **Usage:** Wrap components that need specific roles

**Files Created:**
- `components/auth/AuthGuard.tsx`
- `components/auth/RoleGuard.tsx`

---

## Step 12: Update Database Schema for Auth

### 12.1 Add Auth Fields to User Model
- **Location:** `prisma/schema.prisma`
- **Fields to ensure:**
  - `password` (hashed)
  - `emailVerified` (DateTime?)
  - `role` (RoleType)
  - Indexes on email and tenantId

### 12.2 Create Migration
- **Command:** `npx prisma migrate dev --name add_auth_fields`
- Apply migration

**Files Modified:**
- `prisma/schema.prisma`

---

## Step 13: Create Auth Types

### 13.1 Create Auth Type Definitions
- **Location:** `types/auth.ts`
- **Types:**
  - `AuthUser` - User type for auth context
  - `Session` - Session type
  - `LoginCredentials` - Login input type
  - `RegisterInput` - Registration input type

**Files Created:**
- `types/auth.ts`

---

## Step 14: Testing Authentication

### 14.1 Test Registration
- Create test user via registration endpoint
- Verify user in database
- Verify password is hashed

### 14.2 Test Login
- Login with credentials
- Verify session created
- Verify JWT token generated

### 14.3 Test Protected Routes
- Access protected route without auth (should redirect)
- Access protected route with auth (should work)
- Test role-based access

### 14.4 Test Middleware
- Test route protection
- Test tenant context
- Test API route protection

---

## Deliverables Checklist

- [ ] NextAuth.js v5 installed and configured
- [ ] JWT strategy configured
- [ ] Email/password authentication implemented
- [ ] Password hashing utilities created
- [ ] Auth middleware created and working
- [ ] Session management set up
- [ ] RBAC system implemented
- [ ] Permission system created
- [ ] Auth API routes created
- [ ] Auth provider component created
- [ ] Protected route components created
- [ ] Auth types defined
- [ ] Database schema updated for auth
- [ ] Authentication tested and working

---

## File Structure Summary

### Created Files:
- `lib/auth/config.ts` (NextAuth configuration)
- `lib/auth/password.ts` (Password utilities)
- `lib/auth/user.ts` (User auth functions)
- `lib/auth/session.ts` (Session utilities)
- `lib/auth/permissions.ts` (Permission system)
- `lib/auth/middleware.ts` (Permission middleware)
- `lib/auth/actions.ts` (Auth actions)
- `app/api/auth/[...nextauth]/route.ts` (NextAuth route)
- `app/api/auth/register/route.ts`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `middleware.ts` (Route protection)
- `components/providers/SessionProvider.tsx`
- `components/auth/AuthGuard.tsx`
- `components/auth/RoleGuard.tsx`
- `hooks/useAuth.ts`
- `types/auth.ts`

### Modified Files:
- `package.json` (dependencies)
- `.env` (NEXTAUTH_SECRET, NEXTAUTH_URL)
- `.env.example`
- `app/layout.tsx` (SessionProvider)
- `prisma/schema.prisma` (auth fields)
- `constants/permissions.ts` (role definitions)

---

## Next Steps

After completing Phase 1.3, proceed to:
- **Phase 2.1**: Design System Configuration
- **Phase 2.2**: Core UI Components

---

## Notes

- Always hash passwords (never store plain text)
- Use secure JWT secrets (generate with `openssl rand -base64 32`)
- Implement rate limiting on auth endpoints
- Add CSRF protection
- Use HTTPS in production
- Implement email verification flow
- Add password strength requirements
- Consider 2FA for future enhancement

