
import { RoleType } from "@prisma/client";
import { requireAuth } from "./session";
import { prisma } from "@/lib/db/prisma";

/**
 * Ensures user is authenticated and returns user with tenantId
 */
export async function getSessionContext() {
    const user = await requireAuth();
    return {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
        user
    };
}

/**
 * Validates that a record belongs to the user's tenant.
 * Use this when you have a record ID but need to ensure it's in the right tenant.
 */
export async function validateTenantAccess(
    table: 'course' | 'asset' | 'messageThread',
    id: string,
    tenantId: string
) {
    const record = await (prisma[table] as any).findFirst({
        where: { id, tenantId },
        select: { id: true }
    });

    if (!record) {
        throw new Error('Unauthorized: Access denied to this resource.');
    }

    return record;
}

/**
 * Helper to check if user has instructor/admin permissions for a specific course
 */
export async function validateCourseOwnership(courseId: string, userId: string, tenantId: string, role: RoleType) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        return validateTenantAccess('course', courseId, tenantId);
    }

    const course = await prisma.course.findFirst({
        where: { 
            id: courseId, 
            tenantId,
            instructorId: userId 
        },
        select: { id: true }
    });

    if (!course) {
        throw new Error('Unauthorized: You do not own this course.');
    }

    return course;
}
