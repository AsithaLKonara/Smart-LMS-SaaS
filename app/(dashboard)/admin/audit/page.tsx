
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { RefreshPageShell } from "@/components/dashboard/RefreshPageShell";
import { AuditLogTable } from "@/components/features/admin/AuditLogTable";
import { Container } from "@/components/layout/Container";

export default async function AuditLogsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/dashboard");

    const logs = await prisma.auditLog.findMany({
        where: role === 'SUPER_ADMIN' ? {} : { tenantId: session.user.tenantId },
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
            actor: { select: { name: true } }
        }
    });

    return (
        <div className="pb-20">
            <RefreshPageShell
                title="Security Audit Logs"
                subtitle="Comprehensive trail of all administrative and system-level events."
                stats={[
                    { label: 'Total Events', value: logs.length.toString() },
                    { label: 'Critical Actions', value: logs.filter(l => l.action.includes('DELETE')).length.toString() },
                    { label: 'Retention', value: '365 Days' },
                    { label: 'Compliance', value: 'SOC2 Ready' },
                ]}
            />
            <Container className="mt-8">
                <AuditLogTable logs={logs} />
            </Container>
        </div>
    );
}
