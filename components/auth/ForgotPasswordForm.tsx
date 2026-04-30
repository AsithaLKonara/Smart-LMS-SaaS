'use client';

import { useState } from 'react';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validated = forgotPasswordSchema.parse({ email });
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card variant="elevated" className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-text-secondary">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Button type="submit" className="w-full" loading={loading} size="lg">
            Send Reset Link
          </Button>

          <div className="text-center text-sm text-text-secondary">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-accent-cyan hover:text-accent-cyan/80 transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

