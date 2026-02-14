'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import type { Plan } from '@prisma/client';

interface OnboardingStep3Props {
  selectedPlan: Plan;
  onSelectPlan: (plan: Plan) => void;
}

const plans = [
  {
    id: 'FREE' as Plan,
    name: 'Free',
    price: '$0',
    period: 'forever',
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
    period: 'per month',
    features: [
      'Unlimited students',
      'Unlimited courses',
      'Advanced analytics',
      'AI-powered tutoring',
      'Priority support',
      'Custom branding',
    ],
    popular: true,
  },
  {
    id: 'ENTERPRISE' as Plan,
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
      'Training & onboarding',
    ],
  },
];

export function OnboardingStep3({ selectedPlan, onSelectPlan }: OnboardingStep3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Choose Your Plan
        </h2>
        <p className="text-text-secondary">
          Select the plan that best fits your needs. You can upgrade later.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.popular ? 'elevated' : 'default'}
            interactive
            className={cn(
              'cursor-pointer transition-all',
              selectedPlan === plan.id && 'ring-2 ring-accent-cyan',
              plan.popular && 'border-accent-cyan'
            )}
            onClick={() => onSelectPlan(plan.id)}
          >
            <CardHeader>
              {plan.popular && (
                <span className="text-xs font-semibold text-accent-cyan mb-2">
                  MOST POPULAR
                </span>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                {plan.period && (
                  <span className="text-text-secondary ml-2">/{plan.period}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-text-secondary">
                    <svg
                      className="w-5 h-5 text-accent-cyan mr-2 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

