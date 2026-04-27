'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Zap, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';

const features = [
  {
    icon: MessageSquare,
    title: "AI Study Buddy",
    desc: "24/7 personalized AI assistant that helps students understand complex topics and provides instant feedback."
  },
  {
    icon: BrainCircuit,
    title: "Intelligent Insights",
    desc: "Automatically identifies learning gaps and suggests targeted lessons to improve student outcomes."
  },
  {
    icon: Zap,
    title: "Automated Grading",
    desc: "AI-powered evaluation for open-ended assignments and exams, saving instructors hundreds of hours."
  },
  {
    icon: Search,
    title: "Semantic Search",
    desc: "Search across all course videos and transcripts with natural language to find exact moments."
  }
];

export function AISection() {
  return (
    <section id="ai" className="py-24 relative overflow-hidden z-10">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent-purple/20 w-fit">
            <BrainCircuit className="w-4 h-4 text-accent-purple" />
            <span className="text-accent-purple text-xs font-bold uppercase tracking-wider">AI-First Education</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-text-primary">
            Learning Powered by <br />
            <TextGradient>Artificial Intelligence</TextGradient>
          </h2>
          
          <p className="text-text-secondary text-lg leading-relaxed max-w-lg">
            We've integrated advanced AI models at every level of the learning experience to make education more personalized, efficient, and engaging than ever before.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20">
                  <feature.icon className="w-5 h-5 text-accent-purple" />
                </div>
                <h4 className="font-bold text-text-primary">{feature.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden glass border-white/10 p-8 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-accent-cyan/20 opacity-50" />
            <div className="relative w-full h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 flex flex-col gap-6 shadow-2xl overflow-hidden">
               {/* Mock AI Interface */}
               <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                 <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center">
                   <BrainCircuit className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-sm font-bold">Smart AI Assistant</span>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-white/5 rounded-xl p-3 text-xs text-text-secondary max-w-[80%]">
                   How do I calculate the derivative of this function?
                 </div>
                 <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-xl p-3 text-xs text-text-primary ml-auto max-w-[80%]">
                   To calculate the derivative of f(x) = x², we use the power rule. The power rule states that...
                 </div>
                 <div className="bg-white/5 rounded-xl p-3 text-xs text-text-secondary max-w-[80%]">
                   Can you give me a real-world example?
                 </div>
                 <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-xl p-3 text-xs text-text-primary ml-auto max-w-[80%] animate-pulse">
                   Thinking... Analyzing motion physics...
                 </div>
               </div>
               
               <div className="mt-auto pt-4 border-t border-white/10">
                 <div className="bg-white/5 rounded-full px-4 py-2 text-[10px] text-text-muted italic">
                   AI is processing context from Module 4: Calculus Basics...
                 </div>
               </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-purple/20 blur-[40px] rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-cyan/10 blur-[60px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
