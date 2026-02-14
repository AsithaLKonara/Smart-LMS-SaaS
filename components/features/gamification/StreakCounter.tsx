
"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakCounterProps {
    count: number;
    className?: string;
}

export const StreakCounter = ({ count, className }: StreakCounterProps) => {
    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500",
            count > 0 ? "animate-pulse-slow shadow-lg shadow-orange-500/10" : "opacity-50 grayscale",
            className
        )}>
            <Flame className={cn("h-4 w-4", count > 0 && "fill-orange-500")} />
            <span className="text-sm font-bold tracking-tight">{count} Day Streak</span>
        </div>
    );
};
