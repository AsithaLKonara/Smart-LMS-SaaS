'use client';

import * as React from 'react';
import { Search, Bell, Menu, X, Command } from 'lucide-react';
import { OrgSwitcher } from './OrgSwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface TopbarProps {
    currentOrg: {
        id: string;
        name: string;
        subdomain: string;
        logo?: string | null;
        role: string;
    };
    onMenuClick?: () => void;
}

export function Topbar({ currentOrg, onMenuClick }: TopbarProps) {
    return (
        <header className="h-[var(--height-topbar)] bg-transparent backdrop-blur-md border-b border-white/5 sticky top-0 z-30 px-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <OrgSwitcher currentOrg={currentOrg} />
            </div>

            {/* Global Search */}
            <div className="hidden md:flex flex-1 max-w-xl group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    placeholder="Search for courses, students, or reports..."
                    className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-11 pr-16 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/30 focus:bg-white/10 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link href="/notifications" className="p-2.5 rounded-xl glass-light border border-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-purple rounded-full border-2 border-background-primary shadow-neon-purple" />
                </Link>

                {/* Quick Action Button */}
                <Button variant="premium" size="sm" className="hidden lg:flex h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider">
                    Create New
                </Button>
            </div>
        </header>
    );
}
