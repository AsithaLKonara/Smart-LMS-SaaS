import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function IntegrationsPage() {
  return (
    <RefreshPageShell
      title="Integrations"
      subtitle="Connect external tools for video, payments, identity, and automation."
      stats={[
        { label: 'Connected Apps', value: '6' },
        { label: 'API Keys', value: '4' },
        { label: 'Sync Jobs', value: '27' },
        { label: 'Failed Syncs', value: '1' },
      ]}
      sections={[
        { title: 'Provider Connections', description: 'Manage Zoom, Stripe, Google, and custom connectors from one panel.' },
        { title: 'API Credentials', description: 'Rotate keys and monitor webhook health for third-party integrations.' },
      ]}
    />
  );
}
