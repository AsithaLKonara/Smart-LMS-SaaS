import { ROLE_PERMISSIONS, PERMISSIONS } from '@/constants/permissions';
import type { Permission } from '@/constants/permissions';
import type { RoleType } from '@prisma/client';

export type { Permission };

export interface User {
  id: string;
  role: RoleType;
  tenantId: string;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User, role: RoleType): boolean {
  return user.role === role;
}

/**
 * Check if user can access a resource with an action
 */
export function canAccess(
  user: User,
  resource: string,
  action: string
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(user, permission);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User): boolean {
  return user.role === 'SUPER_ADMIN';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User): boolean {
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
}

/**
 * Check if user is instructor
 */
export function isInstructor(user: User): boolean {
  return user.role === 'INSTRUCTOR' || isAdmin(user);
}

/**
 * Check if user is student
 */
export function isStudent(user: User): boolean {
  return user.role === 'STUDENT';
}

