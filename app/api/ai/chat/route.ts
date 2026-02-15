import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages } = await req.json();

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
