/**
 * Tenant related types
 */

export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  accentColor?: string;
  plan: Plan;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

