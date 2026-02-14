
"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function submitAssignment(
    courseId: string,
    assignmentId: string,
    data: {
        content?: string;
        fileUrl?: string; // URL from upload service
    }
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!enrollment) {
            throw new Error("Not enrolled");
        }

        // Check if submission already exists (upsert logic)
        const submission = await prisma.submission.upsert({
            where: {
                assignmentId_userId: {
                    assignmentId,
                    userId
                }
            },
            create: {
                assignmentId,
                userId,
                content: data.content,
                fileUrl: data.fileUrl,
                submittedAt: new Date()
            },
            update: {
                content: data.content,
                fileUrl: data.fileUrl,
                submittedAt: new Date() // Resubmission updates time
            }
        });

        revalidatePath(`/courses/${courseId}/assignments/${assignmentId}`);
        return submission;
    } catch (error) {
        console.log("[SUBMIT_ASSIGNMENT]", error);
        throw new Error("Internal Error");
    }
}

export async function gradeSubmission(
    courseId: string,
    submissionId: string,
    grade: number,
    feedback: string
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

        const submission = await prisma.submission.update({
            where: {
                id: submissionId,
            },
            data: {
                grade,
                feedback,
                gradedAt: new Date()
            },
        });

        revalidatePath(`/instructor/courses/${courseId}/assignments/${submission.assignmentId}`);
        return submission;
    } catch (error) {
        console.log("[GRADE_SUBMISSION]", error);
        throw new Error("Internal Error");
    }
}
