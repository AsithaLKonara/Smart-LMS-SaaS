import { getUserByEmail as getDbUser, createUser as createDbUser } from '@/lib/db/queries/users';
import { hashPassword, verifyPassword } from './password';
import type { RoleType } from '@prisma/client';

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string,
  tenantId?: string
) {
  const user = await getDbUser(email, tenantId);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: RoleType = 'STUDENT'
) {
  const hashedPassword = await hashPassword(password);

  return createDbUser({
    tenantId,
    email,
    name,
    password: hashedPassword,
    role,
  });
}

/**
 * Get user by email (re-export from queries)
 */
export { getDbUser as getUserByEmail };

