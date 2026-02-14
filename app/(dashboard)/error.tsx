
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Container className="min-h-[70vh] flex flex-col items-center justify-center py-12">
            <div className="p-6 rounded-full bg-accent-purple/10 mb-8">
                <AlertTriangle className="h-16 w-16 text-accent-purple" />
            </div>

            <div className="text-center space-y-4 max-w-lg mb-10">
                <h1 className="text-4xl font-bold text-text-primary tracking-tight">
                    System Interruption
                </h1>
                <p className="text-lg text-text-secondary">
                    An unexpected error occurred in the dashboard. Our team has been notified, and we're working to fix it.
                </p>
            </div>

            <div className="flex gap-4">
                <Button onClick={() => reset()} size="lg">
                    Reload Dashboard
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
                    Back to Portal
                </Button>
            </div>
        </Container>
    );
}
