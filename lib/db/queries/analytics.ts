
import { prisma } from "../prisma";

export async function getTenantStats(tenantId: string) {
    const [userCount, courseCount, enrollmentCount, pendingSubmissions] = await Promise.all([
        prisma.user.count({ where: { tenantId, role: 'STUDENT' } }),
        prisma.course.count({ where: { tenantId } }),
        prisma.enrollment.count({ where: { course: { tenantId } } }),
        prisma.submission.count({ 
            where: { 
                grade: null, 
                assignment: { course: { tenantId } } 
            } 
        })
    ]);

    // Average grade across all courses
    const averageGradeData = await prisma.submission.aggregate({
        where: { 
            assignment: { course: { tenantId } },
            grade: { not: null }
        },
        _avg: {
            grade: true
        }
    });

    return {
        userCount,
        courseCount,
        enrollmentCount,
        pendingSubmissions,
        averageGrade: averageGradeData._avg.grade || 0
    };
}

export async function getCourseCompletionRates(tenantId: string) {
    const courses = await prisma.course.findMany({
        where: { tenantId },
        select: {
            id: true,
            title: true,
            _count: {
                select: {
                    enrollments: true
                }
            },
            enrollments: {
                where: { completedAt: { not: null } },
                select: { id: true }
            }
        }
    });

    return courses.map(c => ({
        title: c.title,
        enrollments: c._count.enrollments,
        completions: c.enrollments.length,
        rate: c._count.enrollments > 0 ? (c.enrollments.length / c._count.enrollments) * 100 : 0
    }));
}

export async function getRevenueStats(tenantId: string) {
    const invoices = await prisma.invoice.findMany({
        where: { tenantId, status: 'paid' },
        orderBy: { issuedAt: 'asc' },
        select: {
            amountCents: true,
            issuedAt: true
        }
    });

    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    invoices.forEach(inv => {
        const month = inv.issuedAt.toISOString().substring(0, 7); // YYYY-MM
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (inv.amountCents / 100);
    });
    return Object.entries(monthlyRevenue).map(([month, amount]) => ({
        month,
        amount
    }));
}

export async function getGradebookMatrix(tenantId: string) {
    const students = await prisma.user.findMany({
        where: { tenantId, role: 'STUDENT' },
        select: {
            id: true,
            name: true,
            email: true,
            enrollments: {
                select: {
                    courseId: true,
                    progress: true,
                    course: { select: { title: true } }
                }
            },
            submissions: {
                select: {
                    grade: true,
                    assignment: { select: { title: true, courseId: true } }
                }
            },
            examAttempts: {
                select: {
                    score: true,
                    exam: { select: { title: true, courseId: true } }
                }
            }
        }
    });

    return students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        courses: s.enrollments.map(e => ({
            title: e.course.title,
            progress: e.progress,
            grades: [
                ...s.submissions.filter(sub => sub.assignment.courseId === e.courseId).map(sub => ({
                    title: sub.assignment.title,
                    score: sub.grade
                })),
                ...s.examAttempts.filter(ex => ex.exam.courseId === e.courseId).map(ex => ({
                    title: ex.exam.title,
                    score: ex.score
                }))
            ]
        }))
    }));
}
export async function getInstructorStats(instructorId: string) {
    const stats = await prisma.$transaction([
        prisma.course.count({ where: { instructorId } }),
        prisma.enrollment.count({ where: { course: { instructorId } } }),
        prisma.invoice.aggregate({
            where: { tenant: { courses: { some: { instructorId } } }, status: 'paid' },
            _sum: { amountCents: true }
        })
    ]);

    return {
        totalCourses: stats[0],
        totalStudents: stats[1],
        totalRevenue: (stats[2]._sum.amountCents || 0) / 100,
        averageRating: 4.8 // Mock rating for now
    };
}

export async function getInstructorChartData(instructorId: string) {
    // Return last 6 months mock data for charts
    return [
        { month: 'Jan', revenue: 4500, students: 120 },
        { month: 'Feb', revenue: 5200, students: 150 },
        { month: 'Mar', revenue: 4800, students: 140 },
        { month: 'Apr', revenue: 6100, students: 190 },
        { month: 'May', revenue: 5900, students: 180 },
        { month: 'Jun', revenue: 7200, students: 230 },
    ];
}

export async function getAdminStats(tenantId?: string) {
    if (tenantId) {
        // Tenant-level admin view
        const stats = await getTenantStats(tenantId);
        return {
            totalTenants: 1,
            totalUsers: stats.userCount,
            totalRevenue: 0, // Need to implement revenue aggregation
            totalEnrollments: stats.enrollmentCount
        };
    }

    // Global Super-Admin view
    const [tenants, users, enrollments, revenue] = await Promise.all([
        prisma.tenant.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.enrollment.count(),
        prisma.invoice.aggregate({
            where: { status: 'paid' },
            _sum: { amountCents: true }
        })
    ]);

    return {
        totalTenants: tenants,
        totalUsers: users,
        totalRevenue: (revenue._sum.amountCents || 0) / 100,
        totalEnrollments: enrollments
    };
}
