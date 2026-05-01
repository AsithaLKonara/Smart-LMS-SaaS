
import { prisma } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

/**
 * Get financial metrics for a specific context (Global or Tenant)
 */
export async function getFinancialSummary(tenantId?: string, instructorId?: string) {
    const where: any = {
        status: OrderStatus.COMPLETED
    };

    if (tenantId) where.tenantId = tenantId;
    if (instructorId) where.course = { instructorId };

    const totalIncome = await prisma.order.aggregate({
        where,
        _sum: {
            amount: true
        }
    });

    const pendingIncome = await prisma.order.aggregate({
        where: {
            ...where,
            status: OrderStatus.PENDING
        },
        _sum: {
            amount: true
        }
    });

    const recentTransactions = await prisma.financialTransaction.findMany({
        where: tenantId ? { tenantId } : {},
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            order: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    course: {
                        select: { title: true }
                    }
                }
            }
        }
    });

    return {
        totalIncome: totalIncome._sum.amount || 0,
        pendingIncome: pendingIncome._sum.amount || 0,
        recentTransactions,
        currency: "LKR" // Default as per schema
    };
}

/**
 * Get income chart data (last 30 days)
 */
export async function getIncomeChartData(tenantId?: string, instructorId?: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const where: any = {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: thirtyDaysAgo }
    };

    if (tenantId) where.tenantId = tenantId;
    if (instructorId) where.course = { instructorId };

    const orders = await prisma.order.findMany({
        where,
        select: {
            amount: true,
            createdAt: true
        },
        orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const dailyIncome: Record<string, number> = {};
    
    // Fill in all days first to ensure no gaps
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyIncome[d.toISOString().split('T')[0]] = 0;
    }

    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (dailyIncome[date] !== undefined) {
            dailyIncome[date] += order.amount;
        }
    });

    return Object.entries(dailyIncome)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
