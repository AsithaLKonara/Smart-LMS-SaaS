'use server';

import { createUser } from './user';

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name: string,
  tenantId: string
) {
  try {
    const user = await createUser(email, password, name, tenantId, 'STUDENT');
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

/**
 * Get the correct redirect URL based on user role
 */
export async function getPostLoginRedirect(email: string, tenantId?: string) {
  const { getUserByEmail } = await import('@/lib/db/queries/users');
  const user = await getUserByEmail(email, tenantId);
  
  if (!user) return '/dashboard';

  switch (user.role) {
    case 'SUPER_ADMIN':
      return '/admin/tenants';
    case 'ADMIN':
    case 'TENANT_ADMIN':
      return '/admin/dashboard';
    case 'INSTRUCTOR':
      return '/instructor/dashboard';
    default:
      return '/dashboard';
  }
}
