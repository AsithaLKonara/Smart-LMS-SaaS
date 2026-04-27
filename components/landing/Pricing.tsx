'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { TextGradient } from '@/components/ui/TextGradient';

const tiers = [
  {
    name: "Starter",
    price: "$0",
    desc: "Perfect for exploring the platform",
    features: [
      "Up to 10 students",
      "3 active courses",
      "Basic analytics",
      "Community support",
      "100MB asset storage"
    ],
    buttonText: "Get Started",
    premium: false
  },
  {
    name: "Pro",
    price: "$99",
    desc: "Everything you need to grow",
    features: [
      "Unlimited students",
      "Unlimited courses",
      "Advanced AI Tutoring",
      "SCORM support",
      "10GB asset storage",
      "Priority email support"
    ],
    buttonText: "Go Pro",
    premium: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large-scale organizations",
    features: [
      "Multi-tenant isolation",
      "SSO & Custom domains",
      "Dedicated account manager",
      "Custom integrations",
      "1TB+ asset storage",
      "99.9% SLA"
    ],
    buttonText: "Contact Sales",
    premium: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden z-10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            Transparent <TextGradient>Pricing</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Choose the plan that fits your growth. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative"
            >
              {tier.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-purple rounded-full text-[10px] font-bold text-white uppercase tracking-widest z-20 shadow-lg shadow-accent-purple/20">
                  Most Popular
                </div>
              )}
              
              <Card 
                variant={tier.premium ? 'glass-dark' : 'glass'} 
                className={`h-full flex flex-col border-white/5 transition-all duration-500 ${tier.premium ? 'scale-105 border-accent-purple/30 shadow-2xl shadow-accent-purple/10 z-10' : 'hover:border-white/20'}`}
              >
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">{tier.desc}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 pt-0 flex-1 flex flex-col gap-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-text-secondary text-sm">/month</span>}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                        <Check className="w-4 h-4 text-accent-cyan shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-8 pt-0">
                  <Button 
                    variant={tier.premium ? 'premium' : 'glass'} 
                    className="w-full h-12"
                    size="lg"
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-text-muted text-xs flex items-center gap-2">
          <Zap className="w-3 h-3 text-accent-purple" />
          Annual billing saves you 20% on all plans.
        </p>
      </div>
    </section>
  );
}
