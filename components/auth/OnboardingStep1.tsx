'use client';

import { useState, useEffect } from 'react';
import { Building2, Globe, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
    <div className="space-y-8 py-4">
      <div className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Organization Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Acme University"
              className={cn(
                "w-full h-12 glass-dark border rounded-xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white/10 transition-all font-medium",
                errors?.organizationName ? "border-red-500/50" : "border-white/5 focus:border-accent-cyan/30"
              )}
              value={data.organizationName}
              onChange={(e) => onChange({ ...data, organizationName: e.target.value })}
              required
            />
          </div>
          {errors?.organizationName && (
            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.organizationName}</p>
          )}
        </div>

        {/* Subdomain */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Platform URL</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-purple transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="acme"
              className={cn(
                "w-full h-12 glass-dark border rounded-xl pl-11 pr-24 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-white/10 transition-all font-medium",
                errors?.subdomain ? "border-red-500/50" : "border-white/5 focus:border-accent-purple/30"
              )}
              value={data.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              .smartlms.com
            </div>
          </div>

          <div className="flex items-center justify-between px-1 min-h-[20px]">
            {errors?.subdomain ? (
              <p className="text-[10px] text-red-500 font-bold uppercase">{errors.subdomain}</p>
            ) : data.subdomain.length >= 3 ? (
              <div className="flex items-center gap-2">
                {checking ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-accent-cyan" />
                    <span className="text-[10px] text-text-muted font-bold uppercase">Verifying domain...</span>
                  </>
                ) : subdomainAvailable === true ? (
                  <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Perfect! URL is available</span>
                  </>
                ) : subdomainAvailable === false ? (
                  <>
                    <X className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Oops! This URL is taken</span>
                  </>
                ) : null}
              </div>
            ) : (
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Pick a unique identifier for your academy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
