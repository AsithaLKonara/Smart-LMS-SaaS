
import { type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    className?: string;
}

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    className
}: EmptyStateProps) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01]",
            className
        )}>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 mb-6 group-hover:scale-110 transition-transform">
                <Icon className="h-10 w-10 text-text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">{title}</h3>
            <p className="text-text-secondary text-sm max-w-[280px] mb-8 leading-relaxed">
                {description}
            </p>
            {actionLabel && actionHref && (
                <Link href={actionHref} className={cn(buttonVariants({ variant: 'primary' }), "shadow-lg shadow-accent-purple/20")}>
                    {actionLabel}
                </Link>
            )}
        </div>
    );
};
