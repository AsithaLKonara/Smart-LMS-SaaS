'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Check, Rocket, Settings, BookOpen, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TextGradient } from '@/components/ui/TextGradient';

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

  const steps = [
    { icon: Settings, text: 'Customize your branding and color palette' },
    { icon: BookOpen, text: 'Upload or create your first learning module' },
    { icon: Users, text: 'Invite your team and first cohort of students' },
    { icon: Rocket, text: `Access your portal at ${tenantData.subdomain}.smartlms.com` },
  ];

  return (
    <div className="space-y-10 text-center py-4">
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-grad-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-neon-purple rotate-12"
        >
          <Check className="w-12 h-12 text-white stroke-[3px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold font-heading mb-3 tracking-tight">
            Academy <TextGradient>Launched!</TextGradient>
          </h2>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            <strong className="text-text-primary">{tenantData.name}</strong> is ready for action. Your digital learning empire starts now.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-dark rounded-3xl p-8 border border-white/5 space-y-6 text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-3xl rounded-full" />

        <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-4">Launch Checklist:</h3>
        <div className="grid gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4 text-sm text-text-secondary group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/10 group-hover:text-accent-cyan transition-colors">
                <step.icon className="w-4 h-4" />
              </div>
              <span className="font-medium group-hover:text-text-primary transition-colors">{step.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          variant="premium"
          size="lg"
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl text-white font-bold text-sm uppercase tracking-widest gap-2 group"
        >
          Enter Workspace
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
}
