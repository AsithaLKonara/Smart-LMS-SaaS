import { prisma } from '../prisma';
import type { RoleType } from '@prisma/client';

/**
 * Get user by email (tenant-aware)
 */
export async function getUserByEmail(email: string, tenantId?: string) {
  return prisma.user.findFirst({
    where: {
      email,
      ...(tenantId && { tenantId }),
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
          accentColor: true,
        },
      },
    },
  });
}

/**
 * Get user by ID (tenant-aware)
 */
export async function getUserById(userId: string, tenantId?: string) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      ...(tenantId && { tenantId }),
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          subdomain: true,
        },
      },
    },
  });
}

/**
 * Get all users for a tenant
 */
export async function getUsersByTenant(tenantId: string, role?: RoleType) {
  return prisma.user.findMany({
    where: {
      tenantId,
      ...(role && { role }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Create a new user
 */
export async function createUser(data: {
  tenantId: string;
  email: string;
  name: string;
  password: string;
  role?: RoleType;
  avatar?: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      role: data.role || 'STUDENT',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      tenantId: true,
      createdAt: true,
    },
  });
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  tenantId: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: RoleType;
    emailVerified: Date;
  }>
) {
  return prisma.user.updateMany({
    where: {
      id: userId,
      tenantId,
    },
    data,
  });
}

