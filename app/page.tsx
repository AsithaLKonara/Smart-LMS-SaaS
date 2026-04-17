"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Users, BookOpen, Award, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { TextGradient } from "@/components/ui/TextGradient";
import { BackgroundVideo } from "@/components/common/BackgroundVideo";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary overflow-x-hidden relative">
      <BackgroundVideo />
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 flex items-center justify-center z-10">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full -z-10" />

        <div className="container px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent-purple/20 w-fit glass-hover"
            >
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-accent-purple text-xs font-bold uppercase tracking-wider">Next-Gen Learning Platform</span>
            </motion.div>

            <div className="flex flex-col gap-6">
              <h1 className="text-5xl lg:text-7xl font-bold font-heading leading-[1.1] tracking-tight text-text-primary">
                Learn Without <br />
                <TextGradient>Boundaries</TextGradient>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
                The most advanced AI-powered LMS for modern organizations. Build, manage, and scale your education business with ease and precision.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button variant="premium" size="lg" className="hover:scale-105 transition-all h-14 px-8">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="h-14 px-8">
                Watch Demo
                <Play className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background-primary bg-background-secondary overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-text-primary font-bold">1,200+ Students</p>
                <p className="text-text-muted">Already joining our platform</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-premium border border-white/10 glass-dark group">
              <Image
                src="/images/hero.png"
                alt="AI Learning Platform"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-sm">Design & UX Masterclass</p>
                  <p className="text-text-muted text-xs">Instructor: Alex Rivera</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-accent-cyan fill-accent-cyan" />
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden lg:block"
            >
              <Card className="glass shadow-premium border-white/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">98%</p>
                    <p className="text-xs text-text-muted">Completion Rate</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 hidden lg:block"
            >
              <Card className="glass shadow-premium border-white/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">5.0</p>
                    <p className="text-xs text-text-muted">Avg. Rating</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Quick Preview */}
      <section id="features" className="py-24 relative overflow-hidden z-10">
        <div className="container px-6 lg:px-12 text-center flex flex-col items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 max-w-2xl"
          >
            <h2 className="text-4xl font-bold font-heading">Powerful Features for <span className="text-gradient">Modern Teams</span></h2>
            <p className="text-text-secondary text-lg">Everything you need to run a high-performance LMS at scale.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            {[
              { icon: Zap, title: "AI-Powered Tutoring", desc: "Automated insights and personal AI assistants for every learner." },
              { icon: ShieldCheck, title: "Multi-Tenant Core", desc: "Secure isolation for your organization with custom branding." },
              { icon: Users, title: "Advanced Analytics", desc: "Deep dive into engagement, revenue, and cohort performance." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl glass border-white/10 text-left flex flex-col gap-4 group glass-hover glass-hover-glow-cyan"
              >
                <div className="w-14 h-14 rounded-2xl bg-background-primary flex items-center justify-center border border-white/10 group-hover:border-accent-cyan/50 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
