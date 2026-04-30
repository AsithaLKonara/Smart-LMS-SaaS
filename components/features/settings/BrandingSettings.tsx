
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { updateTenantBrandingAction } from '@/app/actions/tenant';
import { toast } from 'sonner';
import { Palette, Upload, Globe } from 'lucide-react';

interface BrandingSettingsProps {
    initialData: {
        name: string;
        logo: string;
        accentColor: string;
    };
}

export function BrandingSettings({ initialData }: BrandingSettingsProps) {
    const [formData, setFormData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const res = await updateTenantBrandingAction(formData);
            if (res.success) {
                toast.success("Branding updated successfully");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-accent-cyan" /> Visual Identity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary uppercase tracking-wider font-bold">Organization Name</label>
                            <input 
                                className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary uppercase tracking-wider font-bold">Accent Color</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color"
                                        className="h-10 w-10 bg-transparent border-none cursor-pointer"
                                        value={formData.accentColor}
                                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                                    />
                                    <input 
                                        className="flex-1 bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-text-primary"
                                        value={formData.accentColor}
                                        onChange={e => setFormData({...formData, accentColor: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <Button variant="premium" onClick={handleSave} disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="glass-dark">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-accent-purple" /> Logo Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-8">
                        <div className="w-32 h-32 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                            {formData.logo ? (
                                <img src={formData.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <Palette className="w-8 h-8 text-text-muted" />
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <p className="text-sm text-text-secondary italic">
                                Preferred size: 512x512px. Supports PNG, SVG, and JPEG.
                            </p>
                            <input 
                                className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-2 text-xs text-text-muted"
                                placeholder="Paste logo URL here..."
                                value={formData.logo}
                                onChange={e => setFormData({...formData, logo: e.target.value})}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                <Card variant="glass" className="bg-gradient-to-br from-accent-cyan/5 to-transparent border-accent-cyan/10">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Live Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-white/10 p-4 bg-background-primary shadow-2xl scale-95 origin-top">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-md" style={{ backgroundColor: formData.accentColor }} />
                                <span className="font-bold text-xs">{formData.name || 'Your Brand'}</span>
                            </div>
                            <div className="h-2 w-2/3 bg-white/10 rounded-full mb-2" />
                            <div className="h-2 w-full bg-white/5 rounded-full mb-6" />
                            <div 
                                className="h-8 w-full rounded-lg text-[10px] flex items-center justify-center font-bold"
                                style={{ backgroundColor: formData.accentColor, color: '#000' }}
                            >
                                Action Button
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
