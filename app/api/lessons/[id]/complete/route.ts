import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { updateLessonProgress, updateEnrollmentProgress } from '@/lib/db/queries/enrollments';
import { prisma } from '@/lib/db/prisma';
import { canMarkLessonComplete } from '@/lib/db/queries/learning';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const body = await request.json();
    const { enrollmentId, lastPosition: lastPositionRaw } = body as {
      enrollmentId?: string;
      lastPosition?: number;
    };

    if (!enrollmentId) {
      return NextResponse.json({ success: false, error: 'Enrollment ID is required' }, { status: 400 });
    }

    const enrollmentCheck = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId: session.user.id,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollmentCheck) {
      return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 });
    }

    const lessonIds = enrollmentCheck.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (!lessonIds.includes(lessonId)) {
      return NextResponse.json({ success: false, error: 'Lesson not in course' }, { status: 400 });
    }

    const lastPosition = typeof lastPositionRaw === 'number' ? lastPositionRaw : undefined;
    const gate = await canMarkLessonComplete(lessonId, enrollmentId, {
      lastPosition,
    });

    if (!gate.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            gate.reason === 'prerequisites_incomplete'
              ? 'Complete prerequisite lessons first'
              : gate.reason === 'video_threshold_not_met'
                ? 'Watch more of the video to complete this lesson'
                : 'Cannot complete lesson yet',
          reason: gate.reason,
          missingLessonIds: gate.missingLessonIds,
        },
        { status: 409 }
      );
    }

    await updateLessonProgress(enrollmentId, lessonId, {
      completed: true,
      completedAt: new Date(),
      ...(lastPosition !== undefined ? { lastPosition } : {}),
    });

    const totalLessons = enrollmentCheck.course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId,
        completed: true,
      },
    });

    const newProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    await updateEnrollmentProgress(enrollmentId, newProgress, newProgress === 100 ? new Date() : undefined);

    return NextResponse.json({
      success: true,
      progress: newProgress,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete lesson',
      },
      { status: 500 }
    );
  }
}
