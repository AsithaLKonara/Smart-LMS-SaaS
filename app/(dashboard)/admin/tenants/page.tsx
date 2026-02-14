
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getAllTenants } from "@/lib/db/queries/tenants";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Globe, Users, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default async function AdminTenantsPage() {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        return redirect("/dashboard");
    }

    const tenants = await getAllTenants();

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">Tenant Management</h1>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Tenant
                    </Button>
                </div>

                <div className="grid gap-4">
                    {tenants.map((tenant) => (
                        <Card key={tenant.id} variant="elevated" className="group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-background-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                                            {tenant.logo ? (
                                                <img src={tenant.logo} alt={tenant.name} className="h-full w-full object-contain" />
                                            ) : (
                                                <Globe className="h-6 w-6 text-accent-cyan" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                                                {tenant.name}
                                            </h3>
                                            <p className="text-sm text-text-secondary">{tenant.subdomain}.smartlms.com</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-accent-purple" />
                                            <div className="text-sm">
                                                <p className="text-text-primary font-medium">{tenant._count.users}</p>
                                                <p className="text-[10px] text-text-secondary uppercase">Users</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-orange-500" />
                                            <div className="text-sm">
                                                <p className="text-text-primary font-medium">{tenant._count.courses}</p>
                                                <p className="text-[10px] text-text-secondary uppercase">Courses</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${tenant.plan === 'ENTERPRISE' ? 'bg-accent-purple/10 border-accent-purple/20 text-accent-purple' :
                                                    tenant.plan === 'PRO' ? 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan' :
                                                        'bg-background-secondary border-white/10 text-text-secondary'
                                                }`}>
                                                {tenant.plan}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4 hidden md:block">
                                            <p className="text-xs text-text-secondary">Created</p>
                                            <p className="text-sm font-medium text-text-primary">{format(new Date(tenant.createdAt), 'MMM yyyy')}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {tenants.length === 0 && (
                        <div className="p-12 text-center text-text-secondary border border-dashed border-white/10 rounded-xl">
                            No tenants registered.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
