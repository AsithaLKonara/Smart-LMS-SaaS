
"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function startExam(courseId: string, examId: string) {
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

        // Check existing attempt
        let attempt = await prisma.examAttempt.findUnique({
            where: {
                examId_userId: {
                    examId,
                    userId
                }
            }
        });

        if (!attempt) {
            attempt = await prisma.examAttempt.create({
                data: {
                    examId,
                    userId,
                    answers: {},  // Empty answers initially
                    score: 0,
                },
            });
        }

        revalidatePath(`/courses/${courseId}/exams/${examId}/take`);
        return attempt;
    } catch (error) {
        console.log("[START_EXAM]", error);
        throw new Error("Internal Error");
    }
}

export async function submitExam(
    courseId: string,
    examId: string,
    answers: Record<string, string> // QuestionId -> Answer
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const attempt = await prisma.examAttempt.findUnique({
            where: {
                examId_userId: {
                    examId,
                    userId
                }
            },
            include: {
                exam: true
            }
        });

        if (!attempt) {
            throw new Error("Attempt not found");
        }

        if (attempt.submittedAt) {
            return attempt; // Already submitted
        }

        // Calculate Score
        // Get exam questions
        const questions = attempt.exam.questions as any[]; // Need casting
        let score = 0;
        let totalPoints = 0;

        questions.forEach((q: any) => {
            totalPoints += (q.points || 0);
            const userAnswer = answers[q.id];

            if (q.type === "MCQ") {
                if (userAnswer === q.correctAnswer) {
                    score += (q.points || 0);
                }
            }
            // Logic for Short Answer manual grading or simple match? For now auto-grade ONLY MCQ.
        });

        const finalScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

        const updatedAttempt = await prisma.examAttempt.update({
            where: {
                id: attempt.id,
            },
            data: {
                answers: answers as any,
                score: finalScore,
                submittedAt: new Date(),
            },
        });

        revalidatePath(`/courses/${courseId}/exams/${examId}/take`);
        return updatedAttempt;
    } catch (error) {
        console.log("[SUBMIT_EXAM]", error);
        throw new Error("Internal Error");
    }
}

export async function updateExamProgress(
    attemptId: string,
    answers: Record<string, string>
) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const attempt = await prisma.examAttempt.update({
            where: {
                id: attemptId,
                userId: userId // ensure ownership
            },
            data: {
                answers: answers as any, // Update answers JSON
            },
        });

        return attempt;
    } catch (error) {
        console.log("[UPDATE_EXAM_PROGRESS]", error);
        throw new Error("Internal Error");
    }
}
