import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getTenantStats, getGradebookMatrix } from '@/lib/db/queries/analytics';
import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';
import { Container } from '@/components/layout/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function GradebookPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const tenantId = session.user.tenantId;

    const [stats, matrix] = await Promise.all([
        getTenantStats(tenantId),
        getGradebookMatrix(tenantId)
    ]);

    return (
        <div className="pb-20">
            <RefreshPageShell
                title="Gradebook"
                subtitle="Track grading performance, pending evaluations, and moderation activity."
                stats={[
                    { label: 'Pending Reviews', value: stats.pendingSubmissions.toString() },
                    { label: 'Avg Grade', value: `${stats.averageGrade.toFixed(1)}%` },
                    { label: 'Total Students', value: stats.userCount.toString() },
                    { label: 'Total Invoices', value: '0' }, // Placeholder for now
                ]}
            />
            <Container className="mt-8">
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Student Grade Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-text-secondary text-sm">
                                        <th className="py-4 px-4 font-medium">Student</th>
                                        <th className="py-4 px-4 font-medium">Course</th>
                                        <th className="py-4 px-4 font-medium">Progress</th>
                                        <th className="py-4 px-4 font-medium">Assessments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {matrix.map((student) => (
                                        student.courses.map((course, idx) => (
                                            <tr key={`${student.id}-${idx}`} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 px-4">
                                                    <p className="font-medium text-text-primary">{student.name}</p>
                                                    <p className="text-xs text-text-muted">{student.email}</p>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-text-secondary">
                                                    {course.title}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                                                            <div 
                                                                className="h-full bg-accent-cyan transition-all"
                                                                style={{ width: `${course.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-text-muted">{course.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.grades.map((g, gIdx) => (
                                                            <span 
                                                                key={gIdx}
                                                                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                                    g.score !== null 
                                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                }`}
                                                                title={g.title}
                                                            >
                                                                {g.score !== null ? `${g.score}%` : 'Pending'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
