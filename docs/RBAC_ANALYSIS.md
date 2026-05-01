# RBAC Dashboard & Permission Analysis

This document provides a comprehensive analysis of the current Role-Based Access Control (RBAC) implementation, evaluates how it aligns with the requirement for Platform vs. Tenant isolation, and identifies critical gaps that need addressing.

## 1. Role Definitions & Objectives

| Role | Responsibility | Scope |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | Platform Owner (You) | Global: All tenants, all users, all transactions, system health. |
| **ADMIN** | Platform Staff | Global: Operational oversight, tenant management, global billing. |
| **TENANT_ADMIN** | Institute/Org Owner | Isolated: Own students, own courses, own revenue, own settings. |
| **INSTRUCTOR** | Content Creator | Course: Managing lessons, grading, student interaction. |
| **STUDENT** | Learner | Individual: Content consumption, progress tracking. |

---

## 2. Feature Analysis & Requirement Comparison

### 2.1. Admin Dashboard (`/admin/dashboard`)
*   **Current Feature**: Displays "System Command Center" with Global Stats (Total Tenants, Global Users, Total Revenue).
*   **Alignment with Last Requirement**: 
    *   `SUPER_ADMIN`: Correctly sees global data.
    *   `TENANT_ADMIN`: Data is filtered by `tenantId`, but the **UI context is incorrect**. They see labels like "Total Tenants" and "System Command Center" which are misleading for an institute owner.
*   **Gap**: The dashboard needs a "Tenant Mode" that changes labels to "Institute Overview" and displays "Total Courses" or "Total Students" instead of "Total Tenants".

### 2.2. User Management (`/admin/users`)
*   **Current Feature**: Lists users.
*   **Alignment with Last Requirement**: 
    *   `TENANT_ADMIN` is currently allowed to access this path via middleware.
    *   **CRITICAL GAP**: The query logic must strictly enforce `where: { tenantId }` for Tenant Admins to prevent them from seeing users from other institutes.

### 2.3. Tenant Management (`/admin/tenants`)
*   **Current Feature**: CRUD operations for tenants.
*   **Alignment with Last Requirement**:
    *   `SUPER_ADMIN`/`ADMIN`: Full access.
    *   `TENANT_ADMIN`: Restricted via middleware (Correct).
*   **Gap**: This item is missing from the Sidebar entirely, making it hard for the Super Admin to navigate there.

### 2.4. Billing & Payments
*   **Current Feature**: View invoices and revenue.
*   **Alignment with Last Requirement**:
    *   `SUPER_ADMIN`: Needs to see "every single transaction" (Global).
    *   `TENANT_ADMIN`: Needs to monitor "his own tenant not others".
*   **Gap**: The `getAdminStats` query currently returns `totalRevenue: 0` for Tenant Admins. This needs to be implemented to aggregate revenue for their specific `tenantId`.

---

## 3. Implementation Gap Matrix

| Component | Gap Description | Priority |
| :--- | :--- | :--- |
| **Sidebar** | `TENANT_ADMIN` sees "Site Admin" instead of "Institute Admin". | Low |
| **Sidebar** | `SUPER_ADMIN` missing "Tenants" management link. | Medium |
| **Analytics Query** | `totalRevenue` for `TENANT_ADMIN` is hardcoded to 0. | **High** |
| **Middleware** | RBAC is solid, but needs more granular sub-route protection. | Medium |
| **Admin Dashboard UI** | Labels are not dynamic based on scope (System vs Institute). | Medium |
| **User Management** | Ensure filtering by `tenantId` is active on the server-side query. | **High** |

---

## 4. Proposed Fixes & Next Steps

1.  **Refine `getAdminStats`**: Implement revenue aggregation for specific tenants.
2.  **Dynamic Dashboard UI**: Pass a `scope` (System/Tenant) to the dashboard components to adjust labels.
3.  **Sidebar Enhancements**: 
    *   Add `Tenants` link for `SUPER_ADMIN`.
    *   Rename "Site Admin" to "Institute Home" for `TENANT_ADMIN`.
4.  **Query Hardening**: Audit all admin queries to ensure the `tenantId` from the session is always applied for non-platform admins.
