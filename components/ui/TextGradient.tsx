'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface TextGradientProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    to?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    animate?: boolean;
}

export function TextGradient({
    children,
    className,
    from = 'from-accent-cyan',
    to = 'to-accent-purple',
    as: Component = 'span',
    animate = false,
}: TextGradientProps) {
    const content = (
        <Component
            className={cn(
                'bg-clip-text text-transparent bg-gradient-to-r',
                from,
                to,
                className
            )}
        >
            {children}
        </Component>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
            >
                {content}
            </motion.div>
        );
    }

    return content;
}
