'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { RoleType } from '@prisma/client';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: RoleType;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    } else if (
      !isLoading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole &&
      user?.role !== 'SUPER_ADMIN'
    ) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-cyan border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (
    requiredRole &&
    user?.role !== requiredRole &&
    user?.role !== 'SUPER_ADMIN'
  ) {
    return null;
  }

  return <>{children}</>;
}

