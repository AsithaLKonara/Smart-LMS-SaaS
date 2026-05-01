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
  let user;
  try {
    user = await getDbUser(email, tenantId);
  } catch (error) {
    console.error('Database connection error during authentication:', error);
    throw new Error('DATABASE_CONNECTION_ERROR');
  }

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!user.password) {
    throw new Error('AUTH_METHOD_NOT_SUPPORTED');
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS');
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

