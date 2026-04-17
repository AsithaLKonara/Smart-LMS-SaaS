import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { canMarkLessonComplete } from '@/lib/db/queries/learning';
import { updateLessonProgress, updateEnrollmentProgress } from '@/lib/db/queries/enrollments';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { enrollmentId, lessonId, increment = 30, lastPosition: lastPositionRaw } = await req.json();

    if (!enrollmentId || !lessonId) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId },
      include: {
        course: {
          include: {
            modules: { include: { lessons: true } },
          },
        },
      },
    });

    if (!enrollment) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const lessonIds = enrollment.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (!lessonIds.includes(lessonId)) {
      return new NextResponse('Invalid lesson', { status: 400 });
    }

    const lastPosition = typeof lastPositionRaw === 'number' ? lastPositionRaw : undefined;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      create: {
        enrollmentId,
        lessonId,
        timeSpent: increment,
        ...(lastPosition !== undefined ? { lastPosition } : {}),
      },
      update: {
        timeSpent: { increment },
        ...(lastPosition !== undefined ? { lastPosition } : {}),
      },
    });

    const gate = await canMarkLessonComplete(lessonId, enrollmentId, {
      lastPosition: lastPosition ?? progress.lastPosition,
    });

    if (gate.ok) {
      const lessonRow = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { completionMode: true },
      });
      if (lessonRow?.completionMode === 'VIDEO_THRESHOLD') {
        await updateLessonProgress(enrollmentId, lessonId, {
          completed: true,
          completedAt: new Date(),
        });

        const totalLessons = enrollment.course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        const completedLessons = await prisma.lessonProgress.count({
          where: { enrollmentId, completed: true },
        });
        const newProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        await updateEnrollmentProgress(enrollmentId, newProgress, newProgress === 100 ? new Date() : undefined);
      }
    }

    return NextResponse.json({ timeSpent: progress.timeSpent, lastPosition: progress.lastPosition });
  } catch (error) {
    console.error('[HEARTBEAT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
