import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionContext } from '@/lib/auth/utils';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ liveClassId: string }> }
) {
  try {
    const { userId, tenantId, role } = await getSessionContext();
    const { liveClassId } = await params;

    const live = await prisma.liveClass.findFirst({
      where: { 
        id: liveClassId,
        course: { tenantId }
      },
      select: { id: true, courseId: true },
    });

    if (!live) {
      return NextResponse.json({ success: false, error: 'Live class not found' }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: live.courseId } },
    });

    const staff =
      role === 'SUPER_ADMIN' ||
      role === 'ADMIN' ||
      (await prisma.course.findFirst({
        where: { id: live.courseId, instructorId: userId, tenantId },
        select: { id: true },
      })) != null;

    if (!enrollment && !staff) {
      return NextResponse.json({ success: false, error: 'Not allowed' }, { status: 403 });
    }

    const row = await prisma.liveClassAttendance.upsert({
      where: { liveClassId_userId: { liveClassId, userId } },
      create: {
        liveClassId,
        userId,
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
