"use server";

import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function changePassword(data: { current: string; new: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        });

        if (!user || !user.password) {
            throw new Error("User not found or password not set");
        }

        const isMatch = await bcrypt.compare(data.current, user.password);
        if (!isMatch) {
            throw new Error("Current password incorrect");
        }

        const hashedPassword = await bcrypt.hash(data.new, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return { success: true };
    } catch (error: any) {
        console.error("[CHANGE_PASSWORD]", error.message);
        return { success: false, error: error.message };
    }
}

export async function updateProfile(data: { name?: string; avatar?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
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
    } catch (error: any) {
        console.error("[UPDATE_PROFILE]", error.message);
        return { success: false, error: error.message };
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
    } catch (error: any) {
        console.error("[TOGGLE_2FA]", error.message);
        return { success: false, error: error.message };
    }
}
