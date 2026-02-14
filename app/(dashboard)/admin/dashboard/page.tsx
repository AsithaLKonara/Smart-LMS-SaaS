
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/db/queries/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { Building2, Users, BookOpen, GraduationCap, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        return redirect("/dashboard");
    }

    const stats = await getAdminStats();

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                <h1 className="text-3xl font-bold text-text-primary mb-8">System Admin Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">Total Tenants</CardTitle>
                            <Building2 className="h-4 w-4 text-accent-cyan" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats.totalTenants}</div>
                            <p className="text-xs text-text-muted mt-1">Active SaaS Organizations</p>
                        </CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">Platform Users</CardTitle>
                            <Users className="h-4 w-4 text-accent-purple" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats.totalUsers}</div>
                            <p className="text-xs text-text-muted mt-1">Across all tenants</p>
                        </CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">${stats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-text-muted mt-1">Gross lifetime revenue</p>
                        </CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">Global Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats.totalCourses}</div>
                            <p className="text-xs text-text-muted mt-1">Courses created platform-wide</p>
                        </CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">Total Enrollments</CardTitle>
                            <GraduationCap className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats.totalEnrollments}</div>
                            <p className="text-xs text-text-muted mt-1">Student registrations</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>System Health</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-secondary">Database Connection</span>
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-secondary">AI Service (OpenAI)</span>
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-text-secondary">SaaS Infrastructure</span>
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Operational</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-secondary">Recent system-wide events will appear here.</p>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
