"use client";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
    {
        title: "Interactive Videos",
        description: "Experience learning like never before with high-quality interactive video modules.",
        image: "/feature_videos.png",
    },
    {
        title: "Secure Payments",
        description: "Flexible and secure payment options tailored for students and organizations.",
        image: "/feature_payments.png",
    },
    {
        title: "Real-time Support",
        description: "Connect with instructors and peers instantly through our integrated support system.",
        image: "/feature_support.png",
    },
];

export function FeaturesGrid() {
    return (
        <section className="w-full bg-transparent py-16 md:py-[73px] flex flex-col items-center gap-8 md:gap-[33px]">
            <div className="max-w-[1280px] px-6 md:px-[60px] lg:px-[120px] w-full flex flex-col items-center gap-8 md:gap-[33px]">
                <h2 className="text-white font-bold font-heading text-2xl md:text-[32px] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Premium Learning Experience
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full place-items-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={cn(
                                "w-full max-w-[350px] aspect-[1.46/1] md:h-[240px] rounded-2xl p-6 flex flex-col justify-end gap-2 relative overflow-hidden group transition-all duration-500",
                                "glass border-white/10 glass-hover glass-hover-glow-purple"
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 to-background-primary opacity-90 pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                                <h3 className="text-white font-bold text-[18px] tracking-tight font-heading">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary text-[13px] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
