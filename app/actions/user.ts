"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { can, AuthUser } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/constants/permissions";

export async function changePassword(data: { current: string; new: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const user = session.user as AuthUser;
        if (!can(user, PERMISSIONS.PROFILE_UPDATE, { id: user.id })) {
            throw new Error("Forbidden");
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        });

        if (!dbUser || !dbUser.password) {
            throw new Error("User not found or password not set");
        }

        const isMatch = await bcrypt.compare(data.current, dbUser.password);
        if (!isMatch) {
            throw new Error("Current password incorrect");
        }

        const hashedPassword = await bcrypt.hash(data.new, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Error";
        console.error("[CHANGE_PASSWORD]", message);
        return { success: false, error: message };
    }
}

export async function updateProfile(data: { name?: string; avatar?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const user = session.user as AuthUser;
        if (!can(user, PERMISSIONS.PROFILE_UPDATE, { id: user.id })) {
            throw new Error("Forbidden");
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                avatar: data.avatar,
            }
        });

        revalidatePath("/profile");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Error";
        console.error("[UPDATE_PROFILE]", message);
        return { success: false, error: message };
    }
}

export async function toggleTwoFactor(enabled: boolean) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { isTwoFactorEnabled: enabled }
        });

        revalidatePath("/profile");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal Error";
        console.error("[TOGGLE_2FA]", message);
        return { success: false, error: message };
    }
}
