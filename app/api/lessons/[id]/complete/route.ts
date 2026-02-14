import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { updateLessonProgress, updateEnrollmentProgress } from '@/lib/db/queries/enrollments';
import { getEnrollment } from '@/lib/db/queries/enrollments';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: lessonId } = await params;
    const body = await request.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    // Verify enrollment belongs to user
    const enrollment = await getEnrollment(session.user.id, ''); // We need to get by enrollmentId
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
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Mark lesson as complete
    await updateLessonProgress(enrollmentId, lessonId, {
      completed: true,
      completedAt: new Date(),
    });

    // Calculate new course progress
    const totalLessons = enrollmentCheck.course.modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId,
        completed: true,
      },
    });

    const newProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment progress
    await updateEnrollmentProgress(
      enrollmentId,
      newProgress,
      newProgress === 100 ? new Date() : undefined
    );

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

