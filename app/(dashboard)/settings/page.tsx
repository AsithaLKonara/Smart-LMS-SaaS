import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function OrgSettingsPage() {
  return (
    <RefreshPageShell
      title="Organization Settings"
      subtitle="Configure branding, domains, and tenant-level behavior controls."
      stats={[
        { label: 'Brand Profiles', value: '2' },
        { label: 'Custom Domains', value: '1' },
        { label: 'Enabled Flags', value: '14' },
        { label: 'Pending Changes', value: '3' },
      ]}
      sections={[
        { title: 'Branding Controls', description: 'Manage logos, accent colors, and public-facing tenant styling options.' },
        { title: 'Domain & Access', description: 'Configure custom domains and enforce tenant-specific login policies.' },
      ]}
    />
  );
}
