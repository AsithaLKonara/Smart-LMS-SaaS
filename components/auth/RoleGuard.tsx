'use client';

import { useAuth } from '@/hooks/useAuth';
import type { RoleType } from '@prisma/client';

import { Permission } from '@/constants/permissions';
import { hasPermission, AuthUser } from '@/lib/auth/guard';

interface RoleGuardProps {
  children: React.ReactNode;
  permissions?: Permission[];
  allowedRoles?: RoleType[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  permissions,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <>{fallback}</>;
  }

  const authUser = user as AuthUser;

  // Super admin has access to everything
  if (authUser.role === 'SUPER_ADMIN') {
    return <>{children}</>;
  }

  // Check Permissions if provided
  if (permissions && permissions.length > 0) {
    const hasAll = permissions.every(p => hasPermission(authUser, p));
    if (!hasAll) return <>{fallback}</>;
  }

  // Check Roles if provided
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(authUser.role as RoleType)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

