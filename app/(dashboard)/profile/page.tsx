
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ProfileForm } from "@/components/features/settings/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PasswordChangeForm } from "@/components/features/settings/PasswordChangeForm";
import { TwoFactorToggle } from "@/components/features/settings/TwoFactorToggle";
import { Bell, Globe } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    const userFromDb = user ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { isTwoFactorEnabled: true }
    }) : null;

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">Account Settings</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <ProfileForm
                            initialData={{
                                name: user.name || "",
                                email: user.email || "",
                                avatar: user.avatar || undefined,
                            }}
                        />

                        <Card variant="glass" className="glass-hover">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">


                                <PasswordChangeForm />

                                {userFromDb && (
                                    <TwoFactorToggle initialEnabled={userFromDb.isTwoFactorEnabled} />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-8">
                        <Card variant="glass-dark" className="glass-hover">
                            <CardHeader>
                                <CardTitle className="text-lg">Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-4 w-4 text-text-secondary" />
                                        <span className="text-sm text-text-primary">Email Notifications</span>
                                    </div>
                                    <div className="h-5 w-10 bg-accent-cyan/20 rounded-full border border-accent-cyan/30 flex items-center px-1">
                                        <div className="h-3 w-3 bg-accent-cyan rounded-full ml-auto" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-text-secondary" />
                                        <span className="text-sm text-text-primary">Public Profile</span>
                                    </div>
                                    <div className="h-5 w-10 bg-white/10 rounded-full border border-white/10 flex items-center px-1">
                                        <div className="h-3 w-3 bg-white/40 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card variant="glass-dark" className="glass-hover">
                            <CardHeader>
                                <CardTitle className="text-lg">Account Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-center">
                                    <p className="text-accent-purple font-bold uppercase tracking-wider text-xs">{user.role}</p>
                                </div>
                                <p className="text-xs text-text-secondary mt-4 text-center">
                                    Your account is managed by the organization administrator.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
