
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Globe, ShieldCheck, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import Link from 'next/link';

interface InstituteDirectoryProps {
    institutes: any[];
}

export function InstituteDirectory({ institutes }: InstituteDirectoryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutes.map((institute, i) => (
                <motion.div
                    key={institute.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Link href={`/institutes/${institute.subdomain}`}>
                        <Card variant="glass" className="h-full hover:border-accent-cyan/40 transition-all group cursor-pointer overflow-hidden">
                            <CardContent className="p-0">
                                <div 
                                    className="h-32 relative overflow-hidden"
                                    style={{ backgroundColor: institute.accentColor || '#22D3EE' }}
                                >
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                                    {institute.logo && (
                                        <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-background-primary border-4 border-background-secondary shadow-premium overflow-hidden z-10">
                                            <img src={institute.logo} alt={institute.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 pt-12 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                                            {institute.name}
                                        </h3>
                                        {institute.verifiedAt && (
                                            <ShieldCheck className="w-5 h-5 text-accent-cyan" />
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed min-h-[4.5rem]">
                                        {institute.publicDescription || institute.tagline || "Providing quality education through our digital academy."}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                            <MapPin className="w-3 h-3" /> {institute.timezone || 'Global'}
                                        </div>
                                        <div 
                                            className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                                            style={{ 
                                                backgroundColor: `${institute.accentColor}15` || '#22D3EE15',
                                                color: institute.accentColor || '#22D3EE',
                                                borderColor: `${institute.accentColor}30` || '#22D3EE30'
                                            }}
                                        >
                                            {institute.plan} Academy
                                        </div>
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <Button 
                                            variant="glass" 
                                            size="sm" 
                                            className="flex-1 group-hover:bg-white/10"
                                        >
                                            View Details
                                        </Button>
                                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent-cyan/30">
                                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-cyan" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
