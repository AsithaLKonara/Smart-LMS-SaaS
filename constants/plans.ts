/**
 * Subscription plan constants
 */

export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface Plan {
  id: PlanType;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    users: number;
    courses: number;
    storage: number; // in GB
    aiQueries: number; // per month
  };
}

export const PLANS: Record<PlanType, Plan> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      'Up to 50 students',
      '5 courses',
      'Basic analytics',
      'Community support',
    ],
    limits: {
      users: 50,
      courses: 5,
      storage: 1,
      aiQueries: 100,
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: {
      monthly: 49,
      yearly: 490,
    },
    features: [
      'Up to 500 students',
      'Unlimited courses',
      'Advanced analytics',
      'AI-powered tutoring',
      'Priority support',
      'Custom branding',
    ],
    limits: {
      users: 500,
      courses: -1, // unlimited
      storage: 50,
      aiQueries: 5000,
    },
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      'Unlimited students',
      'Unlimited courses',
      'Advanced analytics',
      'AI-powered tutoring',
      'Dedicated support',
      'Custom branding',
      'SSO integration',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: {
      users: -1, // unlimited
      courses: -1, // unlimited
      storage: 500,
      aiQueries: -1, // unlimited
    },
  },
};

