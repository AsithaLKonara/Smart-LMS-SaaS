
"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { assertSeatAvailable } from "@/lib/billing/seats";

export async function enrollStudentsAction(studentIds: string[], courseId: string) {
    try {
        const { tenantId } = await getSessionContext();

        // 1. Verify course ownership/access
        const course = await prisma.course.findFirst({
            where: { id: courseId, tenantId },
            select: { id: true }
        });

        if (!course) {
            throw new Error("Course not found or access denied");
        }

        // 2. Perform enrollments in a transaction
        // Note: In a production app, we should check seats per student
        const results = await prisma.$transaction(
            studentIds.map(userId => 
                prisma.enrollment.upsert({
                    where: { userId_courseId: { userId, courseId } },
                    create: { userId, courseId },
                    update: {} // Do nothing if already enrolled
                })
            )
        );

        revalidatePath("/instructor/students");
        return { success: true, count: results.length };

    } catch (error) {
        console.error("[ENROLL_STUDENTS_ACTION]", error);
        return { success: false, error: error instanceof Error ? error.message : "Internal Error" };
    }
}
