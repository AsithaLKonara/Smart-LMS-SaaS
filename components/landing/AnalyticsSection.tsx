'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';

const metrics = [
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    desc: "Monitor student progress across modules with detailed heatmaps and drop-off analysis."
  },
  {
    icon: PieChart,
    title: "Retention Insights",
    desc: "Predict student churn with AI-powered engagement scoring and automated re-engagement."
  },
  {
    icon: Target,
    title: "Outcome Mapping",
    desc: "Align course content with learning objectives and track competency mastery in real-time."
  }
];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-24 relative overflow-hidden z-10 bg-white/[0.01]">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-last lg:order-first relative"
        >
          <div className="rounded-3xl glass border-white/10 p-6 shadow-2xl overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-bold text-text-primary">Cohort Retention Rate</h4>
                <p className="text-[10px] text-text-muted">Comparing Spring 2026 vs Winter 2025</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-accent-cyan" />
                </div>
              </div>
            </div>
            
            {/* Mock Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className={`w-full rounded-t-lg bg-gradient-to-t ${i % 2 === 0 ? 'from-accent-purple/40 to-accent-purple' : 'from-accent-cyan/40 to-accent-cyan'} border-t border-white/20`}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
              <div className="text-center">
                <p className="text-xl font-bold text-text-primary">+14%</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Completion</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-accent-cyan">8.2m</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Avg. Time</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-accent-purple">92%</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">CSAT Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent-cyan/20 w-fit">
            <BarChart3 className="w-4 h-4 text-accent-cyan" />
            <span className="text-accent-cyan text-xs font-bold uppercase tracking-wider">Data-Driven Growth</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-text-primary">
            Deep Insights, <br />
            <TextGradient>Not Just Data</TextGradient>
          </h2>
          
          <p className="text-text-secondary text-lg leading-relaxed">
            Stop guessing and start optimizing. Our analytics suite provides actionable intelligence that helps you understand exactly how your students learn and where your course needs improvement.
          </p>
          
          <div className="space-y-6">
            {metrics.map((metric, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent-cyan/50 transition-colors shrink-0">
                  <metric.icon className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">{metric.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
