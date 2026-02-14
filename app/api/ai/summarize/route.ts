
import openai from "@/lib/ai/openai";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { apiResponse, apiError, handleApiError } from "@/lib/api/response";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return apiError("Unauthorized", 401);
        }

        const { lessonId } = await req.json();
        if (!lessonId) {
            return apiError("Lesson ID required", 400);
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });

        if (!lesson) {
            return apiError("Lesson not found", 404);
        }

        const textContent = (lesson.content || "") + (lesson.title ? ` Title: ${lesson.title}` : "");

        if (!textContent || textContent.length < 50) {
            return apiResponse({ summary: "Not enough content to generate a summary." });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPTS.SUMMARIZER },
                { role: "user", content: textContent },
            ],
        });

        const summary = response.choices[0].message.content;

        return apiResponse({ summary });
    } catch (error) {
        return handleApiError(error);
    }
}
