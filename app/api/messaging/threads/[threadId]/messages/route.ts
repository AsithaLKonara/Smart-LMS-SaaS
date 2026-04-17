import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { guardPermission } from '@/lib/auth/api-permission';
import { PERMISSIONS } from '@/constants/permissions';
import { createMessage, getThreadMessages } from '@/lib/db/queries/messaging';

const messageSchema = z.object({
  body: z.string().min(1).max(5000),
  attachmentUrl: z.string().url().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const user = await requireAuth();
    const { threadId } = await params;
    const thread = await getThreadMessages(user.tenantId, threadId, user.id);
    if (!thread) {
      return NextResponse.json({ success: false, error: 'Thread not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: thread });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to fetch messages' },
      { status: 401 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const g = await guardPermission(PERMISSIONS.MESSAGE_DIRECT);
    if (!g.ok) return g.response;
    const user = g.user;
    const { threadId } = await params;
    const payload = messageSchema.parse(await request.json());
    const message = await createMessage(
      user.tenantId,
      threadId,
      user.id,
      payload.body,
      payload.attachmentUrl
    );
    if (!message) {
      return NextResponse.json({ success: false, error: 'Thread not found or no access' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to send message' },
      { status: 400 }
    );
  }
}
