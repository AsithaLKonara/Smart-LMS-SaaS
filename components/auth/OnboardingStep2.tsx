'use client';

import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface OnboardingStep2Props {
  data: {
    adminEmail: string;
    adminPassword: string;
    adminName: string;
  };
  onChange: (data: { adminEmail: string; adminPassword: string; adminName: string }) => void;
  errors?: Record<string, string>;
}

export function OnboardingStep2({ data, onChange, errors }: OnboardingStep2Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Administrator Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className={cn(
                "w-full h-12 glass-dark border rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white/10 transition-all font-medium",
                errors?.adminName ? "border-red-500/50" : "border-white/5 focus:border-accent-cyan/30"
              )}
              value={data.adminName}
              onChange={(e) => onChange({ ...data, adminName: e.target.value })}
              required
            />
          </div>
          {errors?.adminName && (
            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.adminName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-purple transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="admin@academy.com"
              className={cn(
                "w-full h-12 glass-dark border rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white/10 transition-all font-medium",
                errors?.adminEmail ? "border-red-500/50" : "border-white/5 focus:border-accent-purple/30"
              )}
              value={data.adminEmail}
              onChange={(e) => onChange({ ...data, adminEmail: e.target.value })}
              required
            />
          </div>
          {errors?.adminEmail && (
            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.adminEmail}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Secure Password</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "w-full h-12 glass-dark border rounded-xl pl-11 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white/10 transition-all font-medium",
                errors?.adminPassword ? "border-red-500/50" : "border-white/5 focus:border-accent-cyan/30"
              )}
              value={data.adminPassword}
              onChange={(e) => onChange({ ...data, adminPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors?.adminPassword ? (
            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.adminPassword}</p>
          ) : (
            <p className="text-[10px] text-text-muted font-bold ml-1 uppercase tracking-wider">Use at least 8 characters with numbers & symbols</p>
          )}
        </div>
      </div>
    </div>
  );
}
