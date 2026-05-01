
"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/enterprise/audit";

export async function createApiKeyAction(name: string) {
    try {
        const { userId, tenantId, role } = await getSessionContext();

        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            throw new Error("Unauthorized");
        }

        // Generate a random key
        const rawKey = `slms_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
        const prefix = rawKey.substring(0, 10);
        
        // In a real app, hash this key
        const hashedKey = rawKey; // Simplification for demo

        const apiKey = await prisma.apiKey.create({
            data: {
                tenantId,
                name,
                key: hashedKey,
                prefix,
            }
        });

        await logActivity(tenantId, userId, "API_KEY_CREATE", `ApiKey:${apiKey.id}`, { name });

        revalidatePath("/settings");
        return { success: true, key: rawKey }; // Return raw key ONLY ONCE
    } catch (error) {
        console.error("[CREATE_API_KEY]", error);
        return { success: false, error: "Failed to create API key" };
    }
}

export async function deleteApiKeyAction(id: string) {
    try {
        const { userId, tenantId, role } = await getSessionContext();

        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            throw new Error("Unauthorized");
        }

        await prisma.apiKey.delete({
            where: { id, tenantId }
        });

        await logActivity(tenantId, userId, "API_KEY_DELETE", `ApiKey:${id}`);

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("[DELETE_API_KEY]", error);
        return { success: false, error: "Failed to delete API key" };
    }
}
