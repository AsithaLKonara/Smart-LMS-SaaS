"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { Course, Lesson, Module } from "@prisma/client";

export async function createCourse(data: { title: string }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const tenantId = session?.user?.tenantId;

        if (!userId || !tenantId) {
            throw new Error("Unauthorized");
        }

        const course = await prisma.course.create({
            data: {
                title: data.title,
                tenantId,
                instructorId: userId,
            },
        });

        revalidatePath("/instructor/courses");
        return course;

    } catch (error) {
        console.log("[COURSES]", error);
        throw new Error("Internal Error");
    }
}

export async function updateCourse(
    courseId: string,
    values: Partial<Course>
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const course = await prisma.course.update({
            where: {
                id: courseId,
                instructorId: userId,
            },
            data: {
                ...values,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return course;
    } catch (error) {
        console.log("[COURSE_ID]", error);
        throw new Error("Internal Error");
    }
}

export async function publishCourse(courseId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
            },
        });

        if (!course) {
            throw new Error("Not found");
        }

        const hasPublishedLessons = course.modules.some((module) =>
            module.lessons.some((lesson) => {
                // In future, check isPublished on lesson if added.
                // For now, checks if at least one lesson exists.
                return true;
            })
        );

        // Ensure required fields are present (Double check server-side)
        if (!course.title || !course.description || !hasPublishedLessons) {
            throw new Error("Missing required fields");
        }

        const updatedCourse = await prisma.course.update({
            where: {
                id: courseId,
                instructorId: userId,
            },
            data: {
                status: "PUBLISHED",
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return updatedCourse;
    } catch (error) {
        console.log("[COURSE_PUBLISH]", error);
        throw new Error("Internal Error");
    }
}

export async function unpublishCourse(courseId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const course = await prisma.course.update({
            where: {
                id: courseId,
                instructorId: userId,
            },
            data: {
                status: "DRAFT",
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return course;
    } catch (error) {
        console.log("[COURSE_UNPUBLISH]", error);
        throw new Error("Internal Error");
    }
}


// ===================================
// MODULE ACTIONS
// ===================================

export async function createModule(courseId: string, title: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const lastModule = await prisma.module.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                order: "desc",
            },
        });

        const newOrder = lastModule ? lastModule.order + 1 : 1;

        const module = await prisma.module.create({
            data: {
                title,
                courseId,
                order: newOrder,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return module;
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const module = await prisma.module.update({
            where: {
                id: moduleId,
                courseId: courseId,
            },
            data: {
                ...values,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return module;
    } catch (error) {
        console.log("[UPDATE_MODULE]", error);
        throw new Error("Internal Error");
    }
}

export async function reorderModules(
    courseId: string,
    updateData: { id: string; position: number }[]
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        for (const item of updateData) {
            await prisma.module.update({
                where: { id: item.id },
                data: { order: item.position },
            });
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.log("[REORDER_MODULES]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteModule(courseId: string, moduleId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const module = await prisma.module.delete({
            where: {
                id: moduleId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return module;
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

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
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const lesson = await prisma.lesson.update({
            where: {
                id: lessonId,
                moduleId: moduleId,
            },
            data: {
                ...values,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return lesson;
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        for (const item of updateData) {
            await prisma.lesson.update({
                where: { id: item.id },
                data: { order: item.position },
            });
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                instructorId: userId,
            },
        });

        if (!courseOwner) {
            throw new Error("Unauthorized");
        }

        const lesson = await prisma.lesson.delete({
            where: {
                id: lessonId,
                moduleId: moduleId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}`);
        return lesson;
    } catch (error) {
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
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Get last module order
        const lastModule = await prisma.module.findFirst({
            where: { courseId },
            orderBy: { order: "desc" },
        });

        let moduleOrder = lastModule ? lastModule.order + 1 : 1;

        for (const moduleData of modules) {
            const module = await prisma.module.create({
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
                        moduleId: module.id,
                        order: lessonOrder++,
                    },
                });
            }
        }

        revalidatePath(`/instructor/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("[APPLY_AI_OUTLINE]", error);
        return { success: false, error: "Failed to apply outline" };
    }
}
