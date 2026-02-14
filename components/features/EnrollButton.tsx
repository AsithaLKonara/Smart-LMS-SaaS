'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        router.refresh();
        router.push(`/courses/${courseId}`);
      } else {
        alert(result.error || 'Failed to enroll in course');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} loading={loading} className="w-full" size="lg">
      Enroll Now
    </Button>
  );
}

