
import { prisma } from "@/lib/db/prisma";
import { headers } from "next/headers";

export async function logActivity(
    tenantId: string,
    actorId: string,
    action: string,
    resource: string,
    payload?: any
) {
    try {
        const headerList = await headers();
        const ipAddress = headerList.get("x-forwarded-for") || "unknown";
        const userAgent = headerList.get("user-agent") || "unknown";

        await prisma.auditLog.create({
            data: {
                tenantId,
                actorId,
                action,
                resource,
                payload,
                ipAddress,
                userAgent,
            }
        });
    } catch (error) {
        // We don't want to break the main action if audit logging fails, but we should log it
        console.error("[AUDIT_LOG_ERROR]", error);
    }
}
