import type { RoleType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { hasPermission, AuthUser as PermUser } from '@/lib/auth/guard';
import { PERMISSIONS } from '@/constants/permissions';
import { appLog } from '@/lib/observability/logger';

export function permUser(id: string, role: RoleType, tenantId: string): PermUser {
  return { id, role, tenantId };
}

export function requireAiPermission(user: PermUser) {
  if (!hasPermission(user, PERMISSIONS.AI_CHAT)) {
    return { ok: false as const, message: 'Forbidden' };
  }
  return { ok: true as const };
}

export async function findLessonInTenant(lessonId: string, tenantId: string) {
  return prisma.lesson.findFirst({
    where: { id: lessonId, module: { course: { tenantId } } },
    select: { id: true, content: true, title: true },
  });
}

export async function findCourseInTenant(courseId: string, tenantId: string) {
  return prisma.course.findFirst({
    where: { id: courseId, tenantId },
    select: { id: true, title: true, description: true, instructorId: true },
  });
}

export function logAiRequest(kind: string, userId: string, tenantId: string, meta: Record<string, string | undefined>) {
  appLog('info', {
    message: `ai_${kind}_request`,
    context: {
      userId,
      tenantId,
      ...meta,
    },
  });
}
