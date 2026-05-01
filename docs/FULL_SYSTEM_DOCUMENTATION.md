
# SmartLMS: Full System Documentation (Feature-by-Feature & Flow-by-Flow)

This document provides an exhaustive explanation of the SmartLMS platform, detailing the technical architecture, business logic, and user journey flows for all stakeholders.

---

## 1. Core Architecture & Multi-Tenancy

### Multi-Tenant Isolation Flow
SmartLMS uses a **Subdomain-Based Multi-Tenancy** model. This is the foundation of the platform.

1.  **Request Detection**: Every incoming request passes through `middleware.ts`.
2.  **Subdomain Parsing**: The middleware extracts the subdomain (e.g., `academy1.smartlms.space`).
3.  **Tenant Lookup**: The system queries the `Tenant` table in PostgreSQL to find the matching `subdomain`.
4.  **Routing**: 
    *   If the subdomain is `www` or empty, it routes to the **SaaS Landing Page**.
    *   If a tenant is found, it injects the `tenantId` into the application context, effectively "locking" the user into that institute's database scope.
5.  **Security**: All database queries (Prisma) include a mandatory `where: { tenantId }` clause to ensure no data leaks between institutes.

---

## 2. Authentication & Identity Management

### The Unified Login Flow
Users exist globally but are scoped to tenants. A user with the same email can technically exist in multiple tenants with different roles.

1.  **Identity Provider**: Uses **NextAuth.js v5** with a custom Credentials provider.
2.  **Session Context**: Upon login, the system fetches the user's `role`, `tenantId`, and `id`.
3.  **Global vs Local**:
    *   **Super Admins**: Authenticate against the system root.
    *   **Students/Instructors**: Authenticate against their specific institute subdomain.
4.  **RBAC Initialization**: The user's role is mapped to a set of `PERMISSIONS` defined in `constants/permissions.ts`.

---

## 3. Institute Management (The Admin Flow)

### Onboarding a New Institute
1.  **Registration**: A potential institute owner signs up on the main SaaS landing page.
2.  **Tenant Creation**: A new entry in the `Tenant` table is created with a unique `subdomain`.
3.  **Role Assignment**: The owner is automatically assigned the `TENANT_ADMIN` role.
4.  **Branding (The Customization Flow)**:
    *   Owner uploads a **Logo**.
    *   Selects an **Accent Color** (stored as HEX).
    *   Defines **Public Metadata** (Tagline, Description).
    *   *System Logic*: These values are stored in the `Tenant` record and used to dynamically style the entire academy UI (headers, buttons, shadows).

---

## 4. Course Lifecycle (The Instructor Flow)

### From Idea to Publication
1.  **Creation**: Instructor clicks "New Course". A `DRAFT` course record is created.
2.  **Curriculum Building**:
    *   **Modules**: Structural containers (e.g., "Week 1").
    *   **Lessons**: The core content (Video URLs, Rich Text, Attachments).
3.  **Pricing Flow**: Instructor sets a price (e.g., 5000 LKR). This updates the `price` field in the `Course` model.
4.  **Review & Publish**: 
    *   Instructor submits for review (optional) or publishes directly.
    *   The `status` changes to `PUBLISHED`, making it visible on the Institute's public course list.

---

## 5. The Student Journey (The Learning Flow)

### Enrollment & Progress
1.  **Discovery**: Student visits the public `/institutes` directory or the specific `/courses` page of an academy.
2.  **Enrollment Flow**:
    *   **Free Courses**: Instant access via `Enrollment` record creation.
    *   **Paid Courses**: Redirects to the **Payment Flow** (Order creation -> Payment -> Enrollment activation).
3.  **Consumption**:
    *   **Lesson Player**: A custom-built player supporting YouTube/Vimeo.
    *   **Completion Logic**: Can be `MANUAL` (student clicks button) or `VIDEO_THRESHOLD` (automatic completion after 90% watch time).
4.  **Assessment**:
    *   **Assignments**: Students upload files. Instructors grade them using the `GRADE_OVERRIDE` flow.
    *   **Exams**: Dynamic JSON-based quizzes with automatic scoring.

---

## 6. Financial & Payout Logic

### The Transaction Flow
1.  **Order Generation**: When a student clicks "Buy", an `Order` is created in `PENDING` status.
2.  **Payment Gateway**: 
    *   Supports Bank Slip uploads for manual verification.
    *   Once verified, a `FinancialTransaction` record of type `INFLOW` is created.
3.  **Revenue Split**: The system tracks the net amount after platform fees.
4.  **Payout Flow**: Instructors view their "Earnings" dashboard. They can request a payout, which creates a `Payout` record in `PENDING` status for the Admin to process.

---

## 7. AI Integration (Smart Features)

### AI Tutor & Content Assistant
1.  **AI Tutor**: Students can chat with an AI specifically about a lesson. The system sends the lesson content as context to the AI model.
2.  **Content Generation**: Instructors use AI to generate module outlines or quiz questions, which are then saved directly into the course structure.
3.  **Grade Assist**: AI analyzes student submissions and suggests a grade/feedback based on a rubric provided by the instructor.

---

## 8. Security & RBAC (The Hardened Layer)

### The `can()` Policy Flow
Instead of checking roles directly in components, the system uses a centralized **Guard**:

1.  **The Call**: `can(user, PERMISSIONS.COURSE_EDIT, course)`
2.  **Tenancy Check**: `user.tenantId === course.tenantId`. If false, immediate rejection.
3.  **Ownership Check**: If the user is an `INSTRUCTOR`, the system verifies `user.id === course.instructorId`.
4.  **Role Override**: `SUPER_ADMIN` and `ADMIN` roles bypass ownership checks but are still bound by tenancy (unless in Global mode).

---

## 9. Technology Stack Summary
*   **Framework**: Next.js 16 (App Router, Turbopack)
*   **Database**: PostgreSQL (Supabase/Prisma)
*   **Styling**: Vanilla CSS + Tailwind 4 (using CSS variables for dynamic branding)
*   **Charts**: Recharts (Client-side rendering)
*   **Icons**: Lucide React
*   **Animations**: Framer Motion
*   **Auth**: NextAuth.js v5

---

*Documentation maintained by Antigravity AI.*
