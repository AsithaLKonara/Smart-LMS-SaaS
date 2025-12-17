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

