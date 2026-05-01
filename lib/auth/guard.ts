import { Permission, ROLE_PERMISSIONS, PERMISSIONS } from "@/constants/permissions";

/**
 * Basic user type for authorization
 */
export type AuthUser = {
    id: string;
    role: string;
    tenantId: string;
};

/**
 * Checks if a role has a specific permission (baseline check)
 */
export function hasPermission(user: AuthUser, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
}

/**
 * The core Policy Engine for SmartLMS.
 * Handles both RBAC (roles) and Resource Scoping (ownership, tenancy).
 * 
 * @param user The authenticated user
 * @param action The permission being checked
 * @param resource The object being acted upon (optional)
 */
export function can(user: AuthUser, action: Permission, resource?: any): boolean {
    // 1. Baseline Permission Check (Does the role even allow this?)
    if (!hasPermission(user, action)) return false;

    // 2. Platform-Level Bypass
    // SUPER_ADMIN and platform-wide ADMINs bypass resource scoping
    const isPlatformAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    if (isPlatformAdmin) return true;

    // 3. Resource-Specific Scoping
    if (resource) {
        // --- Tenancy Constraint ---
        // Most roles (Tenant Admin, Instructor, Student) are locked to their tenant
        if (resource.tenantId && resource.tenantId !== user.tenantId) {
            return false;
        }

        // --- Ownership & Contextual Constraints ---
        switch (action) {
            // Course Ownership
            case PERMISSIONS.COURSE_EDIT:
            case PERMISSIONS.COURSE_DELETE:
            case PERMISSIONS.COURSE_PUBLISH:
                if (user.role === 'INSTRUCTOR') {
                    // Instructors only manage their own courses
                    return resource.instructorId === user.id;
                }
                break;

            // User Management Boundaries
            case PERMISSIONS.USER_UPDATE:
            case PERMISSIONS.USER_DELETE:
            case PERMISSIONS.USER_ROLE_ASSIGN:
                // Cannot manage Super Admins or Admins if you are just a Tenant Admin
                if (resource.role === 'SUPER_ADMIN' || resource.role === 'ADMIN') {
                    return false;
                }
                // Tenant Admins manage others in their tenant (handled by Tenancy check)
                break;

            // Self-Service Boundaries
            case PERMISSIONS.PROFILE_UPDATE:
                return resource.id === user.id;

            // Asset Ownership
            case PERMISSIONS.ASSET_DELETE:
                if (user.role === 'INSTRUCTOR') {
                    return resource.uploadedById === user.id;
                }
                break;

            default:
                // For other permissions, the baseline role check + tenancy is sufficient
                return true;
        }
    }

    return true;
}
