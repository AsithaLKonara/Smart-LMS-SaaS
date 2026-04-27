"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TextGradient } from "@/components/ui/TextGradient";
import { BackgroundVideo } from "@/components/common/BackgroundVideo";

// Landing Sections
import { Stats } from "@/components/landing/Stats";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { AISection } from "@/components/landing/AISection";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { Integrations } from "@/components/landing/Integrations";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CertificationCTA } from "@/components/landing/CertificationCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden relative">
      <BackgroundVideo src="/videos/0428.mp4" videoOpacity="opacity-30" overlayOpacity="bg-black/50" />
      <Header />

      {/* 1. Hero Section */}
      <section className="relative w-full py-20 lg:py-32 flex items-center justify-center z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full -z-10" />

        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden lg:block"
            >
              <Card variant="glass" className="shadow-premium border-white/10 p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">98%</p>
                    <p className="text-xs text-text-muted">Completion Rate</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Social Proof Section */}
      <Stats />

      {/* 3. Problem Statement Section */}
      <ProblemStatement />

      {/* 4. Features Section */}
      <FeaturesGrid />

      {/* 5. How It Works Section */}
      <HowItWorks />

      {/* 6. Use Cases Section */}
      <UseCases />

      {/* 7. AI Section */}
      <AISection />

      {/* 8. Analytics Section */}
      <AnalyticsSection />

      {/* 9. Integrations Section */}
      <Integrations />

      {/* 10. Pricing Section */}
      <Pricing />

      {/* 11. FAQ Section */}
      <FAQ />

      {/* 12. Final CTA Section */}
      <CertificationCTA />

      {/* 13. Footer Section */}
      <Footer />
    </main>
  );
}
