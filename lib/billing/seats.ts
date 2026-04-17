import { prisma } from '@/lib/db/prisma';

/**
 * Block new learning activity when subscription is canceled or past grace.
 */
export async function assertTenantOperational(
  tenantId: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const profile = await prisma.billingProfile.findUnique({
    where: { tenantId },
    select: { subscriptionStatus: true, graceEndsAt: true },
  });
  const status = profile?.subscriptionStatus ?? 'active';
  if (status === 'canceled') {
    return { ok: false, message: 'Organization subscription is canceled' };
  }
  if (status === 'past_due' && profile?.graceEndsAt && profile.graceEndsAt < new Date()) {
    return { ok: false, message: 'Organization billing grace period has ended' };
  }
  return { ok: true };
}

/**
 * Count active users in tenant vs BillingProfile.seatLimit.
 */
export async function assertSeatAvailable(tenantId: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const profile = await prisma.billingProfile.findUnique({
    where: { tenantId },
    select: { seatLimit: true, subscriptionStatus: true, graceEndsAt: true },
  });
  const limit = profile?.seatLimit ?? 10;
  const status = profile?.subscriptionStatus ?? 'active';

  if (status === 'canceled') {
    return { ok: false, message: 'Tenant subscription canceled' };
  }
  if (status === 'past_due' && profile?.graceEndsAt && profile.graceEndsAt < new Date()) {
    return { ok: false, message: 'Billing grace period expired' };
  }

  const count = await prisma.user.count({ where: { tenantId } });
  if (count >= limit) {
    return { ok: false, message: 'Seat limit reached for this organization' };
  }
  return { ok: true };
}
