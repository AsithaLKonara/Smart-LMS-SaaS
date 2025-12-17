import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // Public routes - allow access
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
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

  // Admin routes
  if (path.startsWith('/admin')) {
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Instructor routes
  if (path.startsWith('/instructor')) {
    if (
      role !== 'INSTRUCTOR' &&
      role !== 'ADMIN' &&
      role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

