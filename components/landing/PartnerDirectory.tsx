
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Globe, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PartnerDirectoryProps {
    partners: any[];
}

export function PartnerDirectory({ partners }: PartnerDirectoryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, i) => (
                <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card variant="glass" className="h-full hover:border-accent-cyan/40 transition-all group">
                        <CardContent className="p-0">
                            <div className="h-32 bg-grad-primary relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                                {partner.logo && (
                                    <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-background-primary border-4 border-background-secondary shadow-premium overflow-hidden">
                                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="p-6 pt-12 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                                        {partner.name}
                                    </h3>
                                    {partner.verifiedAt && (
                                        <ShieldCheck className="w-5 h-5 text-accent-cyan" />
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                                    {partner.publicDescription || partner.tagline || "No description provided."}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase bg-white/5 px-2 py-0.5 rounded-full">
                                        <MapPin className="w-3 h-3" /> {partner.timezone || 'Global'}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-accent-purple uppercase bg-accent-purple/10 px-2 py-0.5 rounded-full">
                                        {partner.plan} Provider
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button variant="premium" size="sm" className="flex-1">
                                        Visit Academy
                                    </Button>
                                    <Button variant="glass" size="sm" className="px-3">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
