'use client';

import { useState } from 'react';
import { OnboardingWizard } from './OnboardingWizard';
import { useRouter } from 'next/navigation';

interface OnboardingTriggerProps {
    tenantId: string;
    show: boolean;
}

export function OnboardingTrigger({ tenantId, show }: OnboardingTriggerProps) {
    const [isVisible, setIsVisible] = useState(show);
    const router = useRouter();

    if (!isVisible) return null;

    return (
        <OnboardingWizard
            tenantId={tenantId}
            onComplete={() => {
                setIsVisible(false);
                router.refresh(); // Refresh to update tenant config in Topbar/Sidebar
            }}
        />
    );
}
