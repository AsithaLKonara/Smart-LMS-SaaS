'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';
import { 
  Chrome, 
  Slack, 
  Github, 
  CreditCard, 
  Video, 
  MessageSquare,
  Zap,
  Shield
} from 'lucide-react';

const integrations = [
  { name: "Zoom", icon: Video, color: "text-blue-500" },
  { name: "Stripe", icon: CreditCard, color: "text-purple-500" },
  { name: "Slack", icon: Slack, color: "text-red-500" },
  { name: "Zapier", icon: Zap, color: "text-orange-500" },
  { name: "GitHub", icon: Github, color: "text-white" },
  { name: "Google", icon: Chrome, color: "text-green-500" },
  { name: "WhatsApp", icon: MessageSquare, color: "text-emerald-500" },
  { name: "Azure", icon: Shield, color: "text-sky-500" }
];

export function Integrations() {
  return (
    <section id="integrations" className="py-24 relative overflow-hidden z-10">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Seamless <TextGradient>Integrations</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            SmartLMS plays well with the tools you already use. Connect your ecosystem in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {integrations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <Card variant="glass" className="h-full border-white/5 flex items-center justify-center p-8 group glass-hover">
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    {item.name}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-6 py-3 rounded-full glass border-white/5 text-sm text-text-secondary">
          <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          More integrations arriving every week
        </div>
      </div>
    </section>
  );
}
