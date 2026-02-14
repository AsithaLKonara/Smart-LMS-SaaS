
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getInstructorStats, getInstructorChartData } from "@/lib/db/queries/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { BookOpen, DollarSign, Users, Star } from "lucide-react";
import { EnrollmentChart } from "@/components/features/analytics/EnrollmentChart";
import { RevenueChart } from "@/components/features/analytics/RevenueChart";

export default async function InstructorDashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { totalCourses, totalStudents, totalRevenue, averageRating } = await getInstructorStats(userId);
    const chartData = await getInstructorChartData(userId);

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                <h1 className="text-3xl font-bold text-text-primary mb-8">
                    Instructor Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-accent-cyan" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                ${totalRevenue.toLocaleString()}
                            </div>
                            <p className="text-xs text-text-muted mt-1">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">
                                Enrolled Students
                            </CardTitle>
                            <Users className="h-4 w-4 text-accent-purple" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {totalStudents.toLocaleString()}
                            </div>
                            <p className="text-xs text-text-muted mt-1">+180 new students</p>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">
                                Active Courses
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {totalCourses.toLocaleString()}
                            </div>
                            <p className="text-xs text-text-muted mt-1">+2 new this month</p>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">
                                Average Rating
                            </CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-text-primary">
                                {averageRating}
                            </div>
                            <p className="text-xs text-text-muted mt-1">Based on 124 reviews</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RevenueChart data={chartData} />
                    <EnrollmentChart data={chartData} />
                </div>
            </Container>
        </div>
    );
}
