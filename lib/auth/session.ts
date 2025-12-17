import { auth } from '@/app/api/auth/[...nextauth]/auth';
import type { RoleType } from '@prisma/client';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  tenantId: string;
  avatar?: string;
}

/**
 * Get server session
 */
export async function getServerSession() {
  return auth();
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user as SessionUser;
}

/**
 * Get current tenant ID from session
 */
export async function getCurrentTenant(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.tenantId || null;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

