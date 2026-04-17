
import openai from "@/lib/ai/openai";
import { auth } from "@/lib/auth/config";
import { apiResponse, apiError, handleApiError } from "@/lib/api/response";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";
import { findLessonInTenant, logAiRequest, permUser, requireAiPermission } from "@/lib/ai/access";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId || !session.user.role) {
            return apiError("Unauthorized", 401);
        }

        const gate = requireAiPermission(permUser(session.user.id, session.user.role, session.user.tenantId));
        if (!gate.ok) {
            return apiError("Forbidden", 403);
        }

        const { lessonId } = await req.json();
        if (!lessonId) {
            return apiError("Lesson ID required", 400);
        }

        const lesson = await findLessonInTenant(lessonId, session.user.tenantId);

        if (!lesson) {
            return apiError("Lesson not found", 404);
        }

        logAiRequest("summarize", session.user.id, session.user.tenantId, { lessonId });

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
