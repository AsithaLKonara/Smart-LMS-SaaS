
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertCircle, RotateCcw } from 'lucide-react';

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
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card variant="elevated" className="max-w-md w-full border-red-500/20 bg-red-500/5">
                <CardContent className="pt-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-red-500/10">
                            <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            We encountered an error while loading your dashboard. This might be a temporary connection issue.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => reset()}
                            variant="primary"
                            className="w-full gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Try again
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="ghost"
                            className="w-full text-text-muted hover:text-text-primary"
                        >
                            Return Home
                        </Button>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-[10px] text-red-400 font-mono mt-4 p-2 bg-black/40 rounded truncate">
                            {error.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
