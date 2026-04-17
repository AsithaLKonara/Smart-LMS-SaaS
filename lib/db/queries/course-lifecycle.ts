import { prisma } from '../prisma';
import type { CourseStatus } from '@prisma/client';

export interface PublishValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Publish invariants: at least one module with one lesson; tenant active.
 */
export async function validateCoursePublish(courseId: string, tenantId: string): Promise<PublishValidationResult> {
  const errors: string[] = [];
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
    include: {
      modules: { include: { lessons: true } },
    },
  });
  if (!course) {
    return { ok: false, errors: ['Course not found'] };
  }
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { status: true } });
  if (tenant?.status !== 'ACTIVE') {
    errors.push('Tenant is not active');
  }
  if (!course.title?.trim()) {
    errors.push('Course title is required');
  }
  if (course.modules.length === 0) {
    errors.push('Course must have at least one module');
  }
  const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  if (lessonCount === 0) {
    errors.push('Course must have at least one lesson');
  }
  return { ok: errors.length === 0, errors };
}

export async function transitionCourseStatus(
  courseId: string,
  tenantId: string,
  actorId: string,
  nextStatus: CourseStatus
) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
  });
  if (!course) throw new Error('Course not found');

  if (nextStatus === 'PUBLISHED') {
    const v = await validateCoursePublish(courseId, tenantId);
    if (!v.ok) throw new Error(v.errors.join('; '));
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: nextStatus,
      ...(nextStatus === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
      ...(nextStatus === 'DRAFT' ? { publishedAt: null } : {}),
    },
  });

  await prisma.courseAuditLog.create({
    data: {
      tenantId,
      courseId,
      actorId,
      action: `status:${nextStatus}`,
      payload: { previousStatus: course.status },
    },
  });

  return updated;
}

export async function assertCourseStructuralEditable(courseId: string, tenantId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
    select: { status: true },
  });
  if (!course) throw new Error('Course not found');
  if (course.status === 'ARCHIVED') throw new Error('Course is archived');
  if (course.status === 'PUBLISHED' || course.status === 'IN_REVIEW') {
    throw new Error('Structural changes are not allowed while the course is published or in review');
  }
}

const PUBLISHED_LESSON_FIELD_ALLOWLIST = new Set([
  'title',
  'content',
  'videoUrl',
  'duration',
  'isFree',
  'completionMode',
  'videoCompletionThreshold',
  'revisionNote',
]);

export async function assertLessonUpdateAllowed(courseId: string, tenantId: string, values: Record<string, unknown>) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
    select: { status: true },
  });
  if (!course) throw new Error('Course not found');
  if (course.status === 'ARCHIVED') throw new Error('Course is archived');
  if (course.status === 'PUBLISHED' || course.status === 'IN_REVIEW') {
    const keys = Object.keys(values).filter((k) => values[k] !== undefined);
    const bad = keys.filter((k) => !PUBLISHED_LESSON_FIELD_ALLOWLIST.has(k));
    if (bad.length) {
      throw new Error(`Cannot update fields on a published course: ${bad.join(', ')}`);
    }
  }
}
