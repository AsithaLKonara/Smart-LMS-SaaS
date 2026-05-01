"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { Course, Lesson, Module } from "@prisma/client";
import { transitionCourseStatus, assertCourseStructuralEditable, assertLessonUpdateAllowed } from "@/lib/db/queries/course-lifecycle";
import { assertTenantOperational, assertCourseLimit } from "@/lib/billing/seats";
import { logActivity } from "@/lib/enterprise/audit";

export async function createCourse(data: { title: string }) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const op = await assertTenantOperational(tenantId);
        if (!op.ok) {
            throw new Error(op.message);
        }

        const limitCheck = await assertCourseLimit(tenantId);
        if (!limitCheck.ok) {
            throw new Error(limitCheck.message);
        }

        const course = await prisma.course.create({
            data: {
                title: data.title,
                tenantId,
                instructorId: userId,
            },
        });

        await logActivity(tenantId, userId, "COURSE_CREATE", `Course:${course.id}`, { title: data.title });

        revalidatePath("/instructor/courses");
        return course;

    } catch (error: unknown) {
        console.log("[COURSES]", error);
        throw new Error("Internal Error");
    }
}

export async function updateCourse(
    courseId: string,
    values: Partial<Course>
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const existing = await prisma.course.findFirst({
            where: { id: courseId, instructorId: userId, tenantId },
            select: { status: true, tenantId: true },
        });
        if (!existing) {
            throw new Error("Unauthorized");
        }
        if (existing.status === "ARCHIVED") {
            throw new Error("Course is archived");
        }

        const { status: _ignored, ...data } = values;

        const course = await prisma.course.update({
            where: {
                id: courseId,
                instructorId: userId,
            },
            data: {
                ...data,
            },
        });

        await logActivity(tenantId, userId, "COURSE_UPDATE", `Course:${courseId}`, values);

        revalidatePath(`/instructor/courses/${courseId}`);
        return course;
    } catch (error: unknown) {
        console.log("[COURSE_ID]", error);
        throw new Error("Internal Error");
    }
}

export async function publishCourse(courseId: string) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
                tenantId,
            },
        });

        if (!course) {
            throw new Error("Not found");
        }

        const updatedCourse = await transitionCourseStatus(courseId, tenantId, userId, "PUBLISHED");

        revalidatePath(`/instructor/courses/${courseId}`);
        return updatedCourse;
    } catch (error: unknown) {
        console.log("[COURSE_PUBLISH]", error);
        throw new Error("Internal Error");
    }
}

export async function unpublishCourse(courseId: string) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const course = await prisma.course.findFirst({
            where: { id: courseId, instructorId: userId, tenantId },
        });

        if (!course) {
            throw new Error("Not found");
        }

        const updated = await transitionCourseStatus(courseId, tenantId, userId, "DRAFT");

        revalidatePath(`/instructor/courses/${courseId}`);
        return updated;
    } catch (error: unknown) {
        console.log("[COURSE_UNPUBLISH]", error);
        throw new Error("Internal Error");
    }
}


// ===================================
// MODULE ACTIONS
// ===================================

