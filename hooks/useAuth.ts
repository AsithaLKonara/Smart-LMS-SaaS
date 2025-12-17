'use client';

import { useSession } from 'next-auth/react';
import type { RoleType } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  tenantId: string;
  avatar?: string;
}

/**
 * Custom hook for authentication state
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
        role: session.user.role,
        tenantId: session.user.tenantId,
        avatar: session.user.avatar,
      }
    : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!user,
    status,
  };
}

