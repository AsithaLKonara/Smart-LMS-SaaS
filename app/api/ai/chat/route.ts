import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import { logAiRequest, permUser } from "@/lib/ai/access";

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const tenantId = session?.user?.tenantId;
        const role = session?.user?.role;

        if (!userId || !tenantId || !role) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const u = permUser(userId, role, tenantId);
        if (!hasPermission(u, PERMISSIONS.AI_USE)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { messages } = await req.json();
        logAiRequest("chat", userId, tenantId, { messageCount: String(Array.isArray(messages) ? messages.length : 0) });

        const result = await streamText({
            model: openai("gpt-3.5-turbo") as any,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.log("[AI_CHAT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