export async function createModule(courseId: string, title: string) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
                tenantId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        const lastModule = await prisma.module.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                order: "desc",
            },
        });

        const newOrder = lastModule ? lastModule.order + 1 : 1;

        const mod = await prisma.module.create({
            data: {
                title,
                courseId,
                order: newOrder,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return mod;
    } catch (error: unknown) {
        console.log("[CREATE_MODULE]", error);
        throw new Error("Internal Error");
    }
}

export async function updateModule(
    courseId: string,
    moduleId: string,
    values: { title: string }
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
                tenantId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }
        if (courseOwner.status === "ARCHIVED") {
            throw new Error("Course is archived");
        }

        const mod = await prisma.module.update({
            where: {
                id: moduleId,
                courseId: courseId,
            },
            data: {
                ...values,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return mod;
    } catch (error: unknown) {
        console.log("[UPDATE_MODULE]", error);
        throw new Error("Internal Error");
    }
}

export async function reorderModules(
    courseId: string,
    updateData: { id: string; position: number }[]
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
                tenantId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        for (const item of updateData) {
            await prisma.module.update({
                where: { id: item.id },
                data: { order: item.position },
            });
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error: unknown) {
        console.log("[REORDER_MODULES]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteModule(courseId: string, moduleId: string) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
                tenantId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        const mod = await prisma.module.delete({
            where: {
                id: moduleId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return mod;
    } catch (error: unknown) {
        console.log("[DELETE_MODULE]", error);
        throw new Error("Internal Error");
    }
}

// ===================================
// LESSON ACTIONS
// ===================================

export async function createLesson(
    courseId: string,
    moduleId: string,
    title: string
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        const lastLesson = await prisma.lesson.findFirst({
            where: {
                moduleId: moduleId,
            },
            orderBy: {
                order: "desc",
            },
        });

        const newOrder = lastLesson ? lastLesson.order + 1 : 1;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                moduleId,
                order: newOrder,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return lesson;
    } catch (error: unknown) {
        console.log("[CREATE_LESSON]", error);
        throw new Error("Internal Error");
    }
}

export async function updateLesson(
    courseId: string,
    moduleId: string, // module id is required to confirm hierarchy ownership
    lessonId: string,
    values: Partial<Lesson>
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertLessonUpdateAllowed(courseId, courseOwner.tenantId, values as Record<string, unknown>);

        const lesson = await prisma.lesson.update({
            where: {
                id: lessonId,
                moduleId: moduleId,
            },
            data: {
                ...values,
            },
        });

        await logActivity(courseOwner.tenantId, userId, "LESSON_UPDATE", `Lesson:${lessonId}`, values);

        revalidatePath(`/instructor/courses/${courseId}`);
        return lesson;
    } catch (error: unknown) {
        console.log("[UPDATE_LESSON]", error);
        throw new Error("Internal Error");
    }
}

export async function reorderLessons(
    courseId: string,
    moduleId: string,
    updateData: { id: string; position: number }[]
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        for (const item of updateData) {
            await prisma.lesson.update({
                where: { id: item.id },
                data: { order: item.position },
            });
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error: unknown) {
        console.log("[REORDER_LESSONS]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteLesson(
    courseId: string,
    moduleId: string,
    lessonId: string
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        const lesson = await prisma.lesson.delete({
            where: {
                id: lessonId,
                moduleId: moduleId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return lesson;
    } catch (error: unknown) {
        console.log("[DELETE_LESSON]", error);
        throw new Error("Internal Error");
    }
}
/**
 * Bulk apply an AI-generated outline to a course
 */
export async function applyAIOutline(
    courseId: string,
    modules: { title: string; lessons: string[] }[]
) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const courseOwner = await prisma.course.findFirst({
            where: { id: courseId, instructorId: userId },
        });
        if (!courseOwner) {
            throw new Error("Unauthorized");
        }
        await assertCourseStructuralEditable(courseId, courseOwner.tenantId);

        // Get last module order
        const lastModule = await prisma.module.findFirst({
            where: { courseId },
            orderBy: { order: "desc" },
        });

        let moduleOrder = lastModule ? lastModule.order + 1 : 1;

        for (const moduleData of modules) {
            const mod = await prisma.module.create({
                data: {
                    title: moduleData.title,
                    courseId,
                    order: moduleOrder++,
                },
            });

            let lessonOrder = 1;
            for (const lessonTitle of moduleData.lessons) {
                await prisma.lesson.create({
                    data: {
                        title: lessonTitle,
                        moduleId: mod.id,
                        order: lessonOrder++,
                    },
                });
            }
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error: unknown) {
        console.error("[APPLY_AI_OUTLINE]", error);
        return { success: false, error: "Failed to apply outline" };
    }
}
