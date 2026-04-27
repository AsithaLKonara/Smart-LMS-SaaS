'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { TextGradient } from '@/components/ui/TextGradient';

const links = [
  {
    title: "Product",
    items: [
      { name: "Features", href: "#features" },
      { name: "Integrations", href: "#integrations" },
      { name: "Pricing", href: "#pricing" },
      { name: "Changelog", href: "/changelog" }
    ]
  },
  {
    title: "Company",
    items: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    items: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Licenses", href: "/licenses" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative z-10 pt-24 pb-12 overflow-hidden border-t border-white/5 bg-transparent backdrop-blur-2xl">
      <div className="container px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-grad-primary flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-heading font-bold text-text-primary tracking-tight">
                Smart<TextGradient>LMS</TextGradient>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The next-generation AI-powered learning management system for modern organizations. Build, manage, and scale your education business.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {links.map((column, i) => (
            <div key={i} className="flex flex-col gap-6">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">{column.title}</h4>
              <ul className="flex flex-col gap-3">
                {column.items.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-text-muted hover:text-accent-purple transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-muted">
            © 2026 SmartLMS SaaS Inc. All rights reserved.
          </p>
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Systems Operational</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <select className="bg-transparent text-[10px] uppercase tracking-widest text-text-muted outline-none cursor-pointer">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
