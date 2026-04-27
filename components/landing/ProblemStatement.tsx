'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ZapOff, Users2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';

const problems = [
  {
    icon: AlertCircle,
    title: "Low Engagement",
    desc: "Static content leads to 70% drop-off rates. Traditional platforms feel like digital libraries, not learning hubs."
  },
  {
    icon: ZapOff,
    title: "Complex Setup",
    desc: "Legacy systems take months to deploy. You need agility to launch and scale your courses in days, not weeks."
  },
  {
    icon: Users2,
    title: "Isolated Learning",
    desc: "Education is social, yet most LMS platforms isolate students in a vacuum without real-time interaction."
  }
];

export function ProblemStatement() {
  return (
    <section className="py-24 relative overflow-hidden z-10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Stop Settling for <TextGradient from="from-red-500" to="to-orange-500">Legacy Learning</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Traditional LMS platforms are built for the desktop era—slow, clunky, and uninspiring. 
            SmartLMS is built for the futuristic organization.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          {problems.map((prob, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card variant="glass" className="h-full border-white/5 hover:border-red-500/20 transition-colors group">
                <CardContent className="p-8 flex flex-col gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                    <prob.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-text-primary">{prob.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{prob.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
