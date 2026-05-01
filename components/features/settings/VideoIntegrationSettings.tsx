
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Video, ShieldCheck, ExternalLink, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

interface VideoIntegrationSettingsProps {
    integrations: any[];
}

export function VideoIntegrationSettings({ integrations }: VideoIntegrationSettingsProps) {
    const [isConfiguring, setIsConfiguring] = useState<string | null>(null);

    const providers = [
        { id: 'YOUTUBE', name: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', description: 'Embed unlisted videos with restricted controls.' },
        { id: 'VIMEO', name: 'Vimeo', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384063.png', description: 'Advanced privacy and professional player controls.' },
        { id: 'BUNNY_NET', name: 'Bunny.net', icon: 'https://bunny.net/static/bunny-logo.svg', description: 'Enterprise-grade Stream with HLS encryption.' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Video className="w-5 h-5 text-accent-cyan" /> Video Streaming Providers
                </h3>
                <p className="text-sm text-text-secondary">
                    Connect your external video hosting accounts to serve non-downloadable content to your students.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(provider => {
                    const isConnected = integrations.some(i => i.provider === provider.id);
                    return (
                        <Card key={provider.id} variant="glass" className={isConnected ? "border-accent-cyan/20" : ""}>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                                        <img src={provider.icon} alt={provider.name} className="w-6 h-6 object-contain" />
                                    </div>
                                    {isConnected && (
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-accent-cyan uppercase bg-accent-cyan/10 px-2 py-0.5 rounded-full">
                                            <ShieldCheck className="w-3 h-3" /> Connected
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">{provider.name}</h4>
                                    <p className="text-xs text-text-muted leading-relaxed mt-1">{provider.description}</p>
                                </div>
                                <Button 
                                    variant={isConnected ? "ghost" : "premium"} 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => setIsConfiguring(provider.id)}
                                >
                                    {isConnected ? "Configure" : "Connect Provider"}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {isConfiguring && (
                <Card variant="glass-dark" className="border-accent-cyan/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-accent-cyan" /> 
                            Configure {isConfiguring}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary font-bold uppercase tracking-wider">API Key / Access Token</label>
                                <input 
                                    type="password"
                                    className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                                    placeholder="Enter your key..."
                                />
                            </div>
                            {isConfiguring === 'BUNNY_NET' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary font-bold uppercase tracking-wider">Stream Library ID</label>
                                    <input 
                                        className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                                        placeholder="Library ID from Bunny.net"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <Button onClick={() => {
                                toast.success(`${isConfiguring} integrated successfully`);
                                setIsConfiguring(null);
                            }}>
                                Save Integration
                            </Button>
                            <Button variant="ghost" onClick={() => setIsConfiguring(null)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
