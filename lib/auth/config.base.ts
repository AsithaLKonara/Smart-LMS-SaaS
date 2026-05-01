
import type { NextAuthConfig } from 'next-auth';
import type { RoleType } from '@prisma/client';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';

const useSecureCookies = process.env.NODE_ENV === 'production';
const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
// Only set domain in production to avoid issues with localhost subdomains in some browsers
const cookieDomain = useSecureCookies ? `.${rootDomain}` : undefined;

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  cookies: {
    sessionToken: {
      name: useSecureCookies ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: cookieDomain,
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role as RoleType;
        token.tenantId = (user as any).tenantId;
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleType;
        session.user.tenantId = token.tenantId as string;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
