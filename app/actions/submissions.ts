
"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";

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

        const assignment = await prisma.assignment.findFirst({
            where: { id: assignmentId, courseId },
            select: {
                dueDate: true,
                allowLate: true,
                latePenaltyPercent: true,
                maxSubmissions: true,
            },
        });

        if (!assignment) {
            throw new Error("Assignment not found");
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

        const existing = await prisma.submission.findUnique({
            where: { assignmentId_userId: { assignmentId, userId } },
        });

        if (assignment.dueDate && !assignment.allowLate && new Date() > assignment.dueDate) {
            throw new Error("This assignment is past due and late submissions are not allowed");
        }

        if (existing && existing.submitCount >= assignment.maxSubmissions) {
            throw new Error("Maximum submissions reached for this assignment");
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
                submittedAt: new Date(), // Resubmission updates time
                submitCount: { increment: 1 },
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
        const tenantId = session?.user?.tenantId;
        const role = session?.user?.role;

        if (!userId || !tenantId || !role) {
            throw new Error("Unauthorized");
        }

        const course = await prisma.course.findFirst({
            where: { id: courseId, tenantId },
            select: { instructorId: true },
        });

        if (!course) {
            throw new Error("Unauthorized");
        }

        const isCourseInstructor = course.instructorId === userId;
        const isTenantAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

        if (!isCourseInstructor && !isTenantAdmin) {
            throw new Error("Unauthorized");
        }

        const prev = await prisma.submission.findFirst({
            where: { id: submissionId, assignment: { courseId } },
        });

        if (!prev) {
            throw new Error("Submission not found");
        }

        if (prev.grade != null && prev.grade !== grade && !hasPermission({ id: userId, role, tenantId }, PERMISSIONS.GRADE_OVERRIDE)) {
            throw new Error("Grade override not permitted");
        }

        const submission = await prisma.$transaction(async (tx) => {
            const updated = await tx.submission.update({
                where: { id: submissionId },
                data: {
                    grade,
                    feedback,
                    gradedAt: new Date(),
                    gradedById: userId,
                },
            });

            if (prev.grade !== grade) {
                await tx.submissionGradeHistory.create({
                    data: {
                        submissionId,
                        actorId: userId,
                        previousGrade: prev.grade ?? undefined,
                        newGrade: grade,
                    },
                });
            }

            return updated;
        });

        revalidatePath(`/instructor/courses/${courseId}/assignments/${submission.assignmentId}`);
        return submission;
    } catch (error) {
        console.log("[GRADE_SUBMISSION]", error);
        throw new Error("Internal Error");
    }
}
