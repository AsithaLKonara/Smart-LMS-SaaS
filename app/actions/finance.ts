
"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/enterprise/audit";

export async function createOrderAction(courseId: string, amount: number, method: 'CARD' | 'BANK_TRANSFER') {
    try {
        const { userId, tenantId } = await getSessionContext();

        const order = await prisma.order.create({
            data: {
                tenantId,
                userId,
                courseId,
                amount,
                paymentMethod: method,
                status: 'PENDING',
            }
        });

        await logActivity(tenantId, userId, "ORDER_CREATE", `Order:${order.id}`, { amount, method });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("[CREATE_ORDER]", error);
        return { success: false, error: "Failed to initiate purchase" };
    }
}

export async function uploadBankSlipAction(orderId: string, imageUrl: string) {
    try {
        const { userId, tenantId } = await getSessionContext();

        await prisma.bankSlip.create({
            data: {
                orderId,
                imageUrl,
            }
        });

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING' }
        });

        await logActivity(tenantId, userId, "BANK_SLIP_UPLOAD", `Order:${orderId}`);

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("[UPLOAD_SLIP]", error);
        return { success: false, error: "Failed to upload slip" };
    }
}

export async function verifyOrderAction(orderId: string) {
    try {
        const { userId, tenantId, role } = await getSessionContext();

        if (role !== 'ADMIN' && role !== 'TENANT_ADMIN' && role !== 'SUPER_ADMIN') {
            throw new Error("Unauthorized");
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId, tenantId },
            include: { course: true }
        });

        if (!order) throw new Error("Order not found");

        await prisma.$transaction([
            prisma.order.update({
                where: { id: orderId },
                data: { status: 'COMPLETED' }
            }),
            prisma.financialTransaction.create({
                data: {
                    tenantId,
                    orderId,
                    type: 'INFLOW',
                    amount: order.amount,
                    description: `Sale: ${order.course?.title || 'Course'}`
                }
            }),
            // Auto-enroll if courseId exists
            ...(order.courseId ? [
                prisma.enrollment.upsert({
                    where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
                    create: { userId: order.userId, courseId: order.courseId },
                    update: {}
                })
            ] : [])
        ]);

        await logActivity(tenantId, userId, "ORDER_VERIFY", `Order:${orderId}`);

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("[VERIFY_ORDER]", error);
        return { success: false, error: "Failed to verify order" };
    }
}
