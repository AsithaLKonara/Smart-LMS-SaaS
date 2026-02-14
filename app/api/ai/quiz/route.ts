
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { apiResponse, apiError, handleApiError } from "@/lib/api/response";
import OpenAI from "openai";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return apiError("Unauthorized", 401);
        }

        const { lessonId } = await req.json();

        if (!lessonId) {
            return apiError("Lesson ID is required", 400);
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
        });

        if (!lesson || !lesson.content) {
            return apiError("Lesson content not found", 404);
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPTS.QUIZ_GENERATOR },
                { role: "user", content: `Generate a quiz for this lesson content: \n\n${lesson.content}` },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            return apiError("Failed to generate quiz", 500);
        }

        const parsed = JSON.parse(content);
        const questions = Array.isArray(parsed) ? parsed : (parsed.quiz || parsed.questions || []);

        return apiResponse(questions);
    } catch (error) {
        return handleApiError(error);
    }
}
