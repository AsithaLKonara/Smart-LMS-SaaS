'use client';

import { Container } from '@/components/layout/Container';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { BackgroundVideo } from '@/components/common/BackgroundVideo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <BackgroundVideo />
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 blur-[120px] rounded-full -z-10 animate-pulse" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-8">
        {/* Auth Header */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-neon-purple transition-transform group-hover:scale-110">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight">
              Smart<span className="text-accent-cyan">LMS</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>

        {/* Auth Footer */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            &copy; 2026 SmartLMS SaaS. All rights reserved. <br />
            Built for modern learning organizations.
          </p>
        </div>
      </div>
    </div>
  );
}
