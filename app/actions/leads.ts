
"use server";

import { prisma } from "@/lib/db/prisma";

export async function submitLeadAction(formData: { name: string; email: string; company?: string; message?: string; type: string }) {
    try {
        await prisma.contactLead.create({
            data: {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: formData.message,
                type: formData.type,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("[SUBMIT_LEAD]", error);
        return { success: false, error: "Failed to submit request" };
    }
}
