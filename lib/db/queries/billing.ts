import { prisma } from '../prisma';
import { Plan } from '@prisma/client';

export async function getBillingSnapshot(tenantId: string) {
  const [profile, invoices, usage] = await Promise.all([
    prisma.billingProfile.findUnique({ where: { tenantId } }),
    prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { issuedAt: 'desc' },
      take: 12,
    }),
    prisma.usageMetric.findMany({
      where: { tenantId },
      orderBy: { periodStart: 'desc' },
      take: 20,
    }),
  ]);

  return { profile, invoices, usage };
}

export async function upsertBillingProfile(data: {
  tenantId: string;
  billingEmail: string;
  currentPlan?: Plan;
  seatLimit?: number;
}) {
  return prisma.billingProfile.upsert({
    where: { tenantId: data.tenantId },
    create: {
      tenantId: data.tenantId,
      billingEmail: data.billingEmail,
      currentPlan: data.currentPlan,
      seatLimit: data.seatLimit ?? 10,
    },
    update: {
      billingEmail: data.billingEmail,
      ...(data.currentPlan ? { currentPlan: data.currentPlan } : {}),
      ...(typeof data.seatLimit === 'number' ? { seatLimit: data.seatLimit } : {}),
    },
  });
}

export async function recordUsageMetric(data: {
  tenantId: string;
  metricKey: string;
  metricValue: number;
  periodStart: Date;
  periodEnd: Date;
}) {
  return prisma.usageMetric.create({
    data,
  });
}
