'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/auth/Stepper';
import { OnboardingStep1 } from '@/components/auth/OnboardingStep1';
import { OnboardingStep2 } from '@/components/auth/OnboardingStep2';
import { OnboardingStep3 } from '@/components/auth/OnboardingStep3';
import { OnboardingStep4 } from '@/components/auth/OnboardingStep4';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { tenantOnboardingSchema, type TenantOnboardingInput } from '@/lib/validation/auth';
import type { Plan } from '@prisma/client';
import Link from 'next/link';
import { TextGradient } from '@/components/ui/TextGradient';
import { ArrowLeft, ChevronRight, ChevronLeft, Rocket } from 'lucide-react';

const steps = ['Organization', 'Admin Account', 'Plan', 'Complete'];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [onboardingData, setOnboardingData] = useState<Partial<TenantOnboardingInput>>({
    organizationName: '',
    subdomain: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    plan: 'FREE',
  });
  const [completedData, setCompletedData] = useState<{
    tenant: { name: string; subdomain: string };
    user: { email: string; name: string };
  } | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!onboardingData.organizationName || onboardingData.organizationName.length < 2) {
        newErrors.organizationName = 'Organization name must be at least 2 characters';
      }
      if (!onboardingData.subdomain || onboardingData.subdomain.length < 3) {
        newErrors.subdomain = 'Subdomain must be at least 3 characters';
      } else if (!/^[a-z0-9-]+$/.test(onboardingData.subdomain)) {
        newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
      }
    }

    if (step === 2) {
      if (!onboardingData.adminName || onboardingData.adminName.length < 2) {
        newErrors.adminName = 'Name must be at least 2 characters';
      }
      if (!onboardingData.adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingData.adminEmail)) {
        newErrors.adminEmail = 'Invalid email address';
      }
      if (!onboardingData.adminPassword || onboardingData.adminPassword.length < 8) {
        newErrors.adminPassword = 'Password must be at least 8 characters';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(onboardingData.adminPassword)) {
        newErrors.adminPassword =
          'Password must contain uppercase, lowercase, and number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 3) {
      // Submit onboarding
      setLoading(true);
      try {
        const validated = tenantOnboardingSchema.parse(onboardingData);
        const response = await fetch('/api/auth/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validated),
        });

        const result = await response.json();

        if (!result.success) {
          setErrors({ _general: result.error || 'Onboarding failed' });
          setLoading(false);
          return;
        }

        setCompletedData({
          tenant: result.tenant,
          user: result.user,
        });
        setCurrentStep(4);
      } catch (error) {
        setErrors({
          _general: error instanceof Error ? error.message : 'Onboarding failed',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <Card className="glass border-white/10 shadow-premium w-full max-w-2xl mx-auto overflow-hidden">
      <CardContent className="p-8 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-heading mb-2">Create your <TextGradient>Academy</TextGradient></h1>
          <p className="text-text-secondary text-sm">Join 1,000+ organizations scaling with SmartLMS</p>
        </div>

        <Stepper currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        <div className="mt-8 min-h-[400px]">
          {currentStep === 1 && (
            <OnboardingStep1
              data={{
                organizationName: onboardingData.organizationName || '',
                subdomain: onboardingData.subdomain || '',
              }}
              onChange={(data) =>
                setOnboardingData({ ...onboardingData, ...data })
              }
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStep2
              data={{
                adminEmail: onboardingData.adminEmail || '',
                adminPassword: onboardingData.adminPassword || '',
                adminName: onboardingData.adminName || '',
              }}
              onChange={(data) =>
                setOnboardingData({ ...onboardingData, ...data })
              }
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <OnboardingStep3
              selectedPlan={(onboardingData.plan as Plan) || 'FREE'}
              onSelectPlan={(plan) =>
                setOnboardingData({ ...onboardingData, plan })
              }
            />
          )}

          {currentStep === 4 && completedData && (
            <OnboardingStep4
              tenantData={completedData.tenant}
              userData={completedData.user}
              password={onboardingData.adminPassword || ''}
            />
          )}
        </div>

        {errors._general && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
            {errors._general}
          </div>
        )}

        {currentStep < 4 && (
          <div className="mt-12 flex justify-between gap-4">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1 h-12 rounded-xl group"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              <ChevronLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              loading={loading}
              variant="premium"
              size="lg"
              className="flex-[2] h-12 rounded-xl group"
            >
              {currentStep === 3 ? 'Launch Academy' : 'Continue'}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-accent-cyan hover:text-accent-cyan/80 transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

