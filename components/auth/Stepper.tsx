'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-12">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1 relative">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? 'var(--accent-cyan)' : 'transparent',
                    borderColor: isCompleted || isActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                  }}
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all border-2 z-10',
                    isCompleted || isActive ? 'text-background-primary shadow-neon-cyan' : 'text-text-muted',
                    isActive && 'scale-110'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3px]" />
                  ) : (
                    <span className="font-heading">{stepNumber}</span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="stepper-glow"
                      className="absolute inset-0 rounded-2xl bg-accent-cyan/20 blur-xl -z-10"
                    />
                  )}
                </motion.div>

                <span
                  className={cn(
                    'absolute -bottom-8 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap transition-colors duration-300',
                    isActive ? 'text-accent-cyan' : 'text-text-muted'
                  )}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-white/5 mx-4 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    className="absolute inset-0 bg-accent-cyan shadow-neon-cyan"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
