import { NextRequest, NextResponse } from 'next/server';
import { NotificationType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const typeParam = request.nextUrl.searchParams.get('type');
    const onlyUnread = request.nextUrl.searchParams.get('unread') === 'true';
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(onlyUnread ? { read: false } : {}),
        ...(typeParam && typeParam in NotificationType
          ? { type: typeParam as NotificationType }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to load notifications' },
      { status: 401 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await request.json()) as { ids?: string[]; markAll?: boolean };
    if (body.markAll) {
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    const ids = body.ids ?? [];
    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: 'ids required' }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: { userId: user.id, id: { in: ids } },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to update notifications' },
      { status: 400 }
    );
  }
}
