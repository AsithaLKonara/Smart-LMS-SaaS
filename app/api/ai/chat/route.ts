
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages } = await req.json();

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant for the Smart LMS platform. You help students learn by answering questions about course content.",
                },
                ...messages,
            ],
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log("[AI_CHAT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
