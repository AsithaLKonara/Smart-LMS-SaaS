
"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { Exam } from "@prisma/client";

export async function createExam(courseId: string, title: string) {
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

        const exam = await prisma.exam.create({
            data: {
                courseId,
                title,
                duration: 30, // Default 30 mins
                questions: [], // Empty questions
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/exams`);
        return exam;
    } catch (error) {
        console.log("[CREATE_EXAM]", error);
        throw new Error("Internal Error");
    }
}

export async function updateExam(
    courseId: string,
    examId: string,
    values: Partial<Exam>
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

        // Additionally verify exam belongs to course
        const existingExam = await prisma.exam.findUnique({
            where: { id: examId }
        });

        if (!existingExam || existingExam.courseId !== courseId) {
            throw new Error("Unauthorized or Not Found");
        }

        const exam = await prisma.exam.update({
            where: {
                id: examId,
            },
            data: {
                ...values,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/exams`);
        return exam;
    } catch (error) {
        console.log("[UPDATE_EXAM]", error);
        throw new Error("Internal Error");
    }
}

export async function deleteExam(
    courseId: string,
    examId: string
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

        const existingExam = await prisma.exam.findUnique({
            where: { id: examId }
        });

        if (!existingExam || existingExam.courseId !== courseId) {
            throw new Error("Unauthorized or Not Found");
        }

        const exam = await prisma.exam.delete({
            where: {
                id: examId,
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/exams`);
        return exam;
    } catch (error) {
        console.log("[DELETE_EXAM]", error);
        throw new Error("Internal Error");
    }
}
