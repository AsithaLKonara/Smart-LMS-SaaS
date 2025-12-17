/**
 * Authentication related types
 */

import type { RoleType } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: RoleType;
      tenantId: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: RoleType;
    tenantId: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: RoleType;
    tenantId: string;
    avatar?: string;
  }
}

export type { RoleType };

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  tenantId: string;
  role?: RoleType;
}
