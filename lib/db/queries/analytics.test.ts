
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getCourseAnalytics } from './analytics';
import { prisma } from '../prisma';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Mock next/cache
vi.mock('next/cache', () => ({
    unstable_cache: (fn: any) => fn,
}));

// Mock prisma
vi.mock('../prisma', async () => {
    const { mockDeep } = await import('vitest-mock-extended');
    return {
        prisma: mockDeep(),
    };
});

describe('getCourseAnalytics', () => {
    beforeEach(() => {
        mockReset(prisma);
    });

    it('calculates course analytics correctly', async () => {
        // Setup mock data
        const tenantId = 'tenant-1';

        // Mock return values
        // Using simple type assertions or mock implementations
        (prisma.course.count as any).mockResolvedValueOnce(10) // totalCourses
            .mockResolvedValueOnce(5); // publishedCourses

        (prisma.enrollment.count as any).mockResolvedValue(100); // totalEnrollments

        (prisma.enrollment.aggregate as any).mockResolvedValue({
            _avg: { progress: 75.5 }
        });

        const result = await getCourseAnalytics(tenantId);

        expect(result).toEqual({
            totalCourses: 10,
            publishedCourses: 5,
            totalEnrollments: 100,
            avgCompletionRate: 75.5,
        });

        expect(prisma.course.count).toHaveBeenCalledWith({ where: { tenantId } });
        expect(prisma.course.count).toHaveBeenCalledWith({ where: { tenantId, status: 'PUBLISHED' } });
    });

    it('handles zero values correctly', async () => {
        const tenantId = 'tenant-empty';

        (prisma.course.count as any).mockResolvedValue(0);
        (prisma.enrollment.count as any).mockResolvedValue(0);
        (prisma.enrollment.aggregate as any).mockResolvedValue({
            _avg: { progress: null }
        });

        const result = await getCourseAnalytics(tenantId);

        expect(result).toEqual({
            totalCourses: 0,
            publishedCourses: 0,
            totalEnrollments: 0,
            avgCompletionRate: 0,
        });
    });
});
