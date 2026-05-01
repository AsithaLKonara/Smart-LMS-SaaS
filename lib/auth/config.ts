import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authenticateUser } from './user';
import type { RoleType } from '@prisma/client';

class SignInError extends CredentialsSignin {
  constructor(message: string, code?: string) {
    super();
    this.code = code || message;
    this.message = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantId: { label: 'Tenant ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const tenantId = (credentials.tenantId as string) === 'undefined' || (credentials.tenantId as string) === '' 
          ? undefined 
          : credentials.tenantId as string;

        try {
          const user = await authenticateUser(
            credentials.email as string,
            credentials.password as string,
            tenantId
          );

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            avatar: user.avatar || undefined,
          };
        } catch (error: any) {
          // Re-throw specific errors to be caught in the login form
          if (error.message === 'DATABASE_CONNECTION_ERROR') {
            throw new SignInError('Database connection failed. Please check your configuration.', 'db_connection_error');
          }
          if (error.message === 'INVALID_CREDENTIALS') {
            throw new SignInError('Invalid email or password.', 'invalid_credentials');
          }
          if (error.message === 'AUTH_METHOD_NOT_SUPPORTED') {
            throw new SignInError('This account uses a different sign-in method.', 'auth_method_not_supported');
          }
          
          // Default error
          throw new SignInError('An unexpected error occurred during authentication.', 'unknown_error');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: RoleType }).role;
        token.tenantId = (user as { tenantId: string }).tenantId;
        token.avatar = (user as { avatar?: string }).avatar;
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
  secret: process.env.NEXTAUTH_SECRET,
});

