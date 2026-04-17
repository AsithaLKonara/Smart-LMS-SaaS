import { NextResponse } from 'next/server';
import { getCurrentUser } from './session';
import { hasPermission, type User as PermUser } from './permissions';
import type { Permission } from '@/constants/permissions';

export type AuthedUser = PermUser;

/**
 * Returns user if permission granted, otherwise a NextResponse error.
 */
export async function guardPermission(
  permission: Permission
): Promise<{ ok: true; user: AuthedUser } | { ok: false; response: NextResponse }> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    };
  }
  const user: AuthedUser = {
    id: sessionUser.id,
    role: sessionUser.role,
    tenantId: sessionUser.tenantId,
  };
  if (!hasPermission(user, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }),
    };
  }
  return { ok: true, user };
}
