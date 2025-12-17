import { prisma } from '../prisma';
import type { Prisma } from '@prisma/client';

/**
 * Get exams for a course
 */
export async function getExamsByCourse(courseId: string) {
  return prisma.exam.findMany({
    where: {
      courseId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get exam by ID
 */
export async function getExamById(examId: string) {
  return prisma.exam.findUnique({
    where: {
      id: examId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          tenantId: true,
        },
      },
    },
  });
}

/**
 * Get exam attempt by user
 */
export async function getExamAttempt(examId: string, userId: string) {
  return prisma.examAttempt.findUnique({
    where: {
      examId_userId: {
        examId,
        userId,
      },
    },
  });
}

/**
 * Create exam attempt
 */
export async function createExamAttempt(data: {
  examId: string;
  userId: string;
  answers: Prisma.InputJsonValue;
}) {
  return prisma.examAttempt.create({
    data,
  });
}

/**
 * Submit exam attempt
 */
export async function submitExamAttempt(
  examId: string,
  userId: string,
  data: {
    answers: Prisma.InputJsonValue;
    score?: number;
    submittedAt: Date;
  }
) {
  return prisma.examAttempt.update({
    where: {
      examId_userId: {
        examId,
        userId,
      },
    },
    data,
  });
}

