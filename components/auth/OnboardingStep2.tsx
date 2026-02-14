'use client';

import { Input } from '@/components/ui/Input';
import { useState } from 'react';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Admin Account
        </h2>
        <p className="text-text-secondary">
          Create your administrator account
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={data.adminName}
        onChange={(e) => onChange({ ...data, adminName: e.target.value })}
        error={errors?.adminName}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="admin@example.com"
        value={data.adminEmail}
        onChange={(e) => onChange({ ...data, adminEmail: e.target.value })}
        error={errors?.adminEmail}
        required
      />

      <div>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={data.adminPassword}
          onChange={(e) => onChange({ ...data, adminPassword: e.target.value })}
          error={errors?.adminPassword}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="mt-2 text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
        >
          {showPassword ? 'Hide' : 'Show'} password
        </button>
      </div>
    </div>
  );
}

