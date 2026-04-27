'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { TextGradient } from '@/components/ui/TextGradient';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    question: "Is there a free trial available?",
    answer: "Yes! You can start with our Starter plan which is free forever for up to 10 students. No credit card is required to sign up."
  },
  {
    question: "Can I use my own domain?",
    answer: "Absolutely. Our Pro and Enterprise plans allow you to connect custom domains (e.g., academy.yourbrand.com) and fully white-label the experience."
  },
  {
    question: "Does SmartLMS support SCORM?",
    answer: "Yes, we have robust support for SCORM 1.2 and 2004 standards. You can upload your existing packages directly into the Asset Library."
  },
  {
    question: "How secure is my data?",
    answer: "We use enterprise-grade encryption and multi-tenant isolation. Your data is stored securely and is never shared with other organizations on the platform."
  },
  {
    question: "What kind of support do you offer?",
    answer: "All plans include community support. Pro plans get priority email support, while Enterprise plans have a dedicated account manager and 24/7 technical assistance."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden z-10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Common <TextGradient>Questions</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Everything you need to know about the platform and how to get started.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card 
                variant="glass" 
                className={`border-white/5 overflow-hidden transition-all duration-300 ${openIndex === idx ? 'border-accent-purple/30' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left group"
                >
                  <span className={`font-semibold text-lg transition-colors ${openIndex === idx ? 'text-accent-purple' : 'text-text-primary group-hover:text-text-primary/80'}`}>
                    {faq.question}
                  </span>
                  {openIndex === idx ? (
                    <Minus className="w-5 h-5 text-accent-purple shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-muted shrink-0 group-hover:text-text-primary" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
