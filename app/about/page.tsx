"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { TextGradient } from "@/components/ui/TextGradient";
import { BackgroundVideo } from "@/components/common/BackgroundVideo";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Target, Rocket, Award, Heart, Shield } from "lucide-react";

const values = [
    {
        icon: Target,
        title: "Our Mission",
        description: "To democratize high-quality education by providing the most advanced AI-powered tools for organizations worldwide.",
        color: "text-accent-cyan",
        bg: "bg-accent-cyan/10",
        border: "border-accent-cyan/20"
    },
    {
        icon: Rocket,
        title: "Our Vision",
        description: "To become the global standard for modern learning ecosystems, bridging the gap between technology and human potential.",
        color: "text-accent-purple",
        bg: "bg-accent-purple/10",
        border: "border-accent-purple/20"
    },
    {
        icon: Users,
        title: "Community First",
        description: "We build for the learners and instructors. Every feature is designed to enhance the human connection in education.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    }
];


export default function AboutPage() {
    return (
        <main className="min-h-screen bg-transparent overflow-x-hidden relative">
            <BackgroundVideo src="/videos/0428.mp4" videoOpacity="opacity-20" overlayOpacity="bg-black/70" />
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative z-10">
                <Container>
                    <div className="flex flex-col items-center text-center gap-8 mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 w-fit"
                        >
                            <span className="text-accent-cyan text-xs font-bold uppercase tracking-widest">Our Story</span>
                        </motion.div>
                        <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight text-text-primary max-w-4xl">
                            Revolutionizing Education with <TextGradient>Intelligent Design</TextGradient>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                            SmartLMS was born from a simple realization: traditional learning management systems were holding back human potential. 
                            We've built a platform that's fast, intuitive, and powered by the latest AI technologies.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <Card variant="glass" className={`h-full border-white/5 hover:${value.border} transition-all group`}>
                                    <CardContent className="p-8 flex flex-col gap-6">
                                        <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                                            <value.icon className={`w-8 h-8 ${value.color}`} />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-2xl font-bold text-text-primary">{value.title}</h3>
                                            <p className="text-text-secondary leading-relaxed">{value.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats/Highlight Section */}
                    <div className="relative rounded-[40px] overflow-hidden glass border border-white/10 p-12 lg:p-20 mb-32">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-grad-primary opacity-10 blur-[100px] -z-10" />
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="flex flex-col gap-8">
                                <h2 className="text-4xl font-bold font-heading text-text-primary">Built for the Future of Learning</h2>
                                <p className="text-text-secondary text-lg leading-relaxed">
                                    We don't just build software; we build experiences. From real-time collaboration to AI-driven insights, 
                                    every pixel is crafted to ensure your students thrive in a digital-first world.
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-4xl font-bold text-accent-cyan">2024</p>
                                        <p className="text-sm text-text-muted uppercase tracking-widest mt-1">Founded</p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-bold text-accent-purple">50+</p>
                                        <p className="text-sm text-text-muted uppercase tracking-widest mt-1">Global Partners</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[Award, Heart, Shield, Rocket].map((Icon, i) => (
                                    <div key={i} className="aspect-square glass border border-white/5 rounded-3xl flex items-center justify-center group hover:border-white/20 transition-all">
                                        <Icon className="w-12 h-12 text-white/20 group-hover:text-white/60 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </Container>
            </section>

            <Footer />
        </main>
    );
}
