import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config.base';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const path = request.nextUrl.pathname;
  const session = request.auth;
  const token = session?.user;

  console.log(`Middleware Path: ${path}, Session present: ${!!session}, User: ${token?.email || 'none'}`);

  // Apply rate limiting to API routes
  if (path.startsWith('/api') && !path.startsWith('/api/auth')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const identifier = token?.email || ip;
    const result = await rateLimit(identifier, 100); // 100 requests per minute

    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
        }
      });
    }
  }

  // Public routes - allow access
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/partners', '/saaslanding'];
  if (publicRoutes.includes(path) || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const role = token?.role as string;

  // Super admin can access everything
  if (role === 'SUPER_ADMIN') {
    return NextResponse.next();
  }

  const isPlatformAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';
  const isTenantAdmin = role === 'TENANT_ADMIN';
  const isAdminLike = isPlatformAdmin || isTenantAdmin;
  const isInstructorLike = role === 'INSTRUCTOR' || isAdminLike;

  // Platform Admin only pages
  if (path.startsWith('/admin/tenants')) {
    if (!isPlatformAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Tenant-admin and Platform-admin pages
  if (
    path.startsWith('/admin') ||
    path.startsWith('/billing') ||
    path.startsWith('/security') ||
    path.startsWith('/analytics') ||
    path.startsWith('/settings')
  ) {
    if (!isAdminLike) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Instructor routes
  if (
    path.startsWith('/instructor') ||
    path.startsWith('/assets') ||
    path.startsWith('/gradebook') ||
    path.startsWith('/cohorts')
  ) {
    if (!isInstructorLike) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // API route restrictions by path group
  if (path.startsWith('/api/billing') && !isAdminLike) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  if (path.startsWith('/api/assets') && !isInstructorLike && role !== 'STUDENT') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};

