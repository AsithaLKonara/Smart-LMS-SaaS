import { prisma } from "@/lib/db/prisma";
import type { LMSIntent } from "./intent";

/**
 * Retrieve relevant LMS knowledge snippets based on user query and intent.
 * Uses Prisma keyword search across courses, lessons, and modules.
 */
export async function searchLMSKnowledge(
  query: string,
  intent: LMSIntent,
  tenantId: string
): Promise<string[]> {
  const snippets: string[] = [];
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  if (terms.length === 0) return [];

  try {
    // For course_search or lesson_help: find matching courses
    if (
      intent === "course_search" ||
      intent === "lesson_help" ||
      intent === "general"
    ) {
      const courses = await prisma.course.findMany({
        where: {
          tenantId,
          status: "PUBLISHED",
          OR: terms.map((term) => ({
            OR: [
              { title: { contains: term, mode: "insensitive" } },
              { description: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
        take: 3,
        select: {
          title: true,
          description: true,
          _count: { select: { modules: true } },
        },
      });

      for (const c of courses) {
        snippets.push(
          `Course: "${c.title}" — ${c.description?.slice(0, 200) ?? ""}... (${c._count.modules} modules)`
        );
      }
    }

    // For lesson_help: find matching lessons
    if (intent === "lesson_help" || intent === "general") {
      const lessons = await prisma.lesson.findMany({
        where: {
          OR: terms.map((term) => ({
            title: { contains: term, mode: "insensitive" },
          })),
          module: {
            course: { tenantId },
          },
        },
        take: 3,
        select: {
          title: true,
          module: { select: { title: true, course: { select: { title: true } } } },
        },
      });

      for (const l of lessons) {
        snippets.push(
          `Lesson: "${l.title}" in module "${l.module.title}" of course "${l.module.course.title}".`
        );
      }
    }
  } catch {
    // Silently fail if DB query errors
  }

  return snippets;
}
