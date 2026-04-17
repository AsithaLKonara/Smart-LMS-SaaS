'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Upload,
    Check,
    ChevronRight,
    UserPlus,
    BookOpen,
    Settings2,
    Palette,
    Sparkles,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextGradient } from '@/components/ui/TextGradient';
import { cn } from '@/lib/utils/cn';

interface OnboardingWizardProps {
    tenantId: string;
    onComplete: () => void;
}

export function OnboardingWizard({ tenantId, onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        logo: '',
        accentColor: '#22D3EE',
        teamInvites: '',
        importSample: true,
    });

    const totalSteps = 4;

    const handleNext = async () => {
        if (step === totalSteps) {
            setLoading(true);
            try {
                // Save onboarding status and config
                await fetch(`/api/tenants/${tenantId}/onboarding`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config),
                });
                onComplete();
            } catch (error) {
                console.error('Failed to complete onboarding:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-primary/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-dark border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        className="h-full bg-accent-cyan shadow-neon-cyan"
                    />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold font-heading mb-2">Step 1: <TextGradient>Branding</TextGradient></h2>
                                    <p className="text-text-secondary">Upload your logo and choose your primary brand color.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Academy Logo</label>
                                        <div className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-text-muted" />
                                            </div>
                                            <span className="text-xs font-medium text-text-secondary">Upload PNG/SVG</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Brand Color</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['#22D3EE', '#8b5cf6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6366F1'].map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, accentColor: color })}
                                                    className={cn(
                                                        "w-full aspect-square rounded-xl transition-all border-2",
                                                        config.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-text-muted italic">This color will be used for buttons, links, and highlights.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold font-heading mb-2">Step 2: <TextGradient>Team Access</TextGradient></h2>
                                    <p className="text-text-secondary">Invite your instructors and teaching assistants.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Addresses</label>
                                    <div className="relative">
                                        <textarea
                                            placeholder="instructor1@email.com, instructor2@email.com..."
                                            className="w-full h-32 glass-dark border border-white/5 rounded-2xl p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/30 transition-all font-medium resize-none"
                                            value={config.teamInvites}
                                            onChange={(e) => setConfig({ ...config, teamInvites: e.target.value })}
                                        />
                                        <div className="absolute top-4 right-4 text-text-muted">
                                            <UserPlus className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-accent-purple" />
                                        You can also do this later from the settings.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold font-heading mb-2">Step 3: <TextGradient>Kickstart</TextGradient></h2>
                                    <p className="text-text-secondary">Start with sample content to explore the platform faster.</p>
                                </div>

                                <div
                                    onClick={() => setConfig({ ...config, importSample: !config.importSample })}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 transition-all cursor-pointer group flex items-center justify-between",
                                        config.importSample ? "border-accent-cyan bg-accent-cyan/5" : "border-white/5 hover:border-white/20"
                                    )}
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                            config.importSample ? "bg-accent-cyan text-background-primary" : "bg-white/5 text-text-muted"
                                        )}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Import Sample Courses</h3>
                                            <p className="text-xs text-text-secondary">Adds 3 best-practice course templates with lessons.</p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                        config.importSample ? "bg-accent-cyan border-accent-cyan" : "border-white/10"
                                    )}>
                                        {config.importSample && <Check className="w-5 h-5 text-background-primary stroke-[3px]" />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center space-y-8 py-4"
                            >
                                <div className="w-20 h-20 bg-grad-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-neon-purple rotate-12">
                                    <Rocket className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold font-heading mb-3 tracking-tight">Ready for <TextGradient>Impact!</TextGradient></h2>
                                    <p className="text-text-secondary text-lg max-w-md mx-auto">
                                        Your configuration is locked in. It's time to build the future of education.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 flex justify-between gap-4">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="flex-1 h-14 rounded-2xl group"
                            onClick={() => step > 1 && setStep(step - 1)}
                            disabled={step === 1 || loading}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            loading={loading}
                            variant="premium"
                            size="lg"
                            className="flex-[2] h-14 rounded-2xl font-bold text-sm uppercase tracking-widest gap-2 group"
                        >
                            {step === totalSteps ? (
                                <>
                                    Complete Setup
                                    <Check className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function Rocket({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.5 8.5L21 3M15.5 8.5L8.5 15.5M15.5 8.5L18.5 11.5M8.5 15.5L3 21M8.5 15.5L5.5 12.5M21 3L18.5 5.5M3 21L5.5 18.5"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13L10 14M12 11L13 12M14 9L15 10"
            />
        </svg>
    );
}
