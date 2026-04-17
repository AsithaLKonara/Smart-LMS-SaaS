"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

const statsData = [
    { value: "250+", label: "Courses by our best mentors" },
    { value: "1000+", label: "Active Students" },
    { value: "15+", label: "Expert Instructors" },
    { value: "2400+", label: "Hours of Content" },
];

export function Stats() {
    return (
        <section className="w-full flex justify-center relative z-10">
            <div
                className={cn(
                    "w-full max-w-[1280px] px-6 md:px-[60px] lg:px-[120px] py-10 md:py-[40px] flex flex-wrap items-center justify-around gap-8 md:gap-4 relative overflow-hidden border-y border-white/10 glass"
                )}
            >
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex flex-col md:flex-row items-center gap-4 md:gap-[45px] flex-1 min-w-[150px]"
                    >
                        <div className="flex flex-col items-center justify-center gap-[6px]">
                            <span
                                className="text-white font-semibold text-2xl md:text-[32px] leading-none font-heading"
                            >
                                {stat.value}
                            </span>
                            <span
                                className="text-white/80 font-normal text-xs md:text-[14px] leading-none text-center"
                            >
                                {stat.label}
                            </span>
                        </div>
                        {index < statsData.length - 1 && (
                            <div
                                className="hidden xl:block w-[55px] h-0 border-t-[4px] border-white/20"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
