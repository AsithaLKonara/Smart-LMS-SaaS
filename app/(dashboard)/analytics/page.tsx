import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getTenantStats, getCourseCompletionRates, getRevenueStats } from '@/lib/db/queries/analytics';
import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';
import { AnalyticsCharts } from '@/components/features/analytics/AnalyticsCharts';
import { Container } from '@/components/layout/Container';

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const tenantId = session.user.tenantId;

    const [stats, completionData, revenueData] = await Promise.all([
        getTenantStats(tenantId),
        getCourseCompletionRates(tenantId),
        getRevenueStats(tenantId)
    ]);

    return (
        <div className="pb-20">
            <RefreshPageShell
                title="Analytics"
                subtitle="Measure engagement, retention, and revenue trends across tenants and cohorts."
                stats={[
                    { label: 'Active Students', value: stats.userCount.toLocaleString() },
                    { label: 'Course Completion', value: `${stats.averageGrade.toFixed(1)}%` },
                    { label: 'Pending Reviews', value: stats.pendingSubmissions.toString() },
                    { label: 'Total Enrollments', value: stats.enrollmentCount.toLocaleString() },
                ]}
            />
            <Container className="mt-8">
                <AnalyticsCharts 
                    completionData={completionData} 
                    revenueData={revenueData} 
                />
            </Container>
        </div>
    );
}
