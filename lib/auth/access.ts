import { RoleType } from '@prisma/client';
import { requireAuth } from './session';

export async function requireRole(allowedRoles: RoleType[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export function canManageTenant(role: RoleType) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function canManageLearning(role: RoleType) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'INSTRUCTOR';
}
