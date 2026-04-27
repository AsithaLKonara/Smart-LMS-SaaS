"use client";

import Image from "next/image";
import { TextGradient } from "@/components/ui/TextGradient";
import { motion } from "framer-motion";

export function CertificationCTA() {
    return (
        <section className="w-full bg-transparent py-16 md:py-24 flex justify-center relative z-10">
            <div className="w-full max-w-[1280px] mx-auto px-6 md:px-[60px] lg:px-[120px] flex flex-col md:flex-row items-center gap-12 md:gap-24">
                {/* Visual Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 w-full max-w-[500px] aspect-square relative order-2 md:order-1"
                >
                    <div className="absolute inset-0 bg-accent-cyan/10 blur-[100px] rounded-full" />
                    <div className="relative w-full h-full rounded-[32px] overflow-hidden glass border-white/10 shadow-2xl">
                        <Image
                            src="/student_3.png"
                            alt="Certification and Learning"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent" />
                    </div>
                    {/* Floating Badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 glass-xl border-white/10 rounded-full flex items-center justify-center p-4 shadow-neon-cyan"
                    >
                        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white text-[10px] md:text-sm font-bold text-center uppercase tracking-tighter">Certified<br />Mastery</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 order-1 md:order-2"
                >
                    <h2 className="text-white font-bold font-heading text-3xl md:text-[45px] leading-tight tracking-tight">
                        Earn Global <TextGradient>Certifications</TextGradient> from SmartLMS
                    </h2>
                    <p className="text-text-secondary text-base md:text-lg leading-relaxed">
                        Validate your skills and expertise with industry-recognized credentials.
                        Our comprehensive programs ensure you possess the depth of knowledge
                        needed to excel in your career and stand out in the global marketplace.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <button className="px-8 py-4 rounded-xl bg-white text-background-primary font-bold hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Get Certified
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-transparent text-white border border-white/20 font-bold hover:bg-white/5 hover:border-white/40 transition-all duration-300 backdrop-blur-sm uppercase text-xs tracking-widest">
                            View Programs
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
