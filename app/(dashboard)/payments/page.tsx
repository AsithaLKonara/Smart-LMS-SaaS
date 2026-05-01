
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getFinancialSummary, getIncomeChartData } from "@/lib/db/queries/finance";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
    TrendingUp, 
    DollarSign, 
    CreditCard, 
    ArrowUpRight, 
    ArrowDownRight,
    Clock,
    CheckCircle2,
    XCircle,
    User
} from "lucide-react";
import { format } from "date-fns";
import { FinanceChart } from "@/components/features/finance/FinanceChart";
import { AuthUser, hasPermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/constants/permissions";

export default async function PaymentsMonitoringPage() {
    const session = await auth();
    if (!session?.user) return redirect("/login");

    const user = session.user as AuthUser;
    
    // Check permission
    if (!hasPermission(user, PERMISSIONS.FINANCE_VIEW)) {
        return redirect("/dashboard");
    }

    const isPlatformAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
    
    // Scoping logic
    const tenantId = isPlatformAdmin ? undefined : user.tenantId;
    const instructorId = user.role === "INSTRUCTOR" ? user.id : undefined;

    const [summary, chartData] = await Promise.all([
        getFinancialSummary(tenantId, instructorId),
        getIncomeChartData(tenantId, instructorId)
    ]);

    const stats = [
        {
            title: "Total Revenue",
            value: `${summary.currency} ${summary.totalIncome.toLocaleString()}`,
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
            color: "text-emerald-400"
        },
        {
            title: "Pending",
            value: `${summary.currency} ${summary.pendingIncome.toLocaleString()}`,
            icon: Clock,
            trend: "Awaiting verification",
            trendUp: false,
            color: "text-amber-400"
        },
        {
            title: "Transactions",
            value: summary.recentTransactions.length.toString(),
            icon: CreditCard,
            trend: "Last 30 days",
            trendUp: true,
            color: "text-accent-purple"
        },
        {
            title: "Avg. Sale",
            value: `${summary.currency} ${(summary.totalIncome / (summary.recentTransactions.length || 1)).toFixed(0)}`,
            icon: TrendingUp,
            trend: "+5.2%",
            trendUp: true,
            color: "text-accent-cyan"
        }
    ];

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <Container className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                            Payments Monitoring
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {isPlatformAdmin 
                                ? "Global financial overview across all tenants." 
                                : "Financial performance and transaction history."}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <Card key={i} variant="elevated" className="overflow-hidden group hover:border-white/20 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${stat.trendUp ? 'text-emerald-400' : 'text-text-muted'}`}>
                                        {stat.trendUp && <ArrowUpRight className="h-3 w-3" />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-text-secondary font-medium">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <Card variant="elevated" className="lg:col-span-2 border-white/5 bg-background-secondary/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-accent-cyan" />
                                Revenue Overview (Last 30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px] w-full pt-4">
                            <FinanceChart data={chartData} />
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card variant="elevated" className="border-white/5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Live Feed</CardTitle>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {summary.recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                                                {tx.order?.user.name ? (
                                                    <span className="text-xs font-bold text-accent-purple">{tx.order.user.name[0]}</span>
                                                ) : (
                                                    <User className="h-5 w-5 text-text-muted" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                                                    {tx.order?.user.name || "Anonymous"}
                                                </p>
                                                <p className="text-[10px] text-text-secondary truncate max-w-[120px]">
                                                    {tx.order?.course?.title || "Direct Payment"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-text-primary">
                                                +{summary.currency} {tx.amount.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-text-muted">
                                                {format(new Date(tx.createdAt), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {summary.recentTransactions.length === 0 && (
                                    <div className="text-center py-12">
                                        <Clock className="h-10 w-10 text-white/5 mx-auto mb-2" />
                                        <p className="text-xs text-text-muted">No recent transactions</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Table */}
                <Card variant="elevated" className="mt-8 border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-secondary">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {summary.recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4 font-mono text-[10px] text-text-muted">{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                tx.type === 'INFLOW' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-text-primary">
                                            {summary.currency} {tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Success
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-text-secondary">
                                            {format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Container>
        </div>
    );
}
