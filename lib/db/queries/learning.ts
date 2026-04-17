import { prisma } from '../prisma';
import type { LessonCompletionMode } from '@prisma/client';

/**
 * Returns prerequisite lesson IDs that are not yet completed for this enrollment.
 */
export async function getIncompletePrerequisites(lessonId: string, enrollmentId: string) {
  const prereqs = await prisma.lessonPrerequisite.findMany({
    where: { lessonId },
    select: { requiresLessonId: true },
  });
  if (prereqs.length === 0) return [];

  const completed = await prisma.lessonProgress.findMany({
    where: {
      enrollmentId,
      lessonId: { in: prereqs.map((p) => p.requiresLessonId) },
      completed: true,
    },
    select: { lessonId: true },
  });
  const done = new Set(completed.map((c) => c.lessonId));
  return prereqs.map((p) => p.requiresLessonId).filter((id) => !done.has(id));
}

export async function canMarkLessonComplete(
  lessonId: string,
  enrollmentId: string,
  opts?: { completionMode?: LessonCompletionMode; lastPosition?: number; duration?: number | null }
) {
  const incomplete = await getIncompletePrerequisites(lessonId, enrollmentId);
  if (incomplete.length > 0) {
    return { ok: false as const, reason: 'prerequisites_incomplete', missingLessonIds: incomplete };
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { completionMode: true, duration: true, videoCompletionThreshold: true },
  });
  if (!lesson) return { ok: false as const, reason: 'lesson_not_found', missingLessonIds: [] };

  const mode = opts?.completionMode ?? lesson.completionMode;
  if (mode === 'VIDEO_THRESHOLD') {
    const dur = lesson.duration ?? opts?.duration ?? 0;
    const pos = opts?.lastPosition ?? 0;
    const threshold = lesson.videoCompletionThreshold;
    if (dur <= 0 || pos / dur < threshold) {
      return { ok: false as const, reason: 'video_threshold_not_met', missingLessonIds: [] };
    }
  }

  return { ok: true as const, reason: null, missingLessonIds: [] };
}

export async function getPrerequisiteMapForCourse(courseId: string) {
  const prereqs = await prisma.lessonPrerequisite.findMany({
    where: { lesson: { module: { courseId } } },
    select: { lessonId: true, requiresLessonId: true },
  });
  const map = new Map<string, string[]>();
  for (const p of prereqs) {
    const arr = map.get(p.lessonId) ?? [];
    arr.push(p.requiresLessonId);
    map.set(p.lessonId, arr);
  }
  return map;
}

export function isLessonUnlocked(
  lessonId: string,
  prereqMap: Map<string, string[]>,
  completedLessonIds: Set<string>
) {
  const reqs = prereqMap.get(lessonId) ?? [];
  return reqs.every((id) => completedLessonIds.has(id));
}

/** Next lesson in global order that is incomplete and unlocked; otherwise null. */
export function getResumeLessonId(
  orderedLessonIds: string[],
  prereqMap: Map<string, string[]>,
  completedLessonIds: Set<string>
) {
  for (const id of orderedLessonIds) {
    if (completedLessonIds.has(id)) continue;
    if (!isLessonUnlocked(id, prereqMap, completedLessonIds)) continue;
    return id;
  }
  return null;
}
