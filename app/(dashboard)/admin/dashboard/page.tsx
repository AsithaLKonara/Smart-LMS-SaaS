import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/db/queries/analytics";
import { KPIStrip } from "@/components/dashboard/KPIStrip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Building2,
    Users,
    BookOpen,
    GraduationCap,
    DollarSign,
    Activity,
    ShieldCheck,
    Zap
} from "lucide-react";
import { TextGradient } from "@/components/ui/TextGradient";
import { motion } from "framer-motion";

export default async function AdminDashboardPage() {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        return redirect("/dashboard");
    }

    const stats = await getAdminStats();

    return (
        <div className="flex flex-col gap-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-heading tracking-tight mb-2">
                        System <TextGradient>Command Center</TextGradient>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Full visibility across the entire SaaS ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-dark border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Secure Access</span>
                    </div>
                </div>
            </div>

            <KPIStrip items={[
                {
                    label: 'Total Tenants',
                    value: stats.totalTenants,
                    icon: Building2,
                    color: 'cyan',
                    change: { value: '+3 new', trend: 'up' }
                },
                {
                    label: 'Global Users',
                    value: stats.totalUsers.toLocaleString(),
                    icon: Users,
                    color: 'purple',
                    change: { value: '+450', trend: 'up' }
                },
                {
                    label: 'System Revenue',
                    value: `$${stats.totalRevenue.toLocaleString()}`,
                    icon: DollarSign,
                    color: 'orange'
                },
                {
                    label: 'Global enrollments',
                    value: stats.totalEnrollments.toLocaleString(),
                    icon: GraduationCap,
                    color: 'green'
                }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass border-white/5 shadow-premium rounded-3xl overflow-hidden relative">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl flex items-center gap-3">
                            <Activity className="w-5 h-5 text-accent-cyan" />
                            System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {[
                                { name: 'Database Connection', status: 'Operational', color: 'green' },
                                { name: 'AI Services (OpenAI)', status: 'Operational', color: 'green' },
                                { name: 'SCORM/LTI Engine', status: 'Operational', color: 'green' },
                                { name: 'Redis Cache Layer', status: 'Optimal', color: 'cyan' },
                                { name: 'Backup Systems', status: 'Synced', color: 'green' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-text-secondary">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider",
                                            item.color === 'green' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                                        )}>
                                            {item.status}
                                        </span>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", item.color === 'green' ? "bg-green-500" : "bg-accent-cyan")} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 shadow-premium rounded-3xl overflow-hidden relative">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl flex items-center gap-3">
                            <Zap className="w-5 h-5 text-accent-purple" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                <Activity className="w-8 h-8 text-text-muted opacity-20" />
                            </div>
                            <p className="text-sm text-text-muted">No critical alerts or recent events needing attention.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
