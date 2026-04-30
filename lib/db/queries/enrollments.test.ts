
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { updateLessonProgress } from './enrollments';
import { prisma } from '../prisma';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import * as gamification from './gamification';
import { BadgeType } from '@prisma/client';

// Mock prisma
vi.mock('../prisma', async () => {
    const { mockDeep } = await import('vitest-mock-extended');
    return {
        prisma: mockDeep(),
    };
});

// Mock gamification
vi.mock('./gamification', () => ({
    awardBadge: vi.fn().mockResolvedValue(true),
}));

describe('updateLessonProgress', () => {
    beforeEach(() => {
        mockReset(prisma);
        vi.clearAllMocks();
    });

    it('awards FIRST_LESSON badge on first completion', async () => {
        const enrollmentId = 'enroll-1';
        const lessonId = 'lesson-1';
        const userId = 'user-1';

        // Mock upsert result
        vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({
            id: 'prog-1',
            enrollmentId,
            lessonId,
            completed: true,
            enrollment: { userId }
        } as never);

        // Mock completed count = 1
        vi.mocked(prisma.lessonProgress.count).mockResolvedValue(1);

        await updateLessonProgress(enrollmentId, lessonId, { completed: true });

        expect(gamification.awardBadge).toHaveBeenCalledWith(userId, BadgeType.FIRST_LESSON);
    });

    it('does not award badge if not first completion', async () => {
        const enrollmentId = 'enroll-1';
        const lessonId = 'lesson-2';
        const userId = 'user-1';

        // Mock upsert result
        vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({
            id: 'prog-2',
            enrollmentId,
            lessonId,
            completed: true,
            enrollment: { userId }
        } as never);

        // Mock completed count > 1
        vi.mocked(prisma.lessonProgress.count).mockResolvedValue(2);

        await updateLessonProgress(enrollmentId, lessonId, { completed: true });

        expect(gamification.awardBadge).not.toHaveBeenCalled();
    });
});
