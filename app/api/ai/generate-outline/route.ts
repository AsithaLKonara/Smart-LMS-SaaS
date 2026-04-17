
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";
import { findCourseInTenant, logAiRequest, permUser, requireAiPermission } from "@/lib/ai/access";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId || !session.user.role) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const gate = requireAiPermission(permUser(session.user.id, session.user.role, session.user.tenantId));
        if (!gate.ok) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { courseId } = await req.json();

        const course = await findCourseInTenant(courseId, session.user.tenantId);

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        if (course.instructorId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        logAiRequest("outline", session.user.id, session.user.tenantId, { courseId });

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPTS.OUTLINE_GENERATOR },
                {
                    role: "user",
                    content: `Generate a module structure for:
          Title: ${course.title}
          Description: ${course.description || "Unspecified"}
          
          Return as a JSON array of modules, each with a 'title' and 'lessons' (array of titles).
          Example: [{ "title": "Module Name", "lessons": ["Lesson 1", "Lesson 2"] }]`
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            return new NextResponse("Failed to generate outline", { status: 500 });
        }

        const parsed = JSON.parse(content);
        const modules = parsed.modules || parsed.structure || parsed;

        return NextResponse.json(modules);
    } catch (error) {
        console.error("[AI_OUTLINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
