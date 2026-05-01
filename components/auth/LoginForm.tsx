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
import { Mail, Lock, LogIn, ChevronRight, AlertCircle, Loader2, Users, GraduationCap, ShieldCheck, Globe } from 'lucide-react';

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
        // Handle custom error codes from lib/auth/config.ts
        switch (result.error) {
          case 'db_connection_error':
            setError('Database connection failed. Please check your system configuration or contact support.');
            break;
          case 'invalid_credentials':
            setError('Invalid email or password. Please try again.');
            break;
          case 'auth_method_not_supported':
            setError('This account uses a different sign-in method (e.g., Google).');
            break;
          case 'CredentialsSignin':
            setError('Invalid email or password.');
            break;
          default:
            setError(result.error || 'An unexpected error occurred during sign in');
        }
        setLoading(false);
        return;
      }

      if (result?.ok) {
        const { getPostLoginRedirect } = await import('@/lib/auth/actions');
        const redirectUrl = await getPostLoginRedirect(validated.email, validated.tenantId);
        window.location.assign(redirectUrl);
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

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-text-muted font-bold tracking-widest backdrop-blur-sm">Demo Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { role: 'Student', email: 'student1@demo.com', icon: Users, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-600/5' },
              { role: 'Instructor', email: 'instructor@demo.com', icon: GraduationCap, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
              { role: 'Tenant Admin', email: 'admin@demo.com', icon: ShieldCheck, color: 'text-accent-purple', bg: 'from-purple-500/10 to-purple-600/5' },
              { role: 'Super Admin', email: 'superadmin@platform.com', icon: Globe, color: 'text-accent-cyan', bg: 'from-cyan-500/10 to-cyan-600/5' },
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => setFormData({ ...formData, email: demo.email, password: 'Password123!' })}
                className={`flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${demo.bg} border border-white/5 hover:border-white/20 transition-all group text-left w-full`}
              >
                <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform flex-shrink-0 ${demo.color}`}>
                  <demo.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${demo.color}`}>{demo.role}</p>
                  <p className="text-[9px] text-text-secondary truncate">{demo.email}</p>
                  <p className="text-[8px] text-text-muted font-mono">Password123!</p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
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
