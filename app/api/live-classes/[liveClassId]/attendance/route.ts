import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ liveClassId: string }> }
) {
  try {
    const user = await requireAuth();
    const { liveClassId } = await params;

    const live = await prisma.liveClass.findUnique({
      where: { id: liveClassId },
      select: { id: true, courseId: true, course: { select: { tenantId: true } } },
    });

    if (!live || live.course.tenantId !== user.tenantId) {
      return NextResponse.json({ success: false, error: 'Live class not found' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: live.courseId } },
    });

    const staff =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ADMIN' ||
      (await prisma.course.findFirst({
        where: { id: live.courseId, instructorId: user.id },
        select: { id: true },
      })) != null;

    if (!enrollment && !staff) {
      return NextResponse.json({ success: false, error: 'Not allowed' }, { status: 403 });
    }

    const row = await prisma.liveClassAttendance.upsert({
      where: { liveClassId_userId: { liveClassId, userId: user.id } },
      create: {
        liveClassId,
        userId: user.id,
        joinedAt: new Date(),
        status: 'joined',
      },
      update: {
        joinedAt: new Date(),
        status: 'joined',
      },
    });

    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to record attendance' },
      { status: 400 }
    );
  }
}
