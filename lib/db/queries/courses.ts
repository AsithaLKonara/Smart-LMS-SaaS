import { prisma } from '../prisma';
import type { Course, CourseStatus } from '@prisma/client';

/**
 * Get all courses for a tenant
 */
export async function getCoursesByTenant(tenantId: string, status?: CourseStatus) {
  return prisma.course.findMany({
    where: {
      tenantId,
      ...(status && { status }),
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          modules: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a single course by ID (tenant-aware)
 */
export async function getCourseById(courseId: string, tenantId: string) {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      tenantId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });
}

/**
 * Create a new course
 */
export async function createCourse(data: {
  tenantId: string;
  instructorId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status?: CourseStatus;
}) {
  return prisma.course.create({
    data,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Update a course
 */
export async function updateCourse(
  courseId: string,
  tenantId: string,
  data: Partial<Pick<Course, 'title' | 'description' | 'thumbnail' | 'status'>>
) {
  return prisma.course.updateMany({
    where: {
      id: courseId,
      tenantId,
    },
    data,
  });
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string, tenantId: string) {
  return prisma.course.deleteMany({
    where: {
      id: courseId,
      tenantId,
    },
  });
}

