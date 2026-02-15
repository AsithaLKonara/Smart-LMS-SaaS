'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface OnboardingStep4Props {
  tenantData: {
    name: string;
    subdomain: string;
  };
  userData: {
    email: string;
    name: string;
  };
  password: string;
}

export function OnboardingStep4({ tenantData, userData, password }: OnboardingStep4Props) {
  const router = useRouter();

  const handleContinue = async () => {
    // Auto sign in the user
    await signIn('credentials', {
      email: userData.email,
      password: password,
      redirect: true,
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-accent-cyan"
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
        </div>
        <h2 className="text-3xl font-semibold text-text-primary mb-2">
          Welcome to Smart LMS!
        </h2>
        <p className="text-text-secondary">
          Your organization <strong className="text-text-primary">{tenantData.name}</strong> has been created successfully.
        </p>
      </div>

      <div className="bg-background-card rounded-lg p-6 space-y-4 text-left">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Next Steps:</h3>
          <ul className="space-y-2 text-text-secondary">
            <li className="flex items-start">
              <span className="text-accent-cyan mr-2">1.</span>
              <span>Customize your organization settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-cyan mr-2">2.</span>
              <span>Create your first course</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-cyan mr-2">3.</span>
              <span>Invite students and instructors</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent-cyan mr-2">4.</span>
              <span>Access your dashboard at {tenantData.subdomain}.smartlms.com</span>
            </li>
          </ul>
        </div>
      </div>

      <Button size="lg" onClick={handleContinue} className="w-full">
        Go to Dashboard
      </Button>
    </div>
  );
}

