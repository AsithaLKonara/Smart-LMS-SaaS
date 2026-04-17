'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface KPIItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    change?: {
        value: string | number;
        trend: 'up' | 'down';
    };
    color: 'cyan' | 'purple' | 'green' | 'orange';
}

interface KPIStripProps {
    items: KPIItem[];
}

const colorMap = {
    cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 shadow-neon-cyan',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20 shadow-neon-purple',
    green: 'text-green-400 bg-green-400/10 border-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.2)]',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20 shadow-[0_0_20px_rgba(251,146,60,0.2)]',
};

export function KPIStrip({ items }: KPIStripProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                    <Card className="glass border-white/5 group hover:border-white/20 transition-all duration-500 overflow-hidden relative">
                        {/* Background Glow */}
                        <div className={cn(
                            "absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 rounded-full -z-10 transition-opacity group-hover:opacity-30",
                            item.color === 'cyan' ? 'bg-accent-cyan' :
                                item.color === 'purple' ? 'bg-accent-purple' :
                                    item.color === 'green' ? 'bg-green-400' : 'bg-orange-400'
                        )} />

                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                                    colorMap[item.color]
                                )}>
                                    <item.icon className="w-6 h-6" />
                                </div>

                                {item.change && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border",
                                        item.change.trend === 'up'
                                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                                            : "text-red-400 bg-red-400/10 border-red-400/20"
                                    )}>
                                        {item.change.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {item.change.value}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{item.label}</p>
                                <h3 className="text-3xl font-bold font-heading tracking-tight text-text-primary">
                                    {item.value}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
