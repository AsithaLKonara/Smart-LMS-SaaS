'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import type { Plan } from '@prisma/client';
import { Check, Sparkles, Zap, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface OnboardingStep3Props {
  selectedPlan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

const plans = [
  {
    id: 'FREE' as Plan,
    name: 'Free',
    price: '$0',
    period: 'mo',
    icon: Zap,
    features: [
      'Up to 50 students',
      '5 courses',
      'Basic analytics',
      'Community support',
    ],
  },
  {
    id: 'PRO' as Plan,
    name: 'Pro',
    price: '$99',
    period: 'mo',
    icon: Sparkles,
    features: [
      'Unlimited students',
      'Unlimited courses',
      'Advanced AI Tutor',
      'Priority support',
      'Custom branding',
      'Custom domain',
    ],
    popular: true,
  },
  {
    id: 'ENTERPRISE' as Plan,
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    icon: Building,
    features: [
      'Everything in Pro',
      'SLA Guarantee',
      'Custom integrations',
      'Dedicated Manager',
      'On-premise option',
      'SSO / SAML',
    ],
  },
];

export function OnboardingStep3({ selectedPlan, onSelectPlan }: OnboardingStep3Props) {
  return (
    <div className="space-y-8 py-4">
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex"
          >
            <Card
              className={cn(
                'group relative flex-1 glass border transition-all duration-300 overflow-hidden flex flex-col',
                selectedPlan === plan.id
                  ? 'border-accent-cyan shadow-neon-cyan ring-1 ring-accent-cyan/20'
                  : 'border-white/5 hover:border-white/20',
                plan.popular && 'border-accent-purple/50'
              )}
              onClick={() => onSelectPlan(plan.id)}
            >
              {/* Background Glow for Selected */}
              {selectedPlan === plan.id && (
                <div className="absolute inset-0 bg-accent-cyan/5 -z-10" />
              )}

              <CardHeader className="p-6 border-b border-white/5 pb-6">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    selectedPlan === plan.id ? "bg-accent-cyan text-background-primary" : "bg-white/5 text-text-muted"
                  )}>
                    <plan.icon className="w-5 h-5" />
                  </div>
                  {plan.popular && (
                    <span className="text-[10px] font-bold text-accent-purple bg-accent-purple/10 px-2 py-1 rounded-full border border-accent-purple/20">
                      POPULAR
                    </span>
                  )}
                </div>

                <CardTitle className="text-xl font-heading mb-1">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-text-primary tracking-tight">{plan.price}</span>
                  {plan.period && (
                    <span className="text-text-muted text-xs font-medium">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col justify-between gap-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-xs font-medium text-text-secondary">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                        selectedPlan === plan.id ? "bg-accent-cyan/20" : "bg-white/5"
                      )}>
                        <Check className={cn(
                          "w-3 h-3",
                          selectedPlan === plan.id ? "text-accent-cyan" : "text-text-muted"
                        )} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
