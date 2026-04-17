import { prisma } from '../prisma';
import { MessageScope } from '@prisma/client';

export async function getThreadsForUser(tenantId: string, userId: string) {
  return prisma.messageThread.findMany({
    where: {
      tenantId,
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        select: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createDirectThread(tenantId: string, createdById: string, memberIds: string[]) {
  const uniqueMembers = Array.from(new Set([createdById, ...memberIds]));

  return prisma.messageThread.create({
    data: {
      tenantId,
      scope: MessageScope.DIRECT,
      createdById,
      members: {
        create: uniqueMembers.map((userId) => ({ userId })),
      },
    },
  });
}

export async function createCourseThread(
  tenantId: string,
  createdById: string,
  courseId: string,
  title: string
) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, tenantId },
    select: { id: true, instructorId: true },
  });
  if (!course) {
    throw new Error('Course not found in tenant');
  }

  const creator = await prisma.user.findFirst({
    where: { id: createdById, tenantId },
    select: { role: true },
  });
  const staff =
    course.instructorId === createdById ||
    creator?.role === 'ADMIN' ||
    creator?.role === 'SUPER_ADMIN';
  if (!staff) {
    throw new Error('Only course staff can create a course channel');
  }

  return prisma.messageThread.create({
    data: {
      tenantId,
      courseId,
      title,
      scope: MessageScope.COURSE,
      createdById,
      members: {
        create: [{ userId: createdById }],
      },
    },
  });
}

export async function getThreadMessages(tenantId: string, threadId: string, userId: string) {
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      tenantId,
      members: {
        some: { userId },
      },
    },
    include: {
      messages: {
        include: {
          sender: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return thread;
}

export async function createMessage(
  tenantId: string,
  threadId: string,
  senderId: string,
  body: string,
  attachmentUrl?: string | null
) {
  const thread = await prisma.messageThread.findFirst({
    where: {
      id: threadId,
      tenantId,
      members: {
        some: { userId: senderId },
      },
    },
    select: { id: true },
  });

  if (!thread) return null;

  const message = await prisma.message.create({
    data: {
      threadId,
      senderId,
      body,
      attachmentUrl: attachmentUrl || null,
    },
  });

  await prisma.messageThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() },
  });

  return message;
}
