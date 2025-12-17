'use client';

import { useAuth } from '@/hooks/useAuth';
import type { RoleType } from '@prisma/client';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleType[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
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

  // Super admin has access to everything
  if (user.role === 'SUPER_ADMIN') {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

