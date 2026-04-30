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

export const PLAN_LIMITS = {
    FREE: { courses: 3, students: 50 },
    PRO: { courses: 50, students: 500 }, // Adjust as needed
    ENTERPRISE: { courses: 999999, students: 999999 },
};

/**
 * Count active users in tenant vs BillingProfile.seatLimit or Plan limits.
 */
export async function assertSeatAvailable(tenantId: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true }
  });
  
  const profile = await prisma.billingProfile.findUnique({
    where: { tenantId },
    select: { seatLimit: true, subscriptionStatus: true, graceEndsAt: true },
  });

  const plan = tenant?.plan || 'FREE';
  const planLimit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].students;
  const profileLimit = profile?.seatLimit || 10;
  
  const limit = Math.max(planLimit, profileLimit);
  
  const status = profile?.subscriptionStatus ?? 'active';

  if (status === 'canceled') {
    return { ok: false, message: 'Tenant subscription canceled' };
  }
  if (status === 'past_due' && profile?.graceEndsAt && profile.graceEndsAt < new Date()) {
    return { ok: false, message: 'Billing grace period expired' };
  }

  const count = await prisma.user.count({ where: { tenantId, role: 'STUDENT' } });
  if (count >= limit) {
    return { ok: false, message: `Student seat limit reached (${limit}). Please upgrade your plan.` };
  }
  return { ok: true };
}

/**
 * Check if tenant can create more courses.
 */
export async function assertCourseLimit(tenantId: string): Promise<{ ok: true } | { ok: false; message: string }> {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true }
    });

    const plan = tenant?.plan || 'FREE';
    const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].courses;

    const count = await prisma.course.count({ where: { tenantId } });
    if (count >= limit) {
        return { ok: false, message: `Course limit reached for ${plan} plan (${limit}). Please upgrade.` };
    }
    return { ok: true };
}
