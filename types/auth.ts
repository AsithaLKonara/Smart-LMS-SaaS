/**
 * Authentication related types
 */

export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  tenantId: string;
  avatar?: string;
}

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

