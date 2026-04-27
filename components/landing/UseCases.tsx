'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Laptop } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';

const cases = [
  {
    icon: Building2,
    title: "Corporate Training",
    desc: "Scale your onboarding, compliance, and leadership training across global teams with multi-tenant isolation.",
    color: "accent-purple"
  },
  {
    icon: Laptop,
    title: "Course Creators",
    desc: "Turn your knowledge into a profitable business with built-in billing, community, and drip content.",
    color: "accent-cyan"
  },
  {
    icon: GraduationCap,
    title: "Academic Institutions",
    desc: "Modernize the classroom with AI tutoring, secure exam proctoring, and comprehensive gradebooks.",
    color: "accent-blue"
  }
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 relative overflow-hidden z-10 bg-white/[0.02]">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Built for Every <TextGradient>Scale & Sector</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Whether you are a solo creator or a Fortune 500 company, SmartLMS adapts to your specific learning architecture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          {cases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card variant="glass" className="h-full border-white/5 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${useCase.color}/5 blur-[60px] -z-10`} />
                <CardContent className="p-8 flex flex-col gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-${useCase.color}/10 flex items-center justify-center border border-${useCase.color}/20 group-hover:scale-110 transition-transform duration-500`}>
                    <useCase.icon className={`w-6 h-6 text-${useCase.color}`} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold text-text-primary">{useCase.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{useCase.desc}</p>
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
