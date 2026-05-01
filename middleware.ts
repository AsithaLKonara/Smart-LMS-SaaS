import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Apply rate limiting to API routes
  if (path.startsWith('/api') && !path.startsWith('/api/auth')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const identifier = (await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    }))?.email || ip;
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

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });



  // Public routes - allow access
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/partners'];
  if (publicRoutes.includes(path) || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  const role = token.role as string;

  // Super admin can access everything
  if (role === 'SUPER_ADMIN') {
    return NextResponse.next();
  }

  const isAdminLike = role === 'ADMIN' || role === 'TENANT_ADMIN' || role === 'SUPER_ADMIN';
  const isInstructorLike = role === 'INSTRUCTOR' || isAdminLike;

  // Tenant-admin pages
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
  if (path.startsWith('/api/messaging') && !token.sub) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};

