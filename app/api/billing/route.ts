import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Plan } from '@prisma/client';
import { guardPermission } from '@/lib/auth/api-permission';
import { PERMISSIONS } from '@/constants/permissions';
import { getBillingSnapshot, upsertBillingProfile } from '@/lib/db/queries/billing';
import { appLog } from '@/lib/observability/logger';

const profileSchema = z.object({
  billingEmail: z.string().email(),
  currentPlan: z.nativeEnum(Plan).optional(),
  seatLimit: z.number().int().positive().optional(),
});

export async function GET() {
  const g = await guardPermission(PERMISSIONS.BILLING_VIEW);
  if (!g.ok) return g.response;

  try {
    const snapshot = await getBillingSnapshot(g.user.tenantId);
    appLog('info', { message: 'billing_snapshot_loaded', context: { tenantId: g.user.tenantId, userId: g.user.id } });
    return NextResponse.json({ success: true, data: snapshot });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to load billing' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  const g = await guardPermission(PERMISSIONS.BILLING_MANAGE);
  if (!g.ok) return g.response;

  try {
    const payload = profileSchema.parse(await request.json());
    const profile = await upsertBillingProfile({
      tenantId: g.user.tenantId,
      ...payload,
    });
    appLog('info', { message: 'billing_profile_updated', context: { tenantId: g.user.tenantId, userId: g.user.id } });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to update billing profile' },
      { status: 400 }
    );
  }
}
