
"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function createAssignment(
    courseId: string,
    data: {
        title: string;
        description?: string;
        attachmentUrl?: string;
        totalPoints?: number;
        dueDate?: Date;
    }
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

        const assignment = await prisma.assignment.create({
            data: {
                courseId,
                title: data.title,
                description: data.description,
                attachmentUrl: data.attachmentUrl,
                totalPoints: data.totalPoints || 100,
                dueDate: data.dueDate,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/assignments`);
        return assignment;
    } catch (error) {
        console.log("[CREATE_ASSIGNMENT]", error);
        throw new Error("Internal Error");
    }
}

export async function updateAssignment(
    courseId: string,
    assignmentId: string,
    data: {
        title?: string;
        description?: string;
        attachmentUrl?: string;
        totalPoints?: number;
        dueDate?: Date;
    }
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

        const existingAssignment = await prisma.assignment.findUnique({
            where: { id: assignmentId }
        });

        if (!existingAssignment || existingAssignment.courseId !== courseId) {
            throw new Error("Not Found");
        }

        const assignment = await prisma.assignment.update({
            where: {
                id: assignmentId,
            },
            data: {
                ...data
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/assignments`);
        return assignment;
    } catch (error) {
        console.log("[UPDATE_ASSIGNMENT]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteAssignment(
    courseId: string,
    assignmentId: string
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

        const existingAssignment = await prisma.assignment.findUnique({
            where: { id: assignmentId }
        });

        if (!existingAssignment || existingAssignment.courseId !== courseId) {
            throw new Error("Not Found");
        }

        const assignment = await prisma.assignment.delete({
            where: {
                id: assignmentId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/assignments`);
        return assignment;
    } catch (error) {
        console.log("[DELETE_ASSIGNMENT]", error);
        throw new Error("Internal Error");
    }
}
