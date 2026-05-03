"use client";

import Link from "next/link";
import { MoveRight, Play, Users, BookOpen, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-transparent backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="w-8 h-8 rounded-lg bg-grad-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight">
            Smart<span className="text-accent-cyan">LMS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/saaslanding#features" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">Features</Link>
          <Link href="/saaslanding#pricing" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">Pricing</Link>
          <Link href="/institutes" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">Institutes</Link>
          <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button variant="premium" size="sm" className="shadow-neon-purple hover:shadow-neon-cyan hover:scale-105 transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
