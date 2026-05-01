"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { can, AuthUser } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * Assign a new role to a user.
 */
export async function assignUserRole(userId: string, newRole: RoleType) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const user: AuthUser = {
            id: session.user.id!,
            role: session.user.role as string,
            tenantId: session.user.tenantId as string
        };

        // Get the target user
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, tenantId: true, role: true }
        });

        if (!targetUser) {
            throw new Error("User not found");
        }

        // Use Policy Engine for granular scoping
        if (!can(user, PERMISSIONS.USER_ROLE_ASSIGN, targetUser)) {
            throw new Error("Forbidden: You do not have permission to assign roles to this user");
        }

        // Additional Rule: Only Super Admins can assign the SUPER_ADMIN role
        if (newRole === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN") {
            throw new Error("Forbidden: Only Super Admins can promote others to Super Admin");
        }

        // Update the user
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Error";
        console.error("[ASSIGN_ROLE]", message);
        return { success: false, error: message };
    }
}
