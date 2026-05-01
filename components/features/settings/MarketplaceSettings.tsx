
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Globe, ShieldCheck, Share2, Type } from 'lucide-react';
import { updateTenantBrandingAction } from '@/app/actions/tenant'; // I'll update this action later
import { toast } from 'sonner';

interface MarketplaceSettingsProps {
    initialData: {
        isPartner: boolean;
        publicDescription: string;
        tagline: string;
        websiteUrl: string;
    };
}

export function MarketplaceSettings({ initialData }: MarketplaceSettingsProps) {
    const [formData, setFormData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            // Reusing branding action but extending it
            const res = await updateTenantBrandingAction(formData as any);
            if (res.success) {
                toast.success("Public profile updated");
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-accent-cyan" /> Marketplace Visibility
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="space-y-1">
                            <p className="font-bold text-text-primary flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent-cyan" /> Show in Partner Directory
                            </p>
                            <p className="text-xs text-text-secondary">Display your academy on our public marketplace to attract new students.</p>
                        </div>
                        <input 
                            type="checkbox"
                            className="w-6 h-6 rounded bg-accent-cyan"
                            checked={formData.isPartner}
                            onChange={e => setFormData({...formData, isPartner: e.target.checked})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Catchy Tagline</label>
                            <input 
                                className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                                placeholder="The Future of Engineering Education"
                                value={formData.tagline}
                                onChange={e => setFormData({...formData, tagline: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Website URL</label>
                            <input 
                                className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                                placeholder="https://academy.com"
                                value={formData.websiteUrl}
                                onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Public Description</label>
                        <textarea 
                            className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary h-32 focus:ring-1 focus:ring-accent-cyan outline-none"
                            placeholder="Tell the world about your mission, courses, and why students should choose you..."
                            value={formData.publicDescription}
                            onChange={e => setFormData({...formData, publicDescription: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <Button variant="premium" onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Publish to Marketplace'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
