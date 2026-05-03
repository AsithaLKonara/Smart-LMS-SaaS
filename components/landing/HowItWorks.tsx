"use client";

import { cn } from "@/lib/utils/cn";
import { Search, CreditCard, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        id: 1,
        title: "Browse courses",
        description: "Explore our wide range of world-class courses designed by industry experts.",
        icon: <Search className="w-8 h-8 text-white" />,
        tech: "Discover",
        techClass: "from-accent-cyan/20 to-accent-cyan/5",
    },
    {
        id: 2,
        title: "Enroll & pay",
        description: "Start your journey with our secure and flexible payment options.",
        icon: <CreditCard className="w-8 h-8 text-white" />,
        tech: "Payment",
        techClass: "from-accent-purple/20 to-accent-purple/5",
    },
    {
        id: 3,
        title: "Start Learning",
        description: "Access high-quality content and start building your future today.",
        icon: <BookOpen className="w-8 h-8 text-white" />,
        tech: "Mastery",
        techClass: "from-blue-500/20 to-blue-400/5",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full bg-transparent py-20 flex justify-center border-y border-white/10 relative z-10">
            <div className="w-full max-w-[1280px] mx-auto px-6 md:px-[60px] lg:px-[120px] flex flex-col items-center gap-16">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center gap-4 text-center"
                >
                    <h2 className="text-white font-bold font-heading text-3xl md:text-4xl tracking-tight">
                        How it works?
                    </h2>
                    <div className="w-20 h-1 bg-grad-primary rounded-full shadow-neon-purple" />
                </motion.div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {steps.map((step) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: step.id * 0.15 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl glass border-white/10 glass-hover glass-hover-glow-purple"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-background-primary flex items-center justify-center font-bold shadow-xl z-20">
                                {step.id}
                            </div>

                            {/* Icon / Tech Visual */}
                            <div className="relative w-24 h-24 flex items-center justify-center animate-pulse">
                                {/* Outer Ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-white/10 group-hover:border-accent-cyan/30 transition-colors duration-500" />
                                {/* Tech Logo Placeholder */}
                                <div className={cn(
                                    "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center z-10",
                                    step.techClass
                                )}>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                                        {step.tech}
                                    </span>
                                </div>
                                {/* Floating Icon */}
                                <div className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-background-primary border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col items-center text-center gap-3">
                                <h3 className="text-white font-bold font-heading text-xl md:text-2xl h-[40px] flex items-center">
                                    {step.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector (Desktop only) */}
                            {step.id < steps.length && (
                                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
