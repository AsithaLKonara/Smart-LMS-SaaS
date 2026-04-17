'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validated = loginSchema.parse(formData);

      const result = await signIn('credentials', {
        email: validated.email,
        password: validated.password,
        tenantId: validated.tenantId,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
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

  return (
    <Card variant="glass" className="shadow-premium overflow-hidden glass-hover">
      <CardHeader className="p-8 pb-4 text-center">
        <CardTitle className="text-3xl font-bold font-heading mb-2">Welcome Back</CardTitle>
        <CardDescription className="text-text-secondary">
          Enter your credentials to access your workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 glass-dark border border-white/5 rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/30 focus:bg-white/10 transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent-cyan hover:text-white transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-purple transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 glass-dark border border-white/5 rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/30 focus:bg-white/10 transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <input
              id="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-background-secondary text-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              Stay signed in for 30 days
            </label>
          </div>

          <Button
            type="submit"
            variant="premium"
            className="w-full h-12 rounded-xl text-white font-bold text-sm uppercase tracking-widest gap-2 group"
            loading={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-accent-cyan hover:text-white transition-colors font-bold underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
