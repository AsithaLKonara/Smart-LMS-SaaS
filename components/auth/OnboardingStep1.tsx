'use client';

import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';

interface OnboardingStep1Props {
  data: {
    organizationName: string;
    subdomain: string;
  };
  onChange: (data: { organizationName: string; subdomain: string }) => void;
  errors?: Record<string, string>;
}

export function OnboardingStep1({ data, onChange, errors }: OnboardingStep1Props) {
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkSubdomain = async () => {
      if (data.subdomain.length < 3) {
        setSubdomainAvailable(null);
        return;
      }

      setChecking(true);
      try {
        const response = await fetch(`/api/tenants?subdomain=${data.subdomain}`);
        const result = await response.json();
        setSubdomainAvailable(result.available);
      } catch (error) {
        setSubdomainAvailable(null);
      } finally {
        setChecking(false);
      }
    };

    const timeoutId = setTimeout(checkSubdomain, 500);
    return () => clearTimeout(timeoutId);
  }, [data.subdomain]);

  const handleSubdomainChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange({
      ...data,
      subdomain: cleaned,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Organization Details
        </h2>
        <p className="text-text-secondary">
          Let's start by setting up your organization
        </p>
      </div>

      <Input
        label="Organization Name"
        placeholder="Acme University"
        value={data.organizationName}
        onChange={(e) => onChange({ ...data, organizationName: e.target.value })}
        error={errors?.organizationName}
        required
      />

      <div>
        <Input
          label="Subdomain"
          placeholder="acme"
          value={data.subdomain}
          onChange={(e) => handleSubdomainChange(e.target.value)}
          error={errors?.subdomain}
          helperText="This will be your unique URL: acme.smartlms.com"
          required
        />
        {data.subdomain.length >= 3 && (
          <div className="mt-2">
            {checking ? (
              <p className="text-sm text-text-secondary">Checking availability...</p>
            ) : subdomainAvailable === true ? (
              <p className="text-sm text-green-500">✓ Subdomain is available</p>
            ) : subdomainAvailable === false ? (
              <p className="text-sm text-red-500">✗ Subdomain is already taken</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

