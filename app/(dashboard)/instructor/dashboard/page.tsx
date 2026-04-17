import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getInstructorStats, getInstructorChartData } from "@/lib/db/queries/analytics";
import { KPIStrip } from "@/components/dashboard/KPIStrip";
import {
    BookOpen,
    DollarSign,
    Users,
    Star,
    TrendingUp,
    Activity
} from "lucide-react";
import { EnrollmentChart } from "@/components/features/analytics/EnrollmentChart";
import { RevenueChart } from "@/components/features/analytics/RevenueChart";
import { TextGradient } from "@/components/ui/TextGradient";
import { motion } from "framer-motion";

export default async function InstructorDashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return redirect("/");
    }

    const { totalCourses, totalStudents, totalRevenue, averageRating } = await getInstructorStats(userId);
    const chartData = await getInstructorChartData(userId);

    return (
        <div className="flex flex-col gap-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-heading tracking-tight mb-2">
                        Instructor <TextGradient>Power-up</TextGradient>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Your courses are reaching new heights. Here's your performance breakdown.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-dark border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Live Stats</span>
                    </div>
                </div>
            </div>

            <KPIStrip items={[
                {
                    label: 'Total Revenue',
                    value: `$${totalRevenue.toLocaleString()}`,
                    icon: DollarSign,
                    color: 'cyan',
                    change: { value: '+$1,240', trend: 'up' }
                },
                {
                    label: 'Active Students',
                    value: totalStudents.toLocaleString(),
                    icon: Users,
                    color: 'purple',
                    change: { value: '+180', trend: 'up' }
                },
                {
                    label: 'Published Courses',
                    value: totalCourses,
                    icon: BookOpen,
                    color: 'orange'
                },
                {
                    label: 'Course Rating',
                    value: averageRating,
                    icon: Star,
                    color: 'green',
                    change: { value: '4.9/5', trend: 'up' }
                }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass border border-white/5 rounded-3xl p-6 shadow-premium overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <RevenueChart data={chartData} />
                </div>
                <div className="glass border border-white/5 rounded-3xl p-6 shadow-premium overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity className="w-32 h-32" />
                    </div>
                    <EnrollmentChart data={chartData} />
                </div>
            </div>
        </div>
    );
}
