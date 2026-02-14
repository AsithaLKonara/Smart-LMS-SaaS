import { prisma } from '../prisma';
import { startOfDay, subDays, format } from "date-fns";
import { unstable_cache } from "next/cache";

/**
 * Get course analytics for a tenant
 */
export const getCourseAnalytics = unstable_cache(
  async (tenantId: string) => {
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
  },
  ['course-analytics'],
  { revalidate: 3600, tags: ['analytics'] }
);

/**
 * Get user analytics for a tenant
 */
export const getUserAnalytics = unstable_cache(
  async (tenantId: string) => {
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
  },
  ['user-analytics'],
  { revalidate: 3600, tags: ['analytics'] }
);

/**
 * Get student progress analytics
 * (Not cached heavily as it's user specific and real-time is preferred)
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

/**
 * Get instructor dashboard stats
 */
export const getInstructorStats = unstable_cache(
  async (instructorId: string) => {
    // Optimize: Select only necessary fields
    const courses = await prisma.course.findMany({
      where: {
        instructorId,
      },
      select: {
        price: true,
        enrollments: {
          select: { userId: true }
        }
      }
    });

    const totalCourses = courses.length;

    const totalStudents = new Set(
      courses.flatMap((course) => course.enrollments.map((e) => e.userId))
    ).size;

    const totalRevenue = courses.reduce((acc, course) => {
      return acc + (course.price || 0) * course.enrollments.length;
    }, 0);

    // Approximate Rating (placeholder)
    const averageRating = 4.8;

    return {
      totalRevenue,
      totalStudents,
      totalCourses,
      averageRating,
    };
  },
  ['instructor-stats'],
  { revalidate: 600, tags: ['analytics'] } // 10 mins cache for instructors
);

/**
 * Get daily enrollments/revenue for charts
 */
export const getInstructorChartData = unstable_cache(
  async (instructorId: string) => {
    const days = 7;
    const startDate = startOfDay(subDays(new Date(), days - 1));

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId,
        },
        enrolledAt: {
          gte: startDate,
        },
      },
      include: {
        course: {
          select: {
            price: true
          }
        }
      },
      orderBy: {
        enrolledAt: "asc",
      },
    });

    const grouped = new Map<string, { enrollments: number; revenue: number }>();

    for (let i = 0; i < days; i++) {
      const day = format(subDays(new Date(), days - 1 - i), "MMM dd");
      grouped.set(day, { enrollments: 0, revenue: 0 });
    }

    enrollments.forEach((enrollment) => {
      const day = format(enrollment.enrolledAt, "MMM dd");
      const current = grouped.get(day) || { enrollments: 0, revenue: 0 };
      grouped.set(day, {
        enrollments: current.enrollments + 1,
        revenue: current.revenue + (enrollment.course.price || 0)
      });
    });

    return Array.from(grouped.entries()).map(([date, data]) => ({
      name: date,
      enrollments: data.enrollments,
      revenue: data.revenue
    }));
  },
  ['instructor-chart'],
  { revalidate: 3600, tags: ['analytics'] }
);

/**
 * Get system-wide admin stats
 */
export const getAdminStats = unstable_cache(
  async () => {
    const [totalTenants, totalUsers, totalCourses, totalEnrollments] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
    ]);

    // Optimized revenue calculation: fetches only price
    const enrollments = await prisma.enrollment.findMany({
      select: {
        course: {
          select: {
            price: true
          }
        }
      }
    });

    const totalRevenue = enrollments.reduce((acc, enr) => acc + (enr.course.price || 0), 0);

    return {
      totalTenants,
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue
    };
  },
  ['admin-stats'],
  { revalidate: 3600, tags: ['admin-stats'] }
);

