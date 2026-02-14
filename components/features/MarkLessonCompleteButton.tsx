'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface MarkLessonCompleteButtonProps {
  enrollmentId: string;
  lessonId: string;
  isCompleted: boolean;
}

export function MarkLessonCompleteButton({
  enrollmentId,
  lessonId,
  isCompleted,
}: MarkLessonCompleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });

      const result = await response.json();

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Failed to mark lesson as complete');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button variant="outline" disabled>
        ✓ Lesson Completed
      </Button>
    );
  }

  return (
    <Button onClick={handleComplete} loading={loading}>
      Mark as Complete
    </Button>
  );
}

