
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getAllUsers, getUsersByTenant } from "@/lib/db/queries/users";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserPlus, Mail, Shield, User } from "lucide-react";
import { format } from "date-fns";
import { hasPermission, AuthUser } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/constants/permissions";
import { RoleSelector } from "@/components/features/admin/RoleSelector";

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session?.user) return redirect("/login");

    const user = session.user as AuthUser;
    const isPlatformAdmin = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
    const canInvite = hasPermission(user, PERMISSIONS.USER_INVITE);

    // RBAC Hardening: Filter users by tenant if not a platform admin
    const users = isPlatformAdmin 
        ? await getAllUsers() 
        : await getUsersByTenant(user.tenantId);

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <Container className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            {isPlatformAdmin ? "Global User Directory" : "Institute Members"}
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {isPlatformAdmin 
                                ? "Managing all users across the entire platform." 
                                : `Managing members for your organization.`}
                        </p>
                    </div>
                    {canInvite && (
                        <Button className="gap-2 bg-accent-purple hover:bg-accent-purple/90">
                            <UserPlus className="h-4 w-4" />
                            Invite Member
                        </Button>
                    )}
                </div>

                <div className="grid gap-4">
                    {users.map((u) => (
                        <Card key={u.id} variant="elevated" className="group">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-background-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                                            {u.avatar ? (
                                                <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-text-muted" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                                {u.name}
                                                {u.role === 'SUPER_ADMIN' && <Shield className="w-3 h-3 text-accent-cyan" />}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span>
                                                {isPlatformAdmin && (u as any).tenant && (
                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                                                        {(u as any).tenant.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <RoleSelector 
                                                userId={u.id} 
                                                currentRole={u.role} 
                                                currentUserRole={user.role as string}
                                            />
                                            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tight">Joined {format(new Date(u.createdAt), 'MMM d, yyyy')}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="hidden md:flex">Manage</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {users.length === 0 && (
                        <div className="p-12 text-center text-text-secondary border border-dashed border-white/10 rounded-xl">
                            No members found.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}
