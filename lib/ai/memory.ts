import { prisma } from "@/lib/db/prisma";

export interface ConversationTurn {
  message: string;
  response: string;
}

/**
 * Get the last N conversation turns for a user session.
 * Uses the existing Prisma DB (no Supabase required).
 */
export async function getConversationHistory(
  userId: string,
  sessionId: string,
  limit = 8
): Promise<ConversationTurn[]> {
  try {
    const rows = await prisma.aIConversation.findMany({
      where: { userId, sessionId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { userMessage: true, assistantMessage: true },
    });
    return rows.reverse().map((r) => ({
      message: r.userMessage,
      response: r.assistantMessage,
    }));
  } catch {
    // Table may not exist yet; fail gracefully
    return [];
  }
}

/**
 * Save a conversation turn to the database.
 */
export async function saveConversationTurn(
  userId: string,
  tenantId: string,
  sessionId: string,
  userMessage: string,
  assistantMessage: string
): Promise<void> {
  try {
    await prisma.aIConversation.create({
      data: {
        userId,
        tenantId,
        sessionId,
        userMessage,
        assistantMessage,
      },
    });
  } catch {
    // Fail gracefully if table doesn't exist
  }
}
