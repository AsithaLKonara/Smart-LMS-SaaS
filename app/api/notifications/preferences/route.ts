import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { NotificationType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

const patchSchema = z.object({
  type: z.nativeEnum(NotificationType),
  channel: z.enum(['IN_APP', 'EMAIL']),
  enabled: z.boolean(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const data = await prisma.notificationPreference.findMany({
      where: { userId: user.id },
      orderBy: [{ type: 'asc' }, { channel: 'asc' }],
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to load preferences' },
      { status: 401 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = patchSchema.parse(await request.json());
    const pref = await prisma.notificationPreference.upsert({
      where: {
        userId_type_channel: {
          userId: user.id,
          type: body.type,
          channel: body.channel,
        },
      },
      create: {
        userId: user.id,
        type: body.type,
        channel: body.channel,
        enabled: body.enabled,
      },
      update: { enabled: body.enabled },
    });
    return NextResponse.json({ success: true, data: pref });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to update preference' },
      { status: 400 }
    );
  }
}
