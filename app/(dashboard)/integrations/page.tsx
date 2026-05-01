
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { RefreshPageShell } from "@/components/dashboard/RefreshPageShell";
import { VideoIntegrationSettings } from "@/components/features/settings/VideoIntegrationSettings";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Key, Globe, Database } from "lucide-react";

export default async function IntegrationsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const role = session.user.role;
    if (role !== "ADMIN" && role !== "TENANT_ADMIN" && role !== "SUPER_ADMIN") redirect("/dashboard");

    const integrations = await prisma.videoIntegration.findMany({
        where: { tenantId: session.user.tenantId }
    });

    const apiKeys = await prisma.apiKey.findMany({
        where: { tenantId: session.user.tenantId }
    });

    return (
        <div className="pb-20 space-y-12">
            <RefreshPageShell
                title="Integrations & API"
                subtitle="Connect external services and manage API keys for your enterprise ecosystem."
                stats={[
                    { label: 'Active Services', value: integrations.length.toString() },
                    { label: 'API Keys', value: apiKeys.length.toString() },
                    { label: 'Endpoints', value: '14' },
                    { label: 'Avg Latency', value: '12ms' },
                ]}
            />
            
            <Container className="space-y-12">
                {/* 1. Video Integrations */}
                <VideoIntegrationSettings integrations={integrations} />

                {/* 2. API Keys Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <Key className="w-5 h-5 text-accent-purple" /> External API Keys
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Generate keys to allow your internal HRIS or ERP systems to communicate with the SmartLMS API.
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <Card variant="glass-dark">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm uppercase tracking-widest text-text-muted">Active Keys</CardTitle>
                                <button className="text-xs font-bold text-accent-purple hover:underline">+ New Secret Key</button>
                            </CardHeader>
                            <CardContent>
                                {apiKeys.map(key => (
                                    <div key={key.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div>
                                            <p className="font-bold text-sm text-text-primary">{key.name}</p>
                                            <p className="text-[10px] text-text-muted font-mono">{key.prefix}****************</p>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <span className="text-[10px] text-text-muted italic">Last used: Never</span>
                                            <button className="text-red-400 text-xs font-bold hover:underline">Revoke</button>
                                        </div>
                                    </div>
                                ))}
                                {apiKeys.length === 0 && (
                                    <p className="text-sm text-text-muted italic py-4">No API keys generated yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 3. Custom Domain Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <Globe className="w-5 h-5 text-green-400" /> Custom Domains
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            White-label your academy by pointing your own domain (e.g. training.acme.com) to our servers.
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <Card variant="glass" className="bg-green-500/5 border-green-500/10">
                            <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="font-bold text-text-primary">Ready to White-label?</p>
                                    <p className="text-sm text-text-muted max-w-sm mt-2">
                                        Upgrade to an Enterprise plan to unlock custom domains and dedicated SSL certificates.
                                    </p>
                                </div>
                                <button className="mt-2 bg-green-500 text-black font-bold px-6 py-2 rounded-xl text-sm">Upgrade to Enterprise</button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
}
