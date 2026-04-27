import { groq } from "./groq";

export type LMSIntent =
  | "course_search"
  | "lesson_help"
  | "assignment_help"
  | "exam_help"
  | "platform_help"
  | "progress_help"
  | "general";

export interface IntentResult {
  intent: LMSIntent;
  entities: {
    topic?: string;
    course_name?: string;
    lesson_name?: string;
    assignment_name?: string;
    question?: string;
  };
  confidence: "high" | "medium" | "low";
}

const INTENT_SYSTEM_PROMPT = `You are an intent classifier for a Learning Management System (LMS) AI tutor.
Analyze the user message and return ONLY a valid JSON object with this exact shape:
{
  "intent": "<one of: course_search|lesson_help|assignment_help|exam_help|platform_help|progress_help|general>",
  "entities": {
    "topic": "<subject or topic if mentioned, or null>",
    "course_name": "<course name if mentioned, or null>",
    "lesson_name": "<lesson name if mentioned, or null>",
    "assignment_name": "<assignment name if mentioned, or null>",
    "question": "<specific question extracted, or null>"
  },
  "confidence": "<high|medium|low>"
}

Intent definitions:
- course_search: user wants to find, discover, or enroll in a course
- lesson_help: user needs help understanding lesson content, a concept, or topic
- assignment_help: user needs help with an assignment or project
- exam_help: user needs help with exam preparation or a quiz question
- platform_help: user asks how to use the LMS platform (enrollment, navigation, certificates)
- progress_help: user asks about their grades, progress, streaks, or certificates
- general: anything else

Return ONLY the JSON. No explanation. No markdown.`;

export async function detectIntent(message: string): Promise<IntentResult> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: false,
      temperature: 0.1,
      max_completion_tokens: 300,
      messages: [
        { role: "system", content: INTENT_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
    const clean = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(clean) as IntentResult;
    return parsed;
  } catch {
    return {
      intent: "general",
      entities: {},
      confidence: "low",
    };
  }
}
