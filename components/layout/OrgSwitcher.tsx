'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    ChevronDown,
    Check,
    Plus,
    Search,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface Organization {
    id: string;
    name: string;
    subdomain: string;
    logo?: string | null;
    role: string;
}

interface OrgSwitcherProps {
    currentOrg: Organization;
    userOrganizations?: Organization[];
}

export function OrgSwitcher({ currentOrg, userOrganizations = [] }: OrgSwitcherProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // For now, if no other orgs are provided, we just show the current one
    const orgs = userOrganizations.length > 0 ? userOrganizations : [currentOrg];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300",
                    "glass-light border border-white/5 hover:bg-white/10 hover:border-white/20",
                    isOpen && "bg-white/10 border-white/20"
                )}
            >
                <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center p-1 overflow-hidden shadow-neon-purple">
                    {currentOrg.logo ? (
                        <img src={currentOrg.logo} alt={currentOrg.name} className="w-full h-full object-contain" />
                    ) : (
                        <Building2 className="w-5 h-5 text-white" />
                    )}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                    <span className="text-xs font-bold text-text-primary leading-tight">{currentOrg.name}</span>
                    <span className="text-[10px] text-text-muted leading-tight">{currentOrg.subdomain}.lms.com</span>
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 text-text-muted transition-transform duration-300",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 top-full mt-2 w-72 glass border border-white/10 shadow-premium p-2 z-50 rounded-2xl overflow-hidden"
                        >
                            <div className="px-3 py-2">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Your Organizations</p>
                            </div>

                            <div className="space-y-1 mt-1">
                                {orgs.map((org) => (
                                    <button
                                        key={org.id}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-left",
                                            org.id === currentOrg.id
                                                ? "bg-accent-cyan/10 text-accent-cyan"
                                                : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center p-1 border border-white/10">
                                            {org.logo ? (
                                                <img src={org.logo} alt={org.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{org.name}</p>
                                            <p className="text-[10px] text-text-muted truncate">{org.role}</p>
                                        </div>
                                        {org.id === currentOrg.id && (
                                            <Check className="w-4 h-4 text-accent-cyan" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-2 pt-2 border-t border-white/10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs font-medium text-text-secondary hover:text-text-primary h-9"
                                >
                                    <Plus className="mr-2 w-4 h-4" />
                                    Create Library
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-xs font-medium text-text-secondary hover:text-text-primary h-9"
                                >
                                    <Settings className="mr-2 w-4 h-4" />
                                    Management
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
