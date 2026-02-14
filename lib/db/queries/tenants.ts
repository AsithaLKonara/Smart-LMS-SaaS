import { prisma } from '../prisma';
import type { Plan, Status } from '@prisma/client';

/**
 * Get tenant by subdomain
 */
export async function getTenantBySubdomain(subdomain: string) {
  return prisma.tenant.findUnique({
    where: { subdomain },
    include: {
      _count: {
        select: {
          users: true,
          courses: true,
        },
      },
    },
  });
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string) {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: {
          users: true,
          courses: true,
        },
      },
    },
  });
}

/**
 * Check if subdomain is available
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
    select: { id: true },
  });
  return !tenant;
}

/**
 * Create a new tenant
 */
export async function createTenant(data: {
  name: string;
  subdomain: string;
  logo?: string;
  accentColor?: string;
  plan?: Plan;
  status?: Status;
}) {
  return prisma.tenant.create({
    data: {
      name: data.name,
      subdomain: data.subdomain.toLowerCase(),
      logo: data.logo,
      accentColor: data.accentColor || '#22D3EE',
      plan: data.plan || 'FREE',
      status: data.status || 'ACTIVE',
    },
  });
}

/**
 * Update tenant
 */
export async function updateTenant(
  tenantId: string,
  data: Partial<{
    name: string;
    subdomain: string;
    logo: string;
    accentColor: string;
    plan: Plan;
    status: Status;
  }>
) {
  return prisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...data,
      ...(data.subdomain && { subdomain: data.subdomain.toLowerCase() }),
    },
  });
}

/**
 * Get all tenants (for super admin)
 */
export async function getAllTenants() {
  return prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          courses: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

