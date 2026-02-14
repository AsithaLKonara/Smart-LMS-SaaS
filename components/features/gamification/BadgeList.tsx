
"use client";

import { Award, CheckCircle2, Trophy, Zap, Star, Rocket, Target, BookOpen } from "lucide-react";
import { BadgeType } from "@prisma/client";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";

interface Badge {
    id: string;
    type: BadgeType;
    earnedAt: Date;
}

interface BadgeListProps {
    badges: Badge[];
}

const BADGE_CONFIG: Record<BadgeType, { icon: any; color: string; label: string; description: string }> = {
    FIRST_LESSON: { icon: BookOpen, color: "text-blue-400", label: "Early Learner", description: "Completed your first lesson!" },
    COURSE_COMPLETE: { icon: Trophy, color: "text-yellow-500", label: "Master", description: "Completed a full course!" },
    WEEK_STREAK: { icon: Zap, color: "text-orange-500", label: "Consistent", description: "Maintained a 7-day streak!" },
    MONTH_STREAK: { icon: Rocket, color: "text-purple-500", label: "Dedicated", description: "Maintained a 30-day streak!" },
    PERFECT_SCORE: { icon: Target, color: "text-red-500", label: "Precision", description: "Got 100% on an exam!" },
    EARLY_BIRD: { icon: Star, color: "text-yellow-400", label: "Early Bird", description: "Enrolled within the first hour!" },
    DEDICATED_LEARNER: { icon: Award, color: "text-green-500", label: "Achiever", description: "Earned over 5000 XP!" },
};

export const BadgeList = ({ badges }: BadgeListProps) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Object.entries(BADGE_CONFIG).map(([type, config]) => {
                const earned = badges.find((b) => b.type === type);
                const Icon = config.icon;

                return (
                    <div
                        key={type}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300",
                            earned
                                ? "bg-white/5 border-white/10 shadow-lg shadow-white/5"
                                : "bg-black/20 border-white/5 opacity-30 grayscale"
                        )}
                    >
                        <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center mb-2",
                            earned ? "bg-white/10" : "bg-black/20"
                        )}>
                            <Icon className={cn("h-6 w-6", earned ? config.color : "text-text-muted")} />
                        </div>
                        <p className="text-[10px] font-bold text-center uppercase tracking-tighter text-text-primary">
                            {config.label}
                        </p>
                        {earned && (
                            <p className="text-[8px] text-text-muted mt-1">
                                {format(new Date(earned.earnedAt), "MMM d")}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
