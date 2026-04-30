
"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export async function updateTenantBrandingAction(data: { name?: string; logo?: string; accentColor?: string }) {
    try {
        const { tenantId, role } = await getSessionContext();

        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
            throw new Error("Unauthorized");
        }

        await prisma.tenant.update({
            where: { id: tenantId },
            data: {
                name: data.name,
                logo: data.logo,
                accentColor: data.accentColor,
            }
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("[UPDATE_TENANT_BRANDING]", error);
        return { success: false, error: "Failed to update branding" };
    }
}
