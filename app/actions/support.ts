
"use server";

import { prisma } from "@/lib/db/prisma";
import { getSessionContext } from "@/lib/auth/utils";
import { revalidatePath } from "next/cache";

export async function createTicketAction(formData: { subject: string; description: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' }) {
    try {
        const { userId, tenantId } = await getSessionContext();

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                tenantId,
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
            }
        });

        revalidatePath("/help");
        return { success: true, ticketId: ticket.id };
    } catch (error) {
        console.error("[CREATE_TICKET]", error);
        return { success: false, error: "Failed to create ticket" };
    }
}

export async function getMyTickets() {
    try {
        const { userId, tenantId } = await getSessionContext();

        return await prisma.supportTicket.findMany({
            where: { userId, tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
    } catch (error) {
        console.error("[GET_TICKETS]", error);
        return [];
    }
}

export async function addTicketMessageAction(ticketId: string, body: string, isAdmin: boolean = false) {
    try {
        const { userId, tenantId } = await getSessionContext();

        // Verify ownership
        const ticket = await prisma.supportTicket.findFirst({
            where: { id: ticketId, tenantId }
        });

        if (!ticket) throw new Error("Ticket not found");

        const message = await prisma.supportMessage.create({
            data: {
                ticketId,
                userId,
                body,
                isAdmin
            }
        });

        revalidatePath("/help");
        return { success: true, message };
    } catch (error) {
        console.error("[ADD_TICKET_MESSAGE]", error);
        return { success: false, error: "Failed to send message" };
    }
}
