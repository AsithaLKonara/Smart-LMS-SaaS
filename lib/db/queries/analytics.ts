import { prisma } from '../prisma';

/**
 * Get course analytics for a tenant
 */
export async function getCourseAnalytics(tenantId: string) {
  const [totalCourses, publishedCourses, totalEnrollments, avgCompletionRate] =
    await Promise.all([
      prisma.course.count({
        where: { tenantId },
      }),
      prisma.course.count({
        where: {
          tenantId,
          status: 'PUBLISHED',
        },
      }),
      prisma.enrollment.count({
        where: {
          course: {
            tenantId,
          },
        },
      }),
      prisma.enrollment.aggregate({
        where: {
          course: {
            tenantId,
          },
        },
        _avg: {
          progress: true,
        },
      }),
    ]);

  return {
    totalCourses,
    publishedCourses,
    totalEnrollments,
    avgCompletionRate: avgCompletionRate._avg.progress || 0,
  };
}

/**
 * Get user analytics for a tenant
 */
export async function getUserAnalytics(tenantId: string) {
  const [totalUsers, students, instructors, activeUsers] = await Promise.all([
    prisma.user.count({
      where: { tenantId },
    }),
    prisma.user.count({
      where: {
        tenantId,
        role: 'STUDENT',
      },
    }),
    prisma.user.count({
      where: {
        tenantId,
        role: 'INSTRUCTOR',
      },
    }),
    prisma.user.count({
      where: {
        tenantId,
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ]);

  return {
    totalUsers,
    students,
    instructors,
    activeUsers,
  };
}

/**
 * Get student progress analytics
 */
export async function getStudentProgress(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      lessonProgress: {
        where: {
          completed: true,
        },
      },
    },
  });

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const avgProgress =
    enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses || 0;

  return {
    totalCourses,
    completedCourses,
    inProgressCourses: totalCourses - completedCourses,
    avgProgress,
    enrollments,
  };
}

