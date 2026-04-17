import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { guardPermission } from '@/lib/auth/api-permission';
import { PERMISSIONS } from '@/constants/permissions';
import { createCourseThread, createDirectThread, getThreadsForUser } from '@/lib/db/queries/messaging';

const createThreadSchema = z.object({
  scope: z.enum(['DIRECT', 'COURSE']),
  memberIds: z.array(z.string()).default([]),
  courseId: z.string().optional(),
  title: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const threads = await getThreadsForUser(user.tenantId, user.id);
    return NextResponse.json({ success: true, data: threads });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to load threads' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = createThreadSchema.parse(await request.json());
    const perm =
      payload.scope === 'COURSE' && payload.courseId ? PERMISSIONS.MESSAGE_BROADCAST : PERMISSIONS.MESSAGE_DIRECT;
    const g = await guardPermission(perm);
    if (!g.ok) return g.response;
    const user = g.user;

    const thread =
      payload.scope === 'COURSE' && payload.courseId
        ? await createCourseThread(user.tenantId, user.id, payload.courseId, payload.title ?? 'Course thread')
        : await createDirectThread(user.tenantId, user.id, payload.memberIds);

    return NextResponse.json({ success: true, data: thread }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to create thread' },
      { status: 400 }
    );
  }
}
