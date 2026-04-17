'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function DashboardError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-text-primary">Something went wrong</h2>
      <p className="max-w-md text-text-secondary text-sm">
        {error.message || 'This page could not be loaded. You can try again.'}
      </p>
      <Button type="button" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
