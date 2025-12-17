import { prisma } from '../prisma';

/**
 * Get enrollment by user and course
 */
export async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      lessonProgress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get all enrollments for a user
 */
export async function getEnrollmentsByUser(userId: string) {
  return prisma.enrollment.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              modules: true,
            },
          },
        },
      },
    },
    orderBy: {
      enrolledAt: 'desc',
    },
  });
}

/**
 * Create enrollment
 */
export async function createEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
    include: {
      course: true,
    },
  });
}

/**
 * Update enrollment progress
 */
export async function updateEnrollmentProgress(
  enrollmentId: string,
  progress: number,
  completedAt?: Date
) {
  return prisma.enrollment.update({
    where: {
      id: enrollmentId,
    },
    data: {
      progress,
      ...(completedAt && { completedAt }),
    },
  });
}

/**
 * Get lesson progress
 */
export async function getLessonProgress(enrollmentId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
  });
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(
  enrollmentId: string,
  lessonId: string,
  data: {
    completed?: boolean;
    lastPosition?: number;
    completedAt?: Date;
  }
) {
  return prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
    update: data,
    create: {
      enrollmentId,
      lessonId,
      ...data,
    },
  });
}

