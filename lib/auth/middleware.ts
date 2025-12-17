import { requireAuth, getCurrentUser } from './session';
import { hasPermission, hasRole, type Permission } from './permissions';
import type { RoleType } from '@prisma/client';

/**
 * Require authentication in API route
 * Throws error if not authenticated
 */
export async function requireAuthMiddleware() {
  return requireAuth();
}

/**
 * Require specific role in API route
 * Throws error if user doesn't have the role
 */
export async function requireRole(role: RoleType) {
  const user = await requireAuth();

  if (user.role !== role && user.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: Insufficient role');
  }

  return user;
}

/**
 * Require specific permission in API route
 * Throws error if user doesn't have the permission
 */
export async function requirePermission(permission: Permission) {
  const user = await requireAuth();

  if (!hasPermission(user, permission)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return user;
}

/**
 * Check if user has permission (non-throwing)
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    return hasPermission(user, permission);
  } catch {
    return false;
  }
}

