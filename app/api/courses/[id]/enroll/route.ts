import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getCourseById } from '@/lib/db/queries/courses';
import { getEnrollment, createEnrollment } from '@/lib/db/queries/enrollments';
import { assertTenantOperational } from '@/lib/billing/seats';

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

    const { id: courseId } = await params;
    const userId = session.user.id;
    const tenantId = session.user.tenantId;

    // Verify course exists and is published
    const course = await getCourseById(courseId, tenantId);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'Course is not available for enrollment' },
        { status: 400 }
      );
    }

    const op = await assertTenantOperational(tenantId);
    if (!op.ok) {
      return NextResponse.json({ success: false, error: op.message }, { status: 403 });
    }

    // Check if already enrolled
    const existingEnrollment = await getEnrollment(userId, courseId);

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await createEnrollment(userId, courseId);

    return NextResponse.json(
      {
        success: true,
        enrollment: {
          id: enrollment.id,
          courseId: enrollment.courseId,
          progress: enrollment.progress,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enroll',
      },
      { status: 500 }
    );
  }
}

